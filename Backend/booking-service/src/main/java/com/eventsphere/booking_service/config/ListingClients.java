package com.eventsphere.booking_service.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "listing-service", url = "http://localhost:8097")
public interface ListingClients {

    @GetMapping("/listing/{id}/exists")
    Boolean existsById(@PathVariable Long id);
}
