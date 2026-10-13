package com.stylecart.controller;

import com.stylecart.dto.DashboardStatsDTO;
import com.stylecart.dto.UserProfileDTO;
import com.stylecart.service.AdminService;
import com.stylecart.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Store analytics, executive revenue metrics, and user management")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level store statistics, metrics, charts data and recent orders")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all platform users for administration")
    public ResponseEntity<List<UserProfileDTO>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
