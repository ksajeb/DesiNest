package com.eventsphere.payment_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDto {
    private Long bookingId;
    private String razorpayOrderId;
    private Double amount;
    private String status;
}
