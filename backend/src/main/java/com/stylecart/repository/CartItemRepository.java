package com.stylecart.repository;

import com.stylecart.entity.Cart;
import com.stylecart.entity.CartItem;
import com.stylecart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductAndSelectedSizeAndSelectedColor(
            Cart cart, Product product, String selectedSize, String selectedColor);
}
