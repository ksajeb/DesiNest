package com.eventsphere.booking_service.service.impl;


import com.eventsphere.booking_service.config.PaymentClients;
import com.eventsphere.booking_service.dto.BookingRequestDto;
import com.eventsphere.booking_service.dto.BookingResponseDto;
import com.eventsphere.booking_service.dto.PaymentRequestDto;
import com.eventsphere.booking_service.dto.PaymentResponseDto;
import com.eventsphere.booking_service.entity.Booking;
import com.eventsphere.booking_service.entity.BookingStatus;
import com.eventsphere.booking_service.exception.ValidationException;
import com.eventsphere.booking_service.repository.BookingRepository;
import com.eventsphere.booking_service.service.BookingService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    private PaymentClients paymentClients;


    @Override
    public BookingResponseDto createBooking(BookingRequestDto request) {
//        if (!listingRepository.existsById(request.getListingId())) {
//            throw new ValidationException("Listing does not exist");
//        }

//        if (!userRepository.existsById(request.getUserId())) {
//            throw new ValidationException("User does not exist");
//        }

        if (request.getListingId() == null) {
            throw new ValidationException("Listing ID is required");
        }

        if (request.getUserId() == null) {
            throw new ValidationException("User ID is required");
        }

        if (request.getCheckInDate() == null) {
            throw new ValidationException("Check-in date is required");
        }

        if (request.getCheckOutDate() == null) {
            throw new ValidationException("Check-out date is required");
        }

        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Check-in date cannot be in the past");
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new ValidationException(
                    "Check-out date must be after check-in date"
            );
        }

        log.info("Received booking request: {}", request);

        Booking booking = new Booking();
        booking.setListingId(request.getListingId());
        booking.setUserId(request.getUserId());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());

        log.debug("Mapped Booking entity: {}", booking);

        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalAmount(5000.0);


        log.info("Booking after setting status and amount: {}", booking);

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking saved successfully with ID: {}", savedBooking.getId());

        PaymentResponseDto payment = null;

        try {
            log.info("Calling Payment Service for bookingId: {}", savedBooking.getId());

            PaymentRequestDto paymentRequest = new PaymentRequestDto();
            paymentRequest.setBookingId(savedBooking.getId());
            paymentRequest.setAmount(savedBooking.getTotalAmount());
            paymentRequest.setCurrency("INR");

            payment = paymentClients.createPayment(paymentRequest);

            log.info("Payment success. RazorpayPaymentId: {}", payment.getRazorpayPaymentId());

            savedBooking.setPaymentId(payment.getRazorpayPaymentId());
            savedBooking.setStatus(BookingStatus.CONFIRMED);

            bookingRepository.save(savedBooking);

        } catch (Exception ex) {
            log.error("Payment failed for bookingId: {}", savedBooking.getId(), ex);

            savedBooking.setStatus(BookingStatus.FAILED);
            bookingRepository.save(savedBooking);

            throw new RuntimeException("Payment failed. Booking marked as FAILED.");
        }
        BookingResponseDto response = modelMapper.map(savedBooking, BookingResponseDto.class);
        response.setPaymentId(payment.getRazorpayPaymentId());

        if (payment != null) {
            response.setPaymentId(payment.getRazorpayPaymentId());
            response.setRazorpayOrderId(payment.getRazorpayOrderId());
        }

        log.debug("Mapped Response DTO: {}", response);
        return response;
    }

    @Override
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
}
