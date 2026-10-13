package com.stylecart.service;

import com.stylecart.dto.CartItemRequest;
import com.stylecart.dto.ProductDTO;
import com.stylecart.entity.Product;
import com.stylecart.entity.User;
import com.stylecart.entity.Wishlist;
import com.stylecart.entity.WishlistItem;
import com.stylecart.exception.ResourceNotFoundException;
import com.stylecart.repository.ProductRepository;
import com.stylecart.repository.UserRepository;
import com.stylecart.repository.WishlistItemRepository;
import com.stylecart.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @Transactional(readOnly = true)
    public List<ProductDTO> getWishlistProducts(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return wishlist.getItems().stream()
                .map(item -> productService.mapToDTO(item.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistAndProduct(wishlist, product);
        if (existing.isEmpty()) {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlistItemRepository.save(item);
            wishlist.getItems().add(item);
            wishlistRepository.save(wishlist);
        }
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        wishlistItemRepository.findByWishlistAndProduct(wishlist, product)
                .ifPresent(item -> {
                    wishlist.getItems().remove(item);
                    wishlistItemRepository.delete(item);
                });
    }

    @Transactional
    public void moveToCart(Long userId, Long productId, String size, String color) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        String selectedSize = size != null && !size.isEmpty()
                ? size
                : (product.getAvailableSizes().isEmpty() ? "M" : product.getAvailableSizes().get(0));

        String selectedColor = color != null && !color.isEmpty()
                ? color
                : (product.getAvailableColors().isEmpty() ? "Standard" : product.getAvailableColors().get(0));

        CartItemRequest cartRequest = new CartItemRequest();
        cartRequest.setProductId(productId);
        cartRequest.setSelectedSize(selectedSize);
        cartRequest.setSelectedColor(selectedColor);
        cartRequest.setQuantity(1);

        cartService.addItemToCart(userId, cartRequest);
        removeFromWishlist(userId, productId);
    }

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Wishlist newWishlist = new Wishlist(user);
                    return wishlistRepository.save(newWishlist);
                });
    }
}
