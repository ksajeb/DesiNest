package com.eventsphere.booking_service.kafka;

import com.eventsphere.booking_service.entity.Booking;
import com.eventsphere.booking_service.entity.BookingStatus;
import com.eventsphere.booking_service.repository.BookingRepository;
import com.eventsphere.common.event.PaymentSuccessEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentListener {
    @Autowired
    private BookingRepository bookingRepository;

    @KafkaListener(topics = "payment-success", groupId = "booking-group")
    public void listen(PaymentSuccessEvent event) {
        Booking booking = bookingRepository.findById(event.getBookingId())
                        .orElseThrow();
        booking.setPaymentId(event.getPaymentId());
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        System.out.println("Booking confirmed: " + event.getBookingId());
    }
}
