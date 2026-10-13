package com.stylecart.dto;

import com.stylecart.entity.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderRequest {

    @NotNull(message = "Shipping address is required")
    @Valid
    private Address shippingAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CREDIT_CARD, UPI, COD

    private String orderNotes;

    public OrderRequest() {}

    public Address getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Address shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getOrderNotes() { return orderNotes; }
    public void setOrderNotes(String orderNotes) { this.orderNotes = orderNotes; }
}
