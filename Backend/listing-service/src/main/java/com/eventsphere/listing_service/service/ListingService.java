package com.eventsphere.listing_service.service;

import com.eventsphere.listing_service.dto.ListingRequestDto;
import com.eventsphere.listing_service.dto.ListingResponseDto;

import java.io.IOException;
import java.util.List;


public interface ListingService {
    ListingResponseDto addListing(ListingRequestDto listingDto) throws IOException;

    List<ListingResponseDto> getAllListing();

    ListingResponseDto getListingById(Long id);

    List<ListingResponseDto> getListingByUserId(Long id);

    ListingResponseDto updateListing(Long id,ListingRequestDto listingDto) throws IOException;
}
