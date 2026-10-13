package com.stylecart.service;

import com.stylecart.dto.PaymentRequest;
import com.stylecart.dto.PaymentResponse;
import com.stylecart.entity.PaymentStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service abstraction for Payment gateway processing (Stripe / Razorpay / PayPal).
 * In development, provides simulated card & UPI verification.
 * Does not store raw sensitive payment information in database.
 */
@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    public PaymentResponse processPayment(PaymentRequest request) {
        logger.info("Processing payment for order {} via {}", request.getOrderNumber(), request.getPaymentMethod());

        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            return new PaymentResponse(
                    true,
                    "COD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    PaymentStatus.PENDING,
                    "Cash on Delivery selected. Payment will be collected upon shipment arrival."
            );
        }

        // Mock payment gateway authorization
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        return new PaymentResponse(
                true,
                transactionId,
                PaymentStatus.PAID,
                "Payment successfully authorized and captured."
        );
    }
}
