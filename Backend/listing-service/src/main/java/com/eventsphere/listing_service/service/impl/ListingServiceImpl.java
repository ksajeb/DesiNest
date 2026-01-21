package com.eventsphere.listing_service.service.impl;

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
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Override
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
    @Cacheable(value = "listings",key = "#id")
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
}
