package com.eventsphere.listing_service.Config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "booking-service")
public interface BookingClients {
    @GetMapping("/bookings/booked-listings")
    List<Long> getBookedListingIds(
            @RequestParam String startDate,
            @RequestParam String endDate
    );
}
