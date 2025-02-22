package com.RBS.demo.controller;

import com.RBS.demo.model.Cart;
import com.RBS.demo.model.CartItem;
import com.RBS.demo.model.Order;
import com.RBS.demo.model.OrderItem;
import com.RBS.demo.service.CartService;
import com.RBS.demo.service.OrderItemService;
import com.RBS.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orderItem")
public class OrderItemController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private CartService cartService;

    // Method for placing an order from a cart
    @PostMapping("/buy/{cartId}")
    public ResponseEntity<String> placeOrder(@PathVariable Long cartId) {
        Cart cart = cartService.getCartById(cartId);
        if (cart == null || cart.getCartItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty!");
        }

        // Create a new order
        Order order = orderService.createOrder(cart.getUser()); // Assuming OrderService handles user association

        // Copy cart items to order items
        List<CartItem> cartItems = cart.getCartItems();
        orderItemService.saveOrderItems(cartItems, order);

        return ResponseEntity.ok("Order placed successfully!");
    }

    // New method for fetching order items by order ID
    @GetMapping("/order/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderId(@PathVariable Long orderId) {
        List<OrderItem> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
        if (orderItems == null || orderItems.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orderItems);
    }
}
