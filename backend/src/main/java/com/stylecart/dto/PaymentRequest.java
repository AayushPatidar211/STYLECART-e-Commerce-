package com.stylecart.dto;

import java.math.BigDecimal;

public class PaymentRequest {

    private String orderNumber;
    private BigDecimal amount;
    private String paymentMethod; // CREDIT_CARD, UPI, COD
    private String cardNumber; // Optional, masked in practice
    private String upiId;

    public PaymentRequest() {}

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
}
