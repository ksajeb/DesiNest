package com.eventsphere.payment_service.service;

import com.eventsphere.payment_service.dto.PaymentRequestDto;
import com.eventsphere.payment_service.dto.PaymentResponseDto;
import com.eventsphere.payment_service.dto.PaymentVerifyRequestDto;

public interface PaymentService {
    PaymentResponseDto createOrder(PaymentRequestDto request) throws Exception;

    String verifyPayment(PaymentVerifyRequestDto dto) throws Exception;
}
