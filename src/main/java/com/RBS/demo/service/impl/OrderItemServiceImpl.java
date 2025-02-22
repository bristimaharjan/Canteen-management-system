package com.RBS.demo.service.impl;

import com.RBS.demo.model.Order;
import com.RBS.demo.model.OrderItem;
import com.RBS.demo.model.CartItem;
import com.RBS.demo.repository.OrderItemRepository;
import com.RBS.demo.service.OrderItemService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public void saveOrderItems(List<CartItem> cartItems, Order order) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart items cannot be null or empty");
        }
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            orderItems.add(orderItem);
        }

        // Save all OrderItems in one go for better performance
        orderItemRepository.saveAll(orderItems);
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}
