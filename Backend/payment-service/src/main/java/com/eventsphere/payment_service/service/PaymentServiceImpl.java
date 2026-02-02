package com.eventsphere.payment_service.service;

import com.eventsphere.payment_service.dto.PaymentRequestDto;
import com.eventsphere.payment_service.dto.PaymentResponseDto;
import com.eventsphere.payment_service.dto.PaymentVerifyRequestDto;
import com.eventsphere.payment_service.entity.Payment;
import com.eventsphere.payment_service.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @Override
    public PaymentResponseDto createOrder(PaymentRequestDto request) throws Exception {
        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject options = new JSONObject();
        int amountInPaise = request.getAmount().intValue() * 100;
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", "booking_" + request.getBookingId());

        Order order = client.orders.create(options);

        Payment payment = new Payment();
        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());
        payment.setRazorpayOrderId(order.get("id"));
        payment.setStatus("CREATED");

        Payment savedPayment = paymentRepository.save(payment);

        return modelMapper.map(savedPayment, PaymentResponseDto.class);
    }

    @Override
    public String verifyPayment(PaymentVerifyRequestDto dto) throws Exception {

        Payment payment = paymentRepository
                .findByRazorpayOrderId(dto.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", dto.getRazorpayOrderId());
        attributes.put("razorpay_payment_id", dto.getRazorpayPaymentId());
        attributes.put("razorpay_signature", dto.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(attributes, secret);

        if (isValid) {
            payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);
            return "Payment Successful";
        } else {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new RuntimeException("Payment verification failed");
        }
    }

}
