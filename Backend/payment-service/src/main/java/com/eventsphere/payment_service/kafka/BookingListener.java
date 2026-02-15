package com.eventsphere.payment_service.kafka;

//import com.eventsphere.payment_service.event.BookingCreateEvent;
import com.eventsphere.common.event.BookingCreateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BookingListener {

    @Autowired
    private PaymentProducer paymentProducer;

    @KafkaListener(topics = "booking-created")
    public void listen(BookingCreateEvent event) {

        System.out.println("Received booking: " + event.getBookingId());

        // simulate payment processing
        String paymentId = "PAY-" + System.currentTimeMillis();

        paymentProducer.sendPaymentSuccess(
                event.getBookingId(),
                paymentId
        );
    }
}
