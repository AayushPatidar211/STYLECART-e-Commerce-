package com.stylecart.controller;

import com.stylecart.dto.ProductDTO;
import com.stylecart.security.UserPrincipal;
import com.stylecart.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Customer wishlist saved items and move-to-cart operations")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get user's wishlist products")
    public ResponseEntity<List<ProductDTO>> getWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(wishlistService.getWishlistProducts(userPrincipal.getId()));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Add product to user's wishlist")
    public ResponseEntity<Map<String, String>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        wishlistService.addToWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Product added to wishlist"));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove product from user's wishlist")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Product removed from wishlist"));
    }

    @PostMapping("/{productId}/move-to-cart")
    @Operation(summary = "Move product from wishlist directly to cart")
    public ResponseEntity<Map<String, String>> moveToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color) {
        wishlistService.moveToCart(userPrincipal.getId(), productId, size, color);
        return ResponseEntity.ok(Map.of("message", "Product moved to shopping bag"));
    }
}
