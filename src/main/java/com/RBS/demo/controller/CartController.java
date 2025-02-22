package com.RBS.demo.controller;


import com.RBS.demo.model.Cart;
import com.RBS.demo.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    // Constructor injection for CartService
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Get the cart for a specific user (by userId)
    @GetMapping("{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable int userId) {
        Cart cart = cartService.getOrCreateCart(userId);
        cart.calculateTotalPrice(); // Ensure price is calculated before returning
        System.out.println("Cart Total Price in Response: " + cart.getTotalPrice());
        return ResponseEntity.ok(cart);
    }


    // Add an item to the cart
    @PostMapping("/{userId}/add")
    public ResponseEntity<String> addToCart(@PathVariable int userId,
                                            @RequestParam(required = false) Integer itemId,
                                            @RequestParam int quantity) {
        if (itemId == null || itemId <= 0) {
            return new ResponseEntity<>("Error: Missing or invalid 'itemId'", HttpStatus.BAD_REQUEST);
        }
        try {
            cartService.addToCart(userId, itemId, quantity);
            return new ResponseEntity<>("Item added to cart successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error adding item to cart: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<String> removeFromCart(@PathVariable int userId,
                                                 @RequestParam(required = false) Integer itemId) {
        if (itemId == null || itemId <= 0) {
            return new ResponseEntity<>("Error: Missing or invalid 'itemId'", HttpStatus.BAD_REQUEST);
        }
        try {
            cartService.removeFromCart(userId, itemId);
            return new ResponseEntity<>("Item removed from cart successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error removing item from cart: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    // Clear the entire cart
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<String> clearCart(@PathVariable int userId) {
        try {
            cartService.clearCart(userId);
            return new ResponseEntity<>("Cart cleared successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error clearing the cart: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
