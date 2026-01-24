package com.eventsphere.listing_service.controller;

import com.eventsphere.listing_service.dto.ListingRequestDto;
import com.eventsphere.listing_service.dto.ListingResponseDto;
import com.eventsphere.listing_service.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/listing")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingResponseDto> addListing(@Valid @ModelAttribute ListingRequestDto listingDto)
            throws IOException {
        ListingResponseDto add = listingService.addListing(listingDto);
        return ResponseEntity.ok(add);
    }

    @GetMapping
    public ResponseEntity<List<ListingResponseDto>> getAllListing() {
        List<ListingResponseDto> listings = listingService.getAllListing();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponseDto> getListingById(@PathVariable Long id) {
        ListingResponseDto listings = listingService.getListingById(id);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<ListingResponseDto>> getListingByUserId(@PathVariable Long id) {
        List<ListingResponseDto> list = listingService.getListingByUserId(id);
        return ResponseEntity.ok(list);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingResponseDto> updateListing(@PathVariable Long id,
            @Valid @ModelAttribute ListingRequestDto listingDto) throws IOException {

        ListingResponseDto updatedListing = listingService.updateListing(id, listingDto);
        return ResponseEntity.ok(updatedListing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return ResponseEntity.ok("Listing deleted successfully with the id:" + id);
    }

}
