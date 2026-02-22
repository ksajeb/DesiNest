package com.eventsphere.booking_service.config;

import com.eventsphere.common.event.ListingResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "listing-service", url = "http://localhost:8097")
public interface ListingClients {

    @GetMapping("/listings/{id}")
    ListingResponseDto getListingById(@PathVariable Long id);

    @GetMapping("/listings/exists/{id}")
    Boolean existsById(@PathVariable Long id);
}
