package com.stylecart.dto;

import com.stylecart.entity.PaymentStatus;

public class PaymentResponse {

    private boolean success;
    private String transactionId;
    private PaymentStatus status;
    private String message;

    public PaymentResponse() {}

    public PaymentResponse(boolean success, String transactionId, PaymentStatus status, String message) {
        this.success = success;
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
