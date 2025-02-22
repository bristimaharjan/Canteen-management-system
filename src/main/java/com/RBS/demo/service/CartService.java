package com.RBS.demo.service;



import com.RBS.demo.model.Cart;
import com.RBS.demo.model.MenuItem;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;

public interface CartService {
    /**
     * Retrieves or creates a cart for the specified user.
     *
     * @param userId the ID of the user
     * @return the user's cart
     */
    Cart getOrCreateCart(int userId);

    /**
     * Adds a menu item to the user's cart.
     *
     * @param userId     the ID of the user
     * @param itemId the ID of the menu item to add
     * @param quantity   the quantity of the item to add
     */
    void addToCart(int userId, int itemId, int quantity);

    /**
     * Removes a menu item from the user's cart.
     *
     * @param userId     the ID of the user
     * @param itemId the ID of the menu item to remove
     */
    void removeFromCart(int userId, int itemId);

    @Transactional
    void clearCart(int userId);

    /**
     * Clears the cart for the specified user.
     *
     * @param userId the ID of the user
    /
    void clearCart(int userId);
    /*
     * Retrieves the total price of the user's cart.
     *
     * @param userId the ID of the user
     * @return the total price of the cart
     */
    double getCartTotal(int userId);

    Cart createCart(Cart cart);

    Cart getCartById(Long cartId);

    Cart addItemToCart(Long cartId, MenuItem menuItem, int quantity);

    void removeItemFromCart(Long cartId, Long cartItemId);

    BigDecimal calculateTotalCartPrice(Long cartId);
}
