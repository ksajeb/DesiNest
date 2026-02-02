package com.eventsphere.booking_service.service;


import com.eventsphere.booking_service.dto.BookingRequestDto;
import com.eventsphere.booking_service.dto.BookingResponseDto;

import java.util.List;
public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);
    List<BookingResponseDto> getAllBooking();
}
