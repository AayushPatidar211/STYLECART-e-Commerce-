package com.stylecart.controller;

import com.stylecart.dto.OrderDTO;
import com.stylecart.dto.OrderRequest;
import com.stylecart.dto.OrderStatusUpdateRequest;
import com.stylecart.entity.OrderStatus;
import com.stylecart.security.UserPrincipal;
import com.stylecart.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Checkout, order placement, lifecycle status tracking, and order history")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @Operation(summary = "Place order from user's current shopping cart")
    public ResponseEntity<OrderDTO> placeOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderRequest request) {
        OrderDTO order = orderService.createOrder(userPrincipal.getId(), request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get current user's order history")
    public ResponseEntity<List<OrderDTO>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(orderService.getUserOrders(userPrincipal.getId()));
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get specific order details by order number")
    public ResponseEntity<OrderDTO> getOrderDetails(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderDetails(userPrincipal.getId(), orderNumber));
    }

    @PutMapping("/{orderNumber}/cancel")
    @Operation(summary = "Cancel order if not yet shipped and restore inventory")
    public ResponseEntity<OrderDTO> cancelOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.cancelOrder(userPrincipal.getId(), orderNumber));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all customer orders across store with pagination & status filtering (Admin)")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size, status));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order delivery and fulfillment status (Admin)")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}
