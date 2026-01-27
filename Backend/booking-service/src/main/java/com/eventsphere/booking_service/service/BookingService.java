package com.eventsphere.booking_service.service;

import com.eventsphere.booking_service.dto.BookingRequestDto;
import com.eventsphere.booking_service.dto.BookingResponseDto;

public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);
}
