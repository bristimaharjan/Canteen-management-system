package com.RBS.demo.service;

import com.RBS.demo.model.Order;
import com.RBS.demo.model.CartItem;
import com.RBS.demo.model.OrderItem;

import java.util.List;

public interface OrderItemService {
    void saveOrderItems(List<CartItem> cartItems, Order order);

    // New method to fetch order items by orderId
    List<OrderItem> getOrderItemsByOrderId(Long orderId);
}
