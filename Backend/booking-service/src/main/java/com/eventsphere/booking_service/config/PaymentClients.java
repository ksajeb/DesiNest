package com.eventsphere.booking_service.config;


import com.eventsphere.booking_service.dto.PaymentRequestDto;
import com.eventsphere.booking_service.dto.PaymentResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service", url = "http://localhost:8099")
public interface PaymentClients {
    @PostMapping("/payments/create-order")
    PaymentResponseDto createPayment(@RequestBody PaymentRequestDto request);
}
