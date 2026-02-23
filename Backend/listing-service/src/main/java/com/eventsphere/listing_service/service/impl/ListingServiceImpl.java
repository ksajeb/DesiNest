package com.eventsphere.listing_service.service.impl;

import com.eventsphere.listing_service.Config.BookingClients;
import com.eventsphere.listing_service.Config.UserClients;
import com.eventsphere.listing_service.dto.ListingRequestDto;
import com.eventsphere.listing_service.dto.ListingResponseDto;
import com.eventsphere.listing_service.dto.UserDto;
import com.eventsphere.listing_service.entity.Listing;
import com.eventsphere.listing_service.entity.ListingImage;
import com.eventsphere.listing_service.exception.ResourceNotFoundException;
import com.eventsphere.listing_service.repository.ListingRepository;
import com.eventsphere.listing_service.service.FileService;
import com.eventsphere.listing_service.service.ListingService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ListingServiceImpl implements ListingService {

    @Autowired
    private FileService fileService;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserClients userClients;

    @Autowired
    private BookingClients bookingClients;

    @Override
    @CacheEvict(value = {"allListings", "listingsByUser"}, allEntries = true)
    public ListingResponseDto addListing(ListingRequestDto listingDto) throws IOException {
        log.info("Creating new listing for ownerUserId={}", listingDto.getOwnerUserId());

        UserDto user;
        try {
            user = userClients.getUserById(listingDto.getOwnerUserId());
        } catch (Exception ex) {
            log.error("User not found with id={}", listingDto.getOwnerUserId());
            throw new ResourceNotFoundException(
                    "User not found with id: " + listingDto.getOwnerUserId()
            );
        }

        log.info("Verified user from User Service: id={}, name={}", user.getId(), user.getName());

        Listing listing = new Listing();
        listing.setId(null);
        listing.setTitle(listingDto.getTitle());
        listing.setDescription(listingDto.getDescription());
        listing.setOwnerUserId(user.getId());
        listing.setRent(listingDto.getRent());
        listing.setCity(listingDto.getCity());
        listing.setLandmark(listingDto.getLandmark());
        listing.setCategory(listingDto.getCategory());
        listing.setMaxGuests(listingDto.getMaxGuests());

        List<ListingImage> imageList = new ArrayList<>();
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : listingDto.getImages()) {
            String url = fileService.uploadFile(file);

            ListingImage img = new ListingImage();
            img.setImageUrl(url);
            img.setListing(listing);

            imageList.add(img);
            imageUrls.add(url);
        }

        listing.setImages(imageList);

        Listing saved = listingRepository.save(listing);
        log.info("Listing created successfully with id={}", saved.getId());

        ListingResponseDto response = modelMapper.map(saved, ListingResponseDto.class);
        response.setImages(imageUrls);

        response.setOwnerUserId(user.getId());

        return response;
    }

    @Override
    @Cacheable(value = "allListings")
    public List<ListingResponseDto> getAllListing() {

        log.info("Fetching all listings");

        List<Listing> listings = listingRepository.findAll();

        if (listings.isEmpty()) {
            log.warn("No listings present in database");
            throw new ResourceNotFoundException("No listings found");
        }

        log.debug("Found {} listings", listings.size());

        return listings.stream().map(listing -> {

            log.debug("Mapping listing with id={}", listing.getId());

            // Map basic fields
            ListingResponseDto dto = modelMapper.map(listing, ListingResponseDto.class);

            // get the URLs of the image
            List<String> imageUrls = listing.getImages()
                    .stream()
                    .map(ListingImage::getImageUrl)
                    .toList();

            dto.setImages(imageUrls);

            log.debug("Listing with the id={} mapped with {} images",listing.getId(),imageUrls.size());

            return dto;

        }).toList();
    }


    @Override
    @Cacheable(value = "listingById", key = "#id")
    public ListingResponseDto getListingById(Long id) {
        log.info("Fetching listing with id={}", id);
        Listing listing=listingRepository.findById(id).orElseThrow(()-> {
            log.warn("Listing not found with id={}", id);
            return new ResourceNotFoundException("Listing not found with id: " + id);
        });
        log.debug("Listing found: id={}, title={}", listing.getId(), listing.getTitle());

        ListingResponseDto dto = modelMapper.map(listing, ListingResponseDto.class);

        List<String> imageUrls = listing.getImages()
                .stream()
                .map(ListingImage::getImageUrl)
                .toList();

        dto.setImages(imageUrls);

        log.debug(
                "Listing id={} mapped with {} images",
                listing.getId(),
                imageUrls.size()
        );

        return dto;
    }

    @Override
    @Cacheable(value = "listingsByUser", key = "#id")
    public List<ListingResponseDto> getListingByUserId(Long id) {

        log.info("Fetching listings for userId={}", id);

        try {
            userClients.getUserById(id);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        List<Listing> listings = listingRepository.findByOwnerUserId(id);

        if (listings.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No listings found for user id: " + id
            );
        }

        return listings.stream().map(listing -> {

            ListingResponseDto dto =
                    modelMapper.map(listing, ListingResponseDto.class);

            List<String> imageUrls = listing.getImages()
                    .stream()
                    .map(ListingImage::getImageUrl)
                    .toList();

            dto.setImages(imageUrls);
            dto.setOwnerUserId(id);

            return dto;

        }).toList();
    }

    @Override
    @CacheEvict(value = {"allListings", "listingById", "listingsByUser"}, allEntries = true)
    @Transactional
    public ListingResponseDto updateListing(Long id, ListingRequestDto listingDto) throws IOException {
        log.info("Updating listing with id={}", id);
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Listing not found with the id={}", id);
                    return new ResourceNotFoundException("Listing not found with id: " + id);
                });

        UserDto user;
        try {
            user = userClients.getUserById(listing.getOwnerUserId());
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Owner user not found");
        }

        listing.setTitle(listingDto.getTitle());
        listing.setDescription(listingDto.getDescription());
        listing.setRent(listingDto.getRent());
        listing.setCity(listingDto.getCity());
        listing.setLandmark(listingDto.getLandmark());
        listing.setCategory(listingDto.getCategory());
        listing.setMaxGuests(listingDto.getMaxGuests());

        if (listingDto.getImages() != null && !listingDto.getImages().isEmpty()) {

            log.debug("Updating images for listing id={}", id);

            for (MultipartFile file : listingDto.getImages()) {
                String url = fileService.uploadFile(file);

                ListingImage image = new ListingImage();
                image.setImageUrl(url);
                image.setListing(listing);
                listing.getImages().add(image);
            }

        }

        Listing updatedListing = listingRepository.save(listing);

        log.info("Listing updated successfully with the  id={}", updatedListing.getId());

        ListingResponseDto response =
                modelMapper.map(updatedListing, ListingResponseDto.class);

        List<String> imageUrls = updatedListing.getImages()
                .stream()
                .map(ListingImage::getImageUrl)
                .toList();

        response.setImages(imageUrls);
        response.setOwnerUserId(updatedListing.getOwnerUserId());

        return response;
    }

    @Override
    @CacheEvict(value = {"allListings", "listingById", "listingsByUser"}, allEntries = true)
    @Transactional
    public void deleteListing(Long id) {
        log.info("Deleting listing with id={}", id);

        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Listing not found with id={}", id);
                    return new ResourceNotFoundException("Listing not found with id: " + id);
                });
        listingRepository.delete(listing);
        log.info("Listing deleted successfully with id={}", id);

    }

    @Override
    @Cacheable(value = "listingExists", key = "#id")
    public boolean existsById(Long id) {
        log.info("Checking listing exists with id={}", id);
        boolean exists = listingRepository.existsById(id);
        log.debug("Listing exists with id={}, exists={}", id, exists);
        return exists;
    }

    @Override
    @Cacheable(value = "listingsBetweenDates", key = "#startDate + '-' + #endDate")
    public List<ListingResponseDto> getListingsBetweenDates(String startDate, String endDate) {
        log.info("Fetching listings between startDate={} and endDate={}", startDate, endDate);

        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);

        List<Listing> listings = listingRepository.findByCreatedAtBetween(start, end);

        if (listings.isEmpty()) {
            log.warn("No listings found between {} and {}", startDate, endDate);
            throw new ResourceNotFoundException("No listings found between given dates");
        }

        log.debug("Found {} listings between given dates", listings.size());

        return listings.stream().map(listing -> {

            log.debug("Mapping listing id={}", listing.getId());

            ListingResponseDto dto =
                    modelMapper.map(listing, ListingResponseDto.class);

            List<String> imageUrls = listing.getImages()
                    .stream()
                    .map(ListingImage::getImageUrl)
                    .toList();

            dto.setImages(imageUrls);

            log.debug("Listing id={} mapped with {} images",
                    listing.getId(),
                    imageUrls.size());

            return dto;

        }).toList();
    }

    @Override
    @Cacheable(value = "listingsByDate", key = "#date")
    public List<ListingResponseDto> getListingsByDate(String date) {

        log.info("Fetching listings for date={}", date);

        LocalDateTime start = LocalDate.parse(date).atStartOfDay();
        LocalDateTime end = LocalDate.parse(date).atTime(23, 59, 59);

        List<Listing> listings = listingRepository.findByCreatedAtBetween(start, end);

        if (listings.isEmpty()) {
            log.warn("No listings found for date={}", date);
            throw new ResourceNotFoundException("No listings found for given date");
        }

        log.debug("Found {} listings for date={}", listings.size(), date);

        return listings.stream().map(listing -> {

            log.debug("Mapping listing id={}", listing.getId());

            ListingResponseDto dto = modelMapper.map(listing, ListingResponseDto.class);

            List<String> imageUrls = listing.getImages()
                    .stream()
                    .map(ListingImage::getImageUrl)
                    .toList();

            dto.setImages(imageUrls);

            log.debug("Listing id={} mapped with {} images", listing.getId(), imageUrls.size());

            return dto;

        }).toList();
    }

    @Override
    @Cacheable(value = "searchListings",key = "#city + '-' + #guests + '-' + #startDate + '-' + #endDate")
    public List<ListingResponseDto> searchListings(String city, Integer guests, String startDate, String endDate) {
        log.info("Searching listings city={}, guests={}, start={}, end={}",
                city, guests, startDate, endDate);

        List<Listing> listings = listingRepository.findAll();

        // Filter by city
        if (city != null && !city.isBlank()) {
            listings = listings.stream()
                    .filter(l -> l.getCity().equalsIgnoreCase(city))
                    .toList();
        }

        // Filter by guests
        if (guests != null) {
            listings = listings.stream()
                    .filter(l -> l.getMaxGuests() != null && l.getMaxGuests() >= guests)
                    .toList();
        }

        // Filter by availability
        if (startDate != null && endDate != null) {

            List<Long> bookedIds =
                    bookingClients.getBookedListingIds(startDate, endDate);

            listings = listings.stream()
                    .filter(l -> !bookedIds.contains(l.getId()))
                    .toList();
        }

        // Convert to DTO with images
        return listings.stream().map(listing -> {

            ListingResponseDto dto =
                    modelMapper.map(listing, ListingResponseDto.class);

            List<String> imageUrls = listing.getImages()
                    .stream()
                    .map(ListingImage::getImageUrl)
                    .toList();

            dto.setImages(imageUrls);

            return dto;

        }).toList();
    }

}
