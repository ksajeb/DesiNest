package com.eventsphere.booking_service.service.impl;


import com.eventsphere.booking_service.config.ListingClients;
import com.eventsphere.booking_service.config.UserClients;
import com.eventsphere.booking_service.dto.BookingRequestDto;
import com.eventsphere.booking_service.dto.BookingResponseDto;
import com.eventsphere.booking_service.entity.Booking;
import com.eventsphere.booking_service.entity.BookingStatus;
import com.eventsphere.booking_service.exception.ValidationException;
import com.eventsphere.booking_service.kafka.BookingProducer;
import com.eventsphere.booking_service.repository.BookingRepository;
import com.eventsphere.booking_service.service.BookingService;
import com.eventsphere.booking_service.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
@Slf4j
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ListingClients listingClients;

    @Autowired
    private UserClients userClients;

    @Autowired
    private BookingProducer bookingProducer;

    @Autowired
    private EmailService emailService;

    @Override
    public BookingResponseDto createBooking(BookingRequestDto request) {
        log.info("Received booking request: {}", request);

        //validation for the listing and users
        validateRequest(request);

        // availability checking
        validateAvailability(request.getListingId(),request.getCheckInDate(),request.getCheckOutDate());

        //lock inventory
        lockInventory(request.getListingId(),request.getCheckInDate(),request.getCheckOutDate());

        Booking booking = new Booking();
        booking.setListingId(request.getListingId());
        booking.setUserId(request.getUserId());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());

        log.debug("Mapped Booking entity: {}", booking);

        booking.setStatus(BookingStatus.PAYMENT_PENDING);
        double totalAmount = calculateTotalAmount(request);
        booking.setTotalAmount(totalAmount);

        log.info("Booking after setting status and amount: {}", booking);

        Booking savedBooking = bookingRepository.saveAndFlush(booking);
        log.info("Booking saved successfully with ID: {}", savedBooking.getId());

        //Send Kafka Event
        try {
            bookingProducer.sendBookingCreatedEvent(
                    savedBooking.getId(),
                    savedBooking.getTotalAmount()
            );
        } catch (Exception e) {
            log.error("Failed to send Kafka event", e);
        }

        BookingResponseDto response = modelMapper.map(savedBooking, BookingResponseDto.class);
        log.debug("Mapped Response DTO: {}", response);
        return response;

    }

    @Override
    @Cacheable(value = "allBookings")
    public List<BookingResponseDto> getAllBooking() {
        log.info("Fetching all bookings from the database");

        List<Booking> bookings = bookingRepository.findAll();
        log.debug("Fetched {} bookings: {}", bookings.size(), bookings);

        List<BookingResponseDto> responseList = bookings.stream()
                .map(booking -> {
                    BookingResponseDto dto = modelMapper.map(booking, BookingResponseDto.class);
                    log.trace("Mapped Booking to DTO: {}", dto);
                    return dto;
                })
                .toList();

        log.info("Returning {} BookingResponseDto objects", responseList.size());
        return responseList;
    }

    @Override
    @Cacheable(value = "bookings", key = "#id")
    public BookingResponseDto getBookingById(Long id) {
        log.info("Fetching booking with ID: {}", id);

        if (id == null) {
            log.warn("Booking ID is null");
            throw new ValidationException("Booking ID is required");
        }
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Booking not found with ID: {}", id);
                    return new ValidationException("Booking not found with ID: " + id);
                });

        log.debug("Booking entity fetched from DB: {}", booking);
        BookingResponseDto response = modelMapper.map(booking, BookingResponseDto.class);

        log.debug("Mapped BookingResponseDto: {}", response);

        log.info("Returning booking details for ID: {}", id);
        return response;
    }

    @Override
    @Cacheable(value = "userBookings", key = "#userId")
    public List<BookingResponseDto> getBookingsByUser(Long userId) {
        log.info("Fetching bookings for user ID: {}", userId);

        if (userId == null) {
            throw new ValidationException("User ID is required");
        }

        if (!userClients.existsById(userId)) {
            throw new ValidationException("User does not exist");
        }

        List<Booking> bookings = bookingRepository.findByUserId(userId);

        log.debug("Found {} bookings for user {}", bookings.size(), userId);

        return bookings.stream()
                .map(booking -> modelMapper.map(booking, BookingResponseDto.class))
                .toList();
    }

    @Override
    @CacheEvict(value = {"allBookings", "bookings", "userBookings"}, allEntries = true)
    public void confirmBooking(Long bookingId) {
        log.info("Confirm Booking is called");
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            log.info("Booking already confirmed");
            return;
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        log.info("Booking status updated to CONFIRMED");

        var user = userClients.getUserById(booking.getUserId());
        log.info("User fetched: {}", user.getEmail());
        try {
            emailService.sendBookingConfirmation(
                    user.getEmail(),
                    booking.getId()
            );
        } catch (Exception e) {
            log.error("Email sending failed", e);
        }

        log.info("Email process finished");
    }

    @Override
    @CacheEvict(value = {"allBookings", "bookings", "userBookings"}, allEntries = true)
    public void cancelBooking(Long bookingId) {
        log.info("cancel Booking called for bookingId={}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking cancelled successfully");
        var user = userClients.getUserById(booking.getUserId());

        try {
            emailService.sendBookingCancellation(
                    user.getEmail(),
                    booking.getId()
            );
        } catch (Exception e) {
            log.error("Cancellation email sending failed", e);
        }

        log.info("Cancellation email process finished");
    }

    @Override
    public List<Long> getBookedListingIds(String startDate, String endDate) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return bookingRepository.findBookedListingIds(start, end);
    }

    private void validateRequest(BookingRequestDto request) {
        log.debug("Validating booking request");
        if (request.getListingId() == null)
            throw new ValidationException("Listing ID is required");

        if (request.getUserId() == null)
            throw new ValidationException("User ID is required");

        if (!listingClients.existsById(request.getListingId()))
            throw new ValidationException("Listing does not exist");

        if (!userClients.existsById(request.getUserId()))
            throw new ValidationException("User does not exist");

        if (request.getCheckInDate() == null)
            throw new ValidationException("Check-in date required");

        if (request.getCheckOutDate() == null)
            throw new ValidationException("Check-out date required");

        if (request.getCheckInDate().isBefore(LocalDate.now()))
            throw new ValidationException("Check-in date cannot be in past");

        if (!request.getCheckOutDate()
                .isAfter(request.getCheckInDate()))
            throw new ValidationException("Invalid checkout date");
        log.debug("Validation successful");
    }

    private void validateAvailability(Long listingId, LocalDate checkIn, LocalDate checkOut) {
        log.debug("Checking availability listingId={} dates={} - {}",listingId, checkIn, checkOut);

        boolean exists = bookingRepository.existsOverlappingBooking(listingId,checkIn,checkOut);
        if (exists) {
            log.warn("Listing not available listingId={}", listingId);
            throw new ValidationException(
                    "Listing not available for selected dates"
            );
        }
        log.debug("Listing available");
    }

    private void lockInventory(Long listingId,LocalDate checkIn,LocalDate checkOut) {
        log.info("Inventory locked for listing {}", listingId);
    }

    private double calculateTotalAmount(BookingRequestDto request) {

        // fetch listing details
        var listing = listingClients.getListingById(request.getListingId());

        double pricePerNight = listing.getRent();

        long nights = java.time.temporal.ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (nights <= 0) {
            throw new ValidationException("Invalid booking duration");
        }

        double totalAmount = pricePerNight * nights;

        log.info("Calculated total amount: {} ({} nights * {})",
                totalAmount, nights, pricePerNight);

        return totalAmount;
    }

}
