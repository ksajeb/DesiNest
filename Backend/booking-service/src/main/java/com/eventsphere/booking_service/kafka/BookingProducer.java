package com.eventsphere.booking_service.kafka;

import com.eventsphere.common.event.BookingCreateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BookingProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "booking-created";
    public void sendBookingCreatedEvent(Long bookingId, Double amount) {

        BookingCreateEvent event = new BookingCreateEvent(bookingId, amount);

        kafkaTemplate.send(TOPIC, event);

        System.out.println("Booking event sent: " + bookingId);
    }
}
