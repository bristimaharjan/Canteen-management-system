package com.RBS.demo.service.impl;


import com.RBS.demo.model.CartItem;
import com.RBS.demo.repository.CartItemRepository;
import com.RBS.demo.service.CartItemService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public CartItem saveCartItem(CartItem cartItem) {
        cartItem.recalculateTotalPrice();
        return cartItemRepository.save(cartItem);
    }

    @Override
    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    @Override
    public CartItem getCartItemById(Long cartItemId) {
        return cartItemRepository.findById(cartItemId).orElse(null);
    }

    @Override
    public boolean deleteCartItemById(Long cartItemId) {
        Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);
        if (cartItem.isPresent()) {
            cartItemRepository.deleteById(cartItemId);
            return true;  // Item successfully deleted
        }
        return false;  // Item not found before deletion
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int newQuantity) {
        Optional<CartItem> optionalCartItem = cartItemRepository.findById(cartItemId);

        if (optionalCartItem.isPresent()) {
            CartItem cartItem = optionalCartItem.get();
            cartItem.setQuantity(newQuantity);
            cartItem.recalculateTotalPrice();
            return cartItemRepository.save(cartItem);
        }
        return null;
    }

    @Override
    public List<CartItem> getCartItemsByCartId(Long cartId) {
        return cartItemRepository.findByCartCartId(cartId);
    }

    @Override
    public void deleteByMenuItemItemId(int itemId) {
        cartItemRepository.deleteByMenuItem_ItemId(itemId);
    }

}
