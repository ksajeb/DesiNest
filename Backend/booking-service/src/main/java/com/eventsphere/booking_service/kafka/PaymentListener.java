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
        System.out.println("Payment event received: " + event);
        Booking booking = bookingRepository.findById(event.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Prevent duplicate updates
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            System.out.println("Booking already confirmed");
            return;
        }
        booking.setPaymentId(event.getPaymentId());
        booking.setRazorpayOrderId(event.getRazorpayOrderId());
        booking.setStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);
        System.out.println("Booking confirmed: " + booking.getId());
    }
}
