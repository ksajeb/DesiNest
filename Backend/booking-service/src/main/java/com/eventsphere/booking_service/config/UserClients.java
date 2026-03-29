package com.eventsphere.booking_service.config;

import com.eventsphere.common.event.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "https://user-service-i4pe.onrender.com")
public interface UserClients {
    @GetMapping("/users/{id}/exists")
    Boolean existsById(@PathVariable Long id);

    @GetMapping("/users/{id}")
    UserDto getUserById(@PathVariable("id") Long userId);
}
