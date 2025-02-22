package com.RBS.demo.service;

import com.RBS.demo.model.Order;
import com.RBS.demo.model.User;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    // Add a new order to the system
    Order add(Order order);

    // Retrieve a list of all orders
    List<Order> getAll();

    // Find an order by its unique identifier
    Order getById(int id);

    // Find all orders placed by a specific user (e.g., by username or userId)
    List<Order> findByUserId(int userId);

    // Update the details of an existing order
    Order updateOrder(Order order, int id);
    void deleteByUserId(int userId);

    // Cancel or delete an order by its ID
    void deleteById(int id);

    // Retrieve all orders with a specific status (e.g., "Pending", "Completed")
    List<Order> findByStatus(String status);

    // Calculate the total amount for an order
    double calculateTotalAmount(int orderid);

    //List<Order> findByItemId(int itemId);
    void updateOrderStatus(int id, String status) throws Exception;
    Order createOrder(User user);
    List<Order> getOrdersByDate(LocalDate date);
}

