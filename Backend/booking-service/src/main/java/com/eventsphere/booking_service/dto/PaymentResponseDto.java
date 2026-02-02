package com.eventsphere.booking_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDto {
    private Long bookingId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private Double amount;
    private String status;
}
