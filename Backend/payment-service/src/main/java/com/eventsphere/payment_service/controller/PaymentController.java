package com.eventsphere.payment_service.controller;

import com.eventsphere.payment_service.dto.PaymentRequestDto;
import com.eventsphere.payment_service.dto.PaymentResponseDto;
import com.eventsphere.payment_service.dto.PaymentVerifyRequestDto;
import com.eventsphere.payment_service.entity.Payment;
import com.eventsphere.payment_service.repository.PaymentRepository;
import com.eventsphere.payment_service.service.PaymentService;
import org.antlr.v4.runtime.misc.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponseDto> createOrder(
            @RequestBody PaymentRequestDto request) throws Exception {

        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody PaymentVerifyRequestDto request) throws Exception {

        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

};
