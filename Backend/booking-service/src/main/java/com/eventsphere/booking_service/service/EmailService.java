package com.eventsphere.booking_service.service;

import com.eventsphere.booking_service.config.UserClients;
import com.eventsphere.booking_service.entity.Booking;
import com.eventsphere.booking_service.repository.BookingRepository;
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

    @Autowired
    private UserClients userClients;

    @Autowired
    private BookingRepository bookingRepository;

    public void sendBookingConfirmation(String toEmail, Long bookingId) {

        log.info("📧 Preparing to send email to {}", toEmail);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        var user = userClients.getUserById(booking.getUserId());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🎉 Booking Confirmed — DesiNest");
        message.setText(

                "Hi " + user.getName() + ",\n\n" +

                        "🎉 Your booking has been successfully confirmed!\n" +
                        "We’re excited to host you with DesiNest.\n\n" +

                        "📌 Booking Details:\n" +
                        "-------------------------------------\n" +
                        "Booking ID: " + bookingId + "\n" +
                        "Check-in Date: " + booking.getCheckInDate() + "\n" +
                        "Check-out Date: " + booking.getCheckOutDate() + "\n" +
                        "Total Amount Paid: ₹" + booking.getTotalAmount() + "\n" +
                        "Payment Status: Confirmed ✅\n" +
                        "-------------------------------------\n\n" +

                        "🏡 What happens next?\n" +
                        "• Please carry a valid government ID during check-in.\n" +
                        "• You can view your booking anytime in the 'My Bookings' section of the app.\n" +
                        "• The host/property contact details will be available before your arrival.\n\n" +

                        "If you need to make any changes or have questions, feel free to contact our support team.\n\n" +

                        "📞 Support: support@desinest.com\n" +
                        "🌐 Website: www.desinest.com\n\n" +

                        "Thank you for choosing DesiNest ❤️\n" +
                        "We wish you a wonderful stay!\n\n" +

                        "Warm regards,\n" +
                        "Team DesiNest"
        );

        mailSender.send(message);
        log.info("Email sent successfully to {}", toEmail);
    }

    public void sendBookingCancellation(String toEmail, Long bookingId) {

        log.info("📧 Preparing cancellation email to {}", toEmail);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        var user = userClients.getUserById(booking.getUserId());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("❌ Booking Cancelled — DesiNest");

        message.setText(
                "Hi " + user.getName() + ",\n\n" +

                        "We’re sorry to inform you that your booking has been successfully cancelled.\n\n" +

                        "📌 Cancelled Booking Details:\n" +
                        "-------------------------------------\n" +
                        "Booking ID: " + booking.getId() + "\n" +
                        "Check-in Date: " + booking.getCheckInDate() + "\n" +
                        "Check-out Date: " + booking.getCheckOutDate() + "\n" +
                        "Amount: ₹" + booking.getTotalAmount() + "\n" +
                        "Status: Cancelled ❌\n" +
                        "-------------------------------------\n\n" +

                        "💰 Refund Information:\n" +
                        "If you are eligible for a refund, the amount will be processed " +
                        "to your original payment method within 5–7 business days.\n\n" +

                        "If this cancellation was not intended or you need assistance, " +
                        "please contact our support team.\n\n" +

                        "📞 Support: support@desinest.com\n" +
                        "🌐 Website: www.desinest.com\n\n" +

                        "We hope to serve you again in the future.\n\n" +

                        "Warm regards,\n" +
                        "Team DesiNest"
        );

        mailSender.send(message);

        log.info("Cancellation email sent successfully to {}", toEmail);
    }
}
