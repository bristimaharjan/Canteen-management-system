package com.RBS.demo.service;



import com.RBS.demo.model.CartItem;

import java.util.List;

public interface CartItemService {

    CartItem saveCartItem(CartItem cartItem);
    List<CartItem> getAllCartItems();
    CartItem getCartItemById(Long cartItemId);
    boolean deleteCartItemById(Long cartItemId);
    CartItem updateCartItemQuantity(Long cartItemId, int newQuantity);
    List<CartItem> getCartItemsByCartId(Long cartId);
    void deleteByMenuItemItemId(int itemId) ;
}
