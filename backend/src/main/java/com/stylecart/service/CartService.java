package com.stylecart.service;

import com.stylecart.dto.CartDTO;
import com.stylecart.dto.CartItemDTO;
import com.stylecart.dto.CartItemRequest;
import com.stylecart.entity.Cart;
import com.stylecart.entity.CartItem;
import com.stylecart.entity.Product;
import com.stylecart.entity.User;
import com.stylecart.exception.BadRequestException;
import com.stylecart.exception.ResourceNotFoundException;
import com.stylecart.repository.CartItemRepository;
import com.stylecart.repository.CartRepository;
import com.stylecart.repository.ProductRepository;
import com.stylecart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartDTO getCartByUserId(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("Product is no longer available");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Only " + product.getStockQuantity() + " items available.");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProductAndSelectedSizeAndSelectedColor(
                cart, product, request.getSelectedSize(), request.getSelectedColor());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Cannot add more. Max stock available: " + product.getStockQuantity());
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(
                    cart,
                    product,
                    request.getSelectedSize(),
                    request.getSelectedColor(),
                    request.getQuantity()
            );
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO updateItemQuantity(Long userId, Long itemId, int quantity) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new BadRequestException("Only " + item.getProduct().getStockQuantity() + " items left in stock.");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user's cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToDTO(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    public CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());

        int totalItems = 0;
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            CartItemDTO itemDTO = new CartItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setBrand(item.getProduct().getBrand());
            itemDTO.setProductImage(item.getProduct().getImages().isEmpty() ? "" : item.getProduct().getImages().get(0));
            itemDTO.setSelectedSize(item.getSelectedSize());
            itemDTO.setSelectedColor(item.getSelectedColor());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setAvailableStock(item.getProduct().getStockQuantity());

            BigDecimal unitPrice = item.getProduct().getDiscountPrice() != null
                    ? item.getProduct().getDiscountPrice()
                    : item.getProduct().getPrice();

            itemDTO.setUnitPrice(unitPrice);
            itemDTO.setItemTotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));

            dto.getItems().add(itemDTO);
            totalItems += item.getQuantity();
            subtotal = subtotal.add(itemDTO.getItemTotal());
        }

        dto.setTotalItems(totalItems);
        dto.setSubtotal(subtotal);

        // Free delivery over $50.00
        BigDecimal deliveryCharge = (subtotal.compareTo(new BigDecimal("50.00")) >= 0 || totalItems == 0)
                ? BigDecimal.ZERO
                : new BigDecimal("5.99");
        dto.setDeliveryCharge(deliveryCharge);
        dto.setFinalTotal(subtotal.add(deliveryCharge));

        return dto;
    }
}
