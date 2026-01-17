package com.eventsphere.listing_service.service.impl;

import com.eventsphere.listing_service.dto.ListingDto;
import com.eventsphere.listing_service.dto.ListingRequestDto;
import com.eventsphere.listing_service.dto.ListingResponseDto;
import com.eventsphere.listing_service.entity.Listing;
import com.eventsphere.listing_service.entity.ListingImage;
import com.eventsphere.listing_service.exception.ResourceNotFoundException;
import com.eventsphere.listing_service.repository.ListingRepository;
import com.eventsphere.listing_service.service.FileService;
import com.eventsphere.listing_service.service.ListingService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ListingServiceImpl implements ListingService {

    @Autowired
    private FileService fileService;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ListingResponseDto addListing(ListingRequestDto listingDto) throws IOException {
        log.info("Creating new listing for ownerUserId={}", listingDto.getOwnerUserId());
        Listing listing = new Listing();
        listing.setId(null);
        listing.setTitle(listingDto.getTitle());
        listing.setDescription(listingDto.getDescription());
        listing.setOwnerUserId(listingDto.getOwnerUserId());
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

            // Extract image URLs explicitly
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

        }).toList();
    }


    @Override
    public ListingResponseDto getListingById(Long id) {
        log.info("Fetching listing with id={}", id);
        Listing listing=listingRepository.findById(id).orElseThrow(()-> {
            log.warn("Listing not found with id={}", id);
            return new ResourceNotFoundException("Listing not found with id: " + id);
        });
        log.debug("Listing found: id={}, title={}", listing.getId(), listing.getTitle());
        return modelMapper.map(listing,ListingResponseDto.class);
    }
}
