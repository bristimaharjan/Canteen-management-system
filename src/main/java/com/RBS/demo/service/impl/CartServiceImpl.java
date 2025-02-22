package com.RBS.demo.service.impl;

import com.RBS.demo.model.Cart;
import com.RBS.demo.model.CartItem;
import com.RBS.demo.model.MenuItem;
import com.RBS.demo.model.User;
import com.RBS.demo.repository.CartItemRepository;
import com.RBS.demo.repository.CartRepository;
import com.RBS.demo.repository.MenuItemRepository;
import com.RBS.demo.repository.UserRepository;
import com.RBS.demo.service.CartService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Cart getOrCreateCart(int userId) {
        Optional<Cart> cartOptional = cartRepository.findByUser_Id(userId);

        return cartOptional.orElseGet(() -> {
            // Fetch the user object using the userId
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create a new cart and set the user
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    @Override
    @Transactional
    public void addToCart(int userId, int itemId, int quantity) {
        Cart cart = getOrCreateCart(userId);

        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));

        Optional<CartItem> cartItemOptional = cart.getCartItems().stream()
                .filter(item -> item.getMenuItem().getItemId() == itemId)
                .findFirst();

        if (cartItemOptional.isPresent()) {
            // Update quantity and price for existing cart item
            CartItem cartItem = cartItemOptional.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.recalculateTotalPrice();
            cartItemRepository.save(cartItem);
        } else {
            // Add new cart item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setMenuItem(menuItem);
            cartItem.setQuantity(quantity);
            cartItem.recalculateTotalPrice();
            cartItemRepository.save(cartItem);
            cart.getCartItems().add(cartItem);
        }

        // Calculate total price and save
        cart.setTotalPrice(cart.getTotalPrice());
        cart = cartRepository.saveAndFlush(cart); // Explicit save and flush to ensure database update

        System.out.println("Cart Total Price After Update: " + cart.getTotalPrice());
    }

    @Override
    @Transactional
    public void removeFromCart(int userId, int itemId) {
        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> cartItemOptional = cart.getCartItems().stream()
                .filter(item -> item.getMenuItem().getItemId() == itemId)
                .findFirst();

        cartItemOptional.ifPresent(cartItem -> {
            cart.getCartItems().remove(cartItem);
            cartItemRepository.delete(cartItem);

            // Recalculate cart total and save
            cart.setTotalPrice(cart.getTotalPrice());
            cartRepository.save(cart);

        });
    }


    @Transactional
    @Override
    public void clearCart(int userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getCartItems().forEach(cartItemRepository::delete);
        cart.getCartItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public double getCartTotal(int userId) {
        Cart cart = getOrCreateCart(userId);
        return cart.getTotalPrice();
    }

    @Override
    @Transactional
    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart getCartById(Long cartId) {
        return cartRepository.findById(Math.toIntExact(cartId)).orElse(null);
    }

    @Override
    @Transactional
    public Cart addItemToCart(Long cartId, MenuItem menuItem, int quantity) {
        Cart cart = cartRepository.findById(Math.toIntExact(cartId))
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (menuItem == null) {
            throw new IllegalArgumentException("MenuItem does not exist.");
        }

        // Check if the item already exists in the cart
        Optional<CartItem> cartItemOptional = cart.getCartItems().stream()
                .filter(item -> item.getMenuItem().getItemId() == menuItem.getItemId())
                .findFirst();

        if (cartItemOptional.isPresent()) {
            // Update quantity and recalculate total for existing item
            CartItem cartItem = cartItemOptional.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.recalculateTotalPrice();
            cartItemRepository.save(cartItem);
        } else {
            // Create a new item and calculate total
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setMenuItem(menuItem);
            cartItem.setQuantity(quantity);
            cartItem.recalculateTotalPrice();
            cartItemRepository.save(cartItem);
            cart.getCartItems().add(cartItem);
        }

        // Recalculate and save cart total price
        cart.calculateTotalPrice();
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeItemFromCart(Long cartId, Long cartItemId) {
        Cart cart = cartRepository.findById(Math.toIntExact(cartId))
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getCartItems().stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst()
                .ifPresent(cartItem -> {
                    cart.getCartItems().remove(cartItem);
                    cartItemRepository.delete(cartItem);

                    // Recalculate and save cart total price
                    cart.calculateTotalPrice();
                    cartRepository.save(cart);
                });
    }

    @Override
    @Transactional
    public BigDecimal calculateTotalCartPrice(Long cartId) {
        Cart cart = cartRepository.findById(Math.toIntExact(cartId))
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.calculateTotalPrice();
        return BigDecimal.valueOf(cart.getTotalPrice());
    }


}
