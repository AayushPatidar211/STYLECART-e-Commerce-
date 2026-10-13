package com.stylecart.service;

import com.stylecart.dto.DashboardStatsDTO;
import com.stylecart.dto.OrderDTO;
import com.stylecart.entity.OrderStatus;
import com.stylecart.repository.OrderRepository;
import com.stylecart.repository.ProductRepository;
import com.stylecart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalRevenue(orderRepository.calculateTotalRevenue());

        long pending = orderRepository.countByStatus(OrderStatus.PLACED)
                     + orderRepository.countByStatus(OrderStatus.CONFIRMED)
                     + orderRepository.countByStatus(OrderStatus.PROCESSING);
        stats.setPendingOrders(pending);

        stats.setDeliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED));
        stats.setLowStockProducts(productRepository.countByStockQuantityLessThan(10));

        // Recent 10 orders
        List<OrderDTO> recent = orderRepository.findTop10RecentOrders().stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());
        stats.setRecentOrders(recent);

        // Status counts
        Map<String, Long> statusCounts = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            statusCounts.put(status.name(), orderRepository.countByStatus(status));
        }
        stats.setOrdersByStatus(statusCounts);

        // Sample monthly revenue metrics
        List<Map<String, Object>> monthly = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"};
        double[] revs = {4200.0, 5800.0, 6900.0, 8400.0, 7800.0, 9600.0, 11200.0, 12800.0, 14500.0};
        int[] orders = {38, 52, 61, 74, 69, 88, 98, 115, 128};

        for (int i = 0; i < months.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", months[i]);
            point.put("revenue", revs[i]);
            point.put("orders", orders[i]);
            monthly.add(point);
        }
        stats.setMonthlyRevenue(monthly);

        return stats;
    }
}
