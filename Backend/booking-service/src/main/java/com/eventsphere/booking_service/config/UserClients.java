package com.eventsphere.booking_service.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://localhost:8096")
public interface UserClients {
    @GetMapping("/users/{id}/exists")
    Boolean existsById(@PathVariable Long id);
}
