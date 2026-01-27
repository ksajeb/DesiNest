package com.eventsphere.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {
    private Long id;

    private Long listingId;
    private Long userId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Double totalAmount;

    private String status;

//    private String paymentId;

    private Integer listingRating;

    private LocalDateTime createdAt;
}
