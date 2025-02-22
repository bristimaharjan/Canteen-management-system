package com.RBS.demo.controller;


import com.RBS.demo.model.CartItem;
import com.RBS.demo.service.CartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    /**
     * Create or update a CartItem.
     *
     * @param cartItem the CartItem object to be created/updated
     * @return the created/updated CartItem
     */
    @PostMapping
    public ResponseEntity<CartItem> createOrUpdateCartItem(@RequestBody CartItem cartItem) {
        CartItem savedCartItem = cartItemService.saveCartItem(cartItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCartItem);
    }

    /**
     * Get all CartItems.
     *
     * @return a list of all CartItems
     */
    @GetMapping
    public ResponseEntity<List<CartItem>> getAllCartItems() {
        List<CartItem> cartItems = cartItemService.getAllCartItems();
        return ResponseEntity.ok(cartItems);
    }

    /**
     * Get a CartItem by its ID.
     *
     * @param cartItemId the ID of the CartItem
     * @return the CartItem if found, otherwise 404
     */
    @GetMapping("/{cartItemId}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable Long cartItemId) {
        CartItem cartItem = cartItemService.getCartItemById(cartItemId);
        if (cartItem != null) {
            return ResponseEntity.ok(cartItem);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Delete a CartItem by its ID.
     *
     * @param cartItemId the ID of the CartItem to delete
     * @return a success message or 404 if not found
     */
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartItemId) {
        boolean deleted = cartItemService.deleteCartItemById(cartItemId);

        if (deleted) {
            return ResponseEntity.ok().body("Cart item removed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cart item not found before deletion");
        }
    }

    /**
     * Update the quantity of a CartItem.
     *
     * @param cartItemId  the ID of the CartItem
     * @param newQuantity the new quantity for the CartItem
     * @return the updated CartItem
     */
    @PutMapping("/{cartItemId}/quantity")
    public ResponseEntity<CartItem> updateCartItemQuantity(@PathVariable Long cartItemId, @RequestParam int newQuantity) {
        CartItem updatedCartItem = cartItemService.updateCartItemQuantity(cartItemId, newQuantity);
        if (updatedCartItem != null) {
            return ResponseEntity.ok(updatedCartItem);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Get all CartItems for a specific Cart by its ID.
     *
     * @param cartId the ID of the Cart
     * @return a list of CartItems for the given Cart
     */
    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItem>> getCartItemsByCartId(@PathVariable Long cartId) {
        List<CartItem> cartItems = cartItemService.getCartItemsByCartId(cartId);
        return ResponseEntity.ok(cartItems);
    }
}
