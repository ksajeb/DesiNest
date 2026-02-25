package com.eventsphere.payment_service.kafka;

import com.eventsphere.common.event.PaymentSuccessEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "payment-success";

    public void sendPaymentSuccess(Long bookingId, String paymentId,String orderId) {
        PaymentSuccessEvent event = new PaymentSuccessEvent(bookingId, paymentId, orderId);
        kafkaTemplate.send(TOPIC, event);
        System.out.println("Payment success sent: " + bookingId);
    }
}
