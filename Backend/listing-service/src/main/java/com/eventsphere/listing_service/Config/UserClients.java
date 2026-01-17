package com.eventsphere.listing_service.Config;

import com.eventsphere.listing_service.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://localhost:8096")
public interface UserClients {
    @GetMapping("users/{id}")
    UserDto getUserById(@PathVariable("id") Long id);
}
