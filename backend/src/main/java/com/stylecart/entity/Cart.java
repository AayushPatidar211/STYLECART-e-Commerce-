package com.stylecart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    public Cart() {}

    public Cart(User user) {
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public BigDecimal calculateSubtotal() {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : items) {
            BigDecimal price = item.getProduct().getDiscountPrice() != null
                ? item.getProduct().getDiscountPrice()
                : item.getProduct().getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return subtotal;
    }

    public BigDecimal calculateDeliveryCharge() {
        BigDecimal subtotal = calculateSubtotal();
        // Free delivery above $50.00 / INR 500
        if (subtotal.compareTo(new BigDecimal("50.00")) >= 0 || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal("5.99");
    }

    public BigDecimal calculateFinalTotal() {
        return calculateSubtotal().add(calculateDeliveryCharge());
    }
}
