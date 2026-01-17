package com.eventsphere.listing_service.service;

import com.eventsphere.listing_service.dto.ListingDto;
import com.eventsphere.listing_service.dto.ListingRequestDto;
import com.eventsphere.listing_service.dto.ListingResponseDto;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;


public interface ListingService {
    ListingResponseDto addListing(ListingRequestDto listingDto) throws IOException;

    List<ListingResponseDto> getAllListing();

    ListingResponseDto getListingById(Long id);

    List<ListingResponseDto> getListingByUserId(Long id);
}
