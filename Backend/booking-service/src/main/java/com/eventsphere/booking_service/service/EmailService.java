package com.eventsphere.booking_service.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(
            String toEmail,
            Long bookingId,
            String checkIn,
            String checkOut,
            double amount
    ) {
        log.info("📧 Preparing to send email to {}", toEmail);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Booking Confirmed 🎉");

        message.setText(
                "Your booking is confirmed!\n\n" +
                        "Booking ID: " + bookingId + "\n" +
                        "Check-in: " + checkIn + "\n" +
                        "Check-out: " + checkOut + "\n" +
                        "Total Amount: ₹" + amount + "\n\n" +
                        "Thank you for choosing EventSphere ❤️"
        );

        mailSender.send(message);
        log.info("✅ Email sent successfully to {}", toEmail);
    }
}
