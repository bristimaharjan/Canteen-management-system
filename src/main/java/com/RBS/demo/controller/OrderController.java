package com.RBS.demo.controller;

import com.RBS.demo.model.Cart;
import com.RBS.demo.model.CartItem;
import com.RBS.demo.model.Order;
import com.RBS.demo.model.User;
import com.RBS.demo.service.CartService;
import com.RBS.demo.service.OrderItemService;
import com.RBS.demo.service.OrderService;
import com.RBS.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private CartService cartService;
    @Autowired
    private OrderItemService orderItemService;
    @Autowired
    private UserService userService;

    // Get all orders
    @GetMapping("/list")
    public List<Order> getAllOrders() {
        return orderService.getAll();
    }

    // Add a new order
    @PostMapping("/add")
    public ResponseEntity<Order> addOrder(@RequestBody Order order) {
        try {
            // Fetch the user and cart details from the database
            User user = userService.getById(order.getUser().getId());  // Fetch user by ID
            Cart cart = cartService.getCartById(order.getCart().getCartId());  // Fetch cart by cartId

            if (cart == null || cart.getCartItems().isEmpty()) {
                return ResponseEntity.badRequest().body(null); // Ensure cart exists and has items
            }

            // Set the user and cart in the order
            order.setUser(user);
            order.setCart(cart);

            // Recalculate total amount from the cart items and set it to the order
            double totalAmount = cart.getCartItems().stream()
                    .mapToDouble(item -> item.getTotalPrice().doubleValue())
                    .sum();
            order.setTotalAmount(totalAmount);

            // Save the new order in the database
            Order newOrder = orderService.add(order);  // Save the order with the cart and totalAmount

            // Save order items
            orderItemService.saveOrderItems(cart.getCartItems(), newOrder);

            return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // Update an existing order
    @PutMapping("/update/{id}")
    public Order updateOrder(@RequestBody Order order, @PathVariable int id) {
        return orderService.updateOrder(order, id);
    }

    // Get a specific order by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable int id) {
        return orderService.getById(id);
    }

    @DeleteMapping("/delete/{userId}")
    public void deleteOrderByUserId(@PathVariable int userId) {
        orderService.deleteByUserId(userId);
    }

    // Get all orders by status
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable String status) {
        return orderService.findByStatus(status);
    }

    // Get all orders placed by a specific user
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable int userId) {
        return orderService.findByUserId(userId);
    }

    // Calculate the total amount for a specific order
    @GetMapping("/calculate/{orderid}")
    public double calculateTotalAmount(@PathVariable int orderid) {
        return orderService.calculateTotalAmount(orderid);
    }
    //@GetMapping("/total-orders")
    //public long getTotalOrders() {
    //  return orderService.getTotalOrders();  // Returns the total number of orders
    //}

    // @GetMapping("/total-sales")
    //public double getTotalSales() {
    //  return orderService.getTotalSales();  // Returns the total sales amount
    //}
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable int id,
            @RequestBody UpdateOrderStatusRequest request) {

        try {
            // Call to service method to update order status
            orderService.updateOrderStatus(id, request.getStatus());
            return ResponseEntity.ok("Order status updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update order status.");
        }
    }

    // Request body class for status
    public static class UpdateOrderStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
    // Create an order from a cart
    @PostMapping("/buy/{cartId}")
    public ResponseEntity<String> createOrder(@PathVariable Long cartId) {
        Cart cart = cartService.getCartById(cartId);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Cart not found!");
        }

        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty!");
        }

        // Create the order and associate it with the user and cart items
        Order order = orderService.createOrder(cart.getUser());

        // Persist order items
        orderItemService.saveOrderItems(cartItems, order);

        // Clear the cart after order placement
        cartService.clearCart(Math.toIntExact(cartId));

        return ResponseEntity.ok("Order placed successfully!");

    }
    @GetMapping("/by-date")
    public List<Order> getOrdersByDate(@RequestParam String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date); // Ensure frontend sends YYYY-MM-DD
            return orderService.getOrdersByDate(parsedDate);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format. Use YYYY-MM-DD", e);
        }
    }

}