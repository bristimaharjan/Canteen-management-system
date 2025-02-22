package com.RBS.demo.service.impl;

import com.RBS.demo.model.Order;
import com.RBS.demo.model.User;
import com.RBS.demo.repository.OrderRepository;
import com.RBS.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order add(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order getById(int id) {
        Optional<Order> optionalUser = orderRepository.findById(id);
        Order order= optionalUser.orElseThrow((()->new RuntimeException("Order not found")));
        return order;
    }

    @Override
    public List<Order> findByUserId(int userId) {
        return orderRepository.findByUser_Id(userId);
    }

    @Override
    public Order updateOrder(Order order, int id) {
        getById(id);//check id
        order.setId(id);
        return orderRepository.save(order);
    }

    @Override
    public void deleteByUserId(int userId) {
        List<Order> orders = findByUserId(userId);
        if (!orders.isEmpty()) {
            orders.forEach(order -> orderRepository.deleteById(order.getId()));
        } else {
            throw new RuntimeException("No orders found for this user");
        }
    }

    @Override
    public void deleteById(int id) {
        getById(id);
        orderRepository.deleteById(id);
    }


    @Override
    public List<Order> findByStatus(String status) {
        return orderRepository.findByStatus(status);

    }

    @Override
    public double calculateTotalAmount(int orderid) {
        Order order = getById(orderid); // Reuse the `getById` method to fetch the order.
        return order.getTotalAmount();
    }

    @Override
    public void updateOrderStatus(int id, String status) throws Exception {
        // Find the order by its ID
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new Exception("Order not found"));

        // Update the order status
        order.setStatus(status);

        // Save the updated order to the database
        orderRepository.save(order);
    }
    @Override
    public Order createOrder(User user) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDate.from(LocalDateTime.now())); // Set order date to current time
        order.setStatus("Unpaid"); // Default status

        return orderRepository.save(order);
    }
    public List<Order> getOrdersByDate(LocalDate date) {
        return orderRepository.findByOrderDate(date);
    }

}