package com.RBS.demo.repository;
import com.RBS.demo.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
     void deleteByMenuItem_ItemId(int itemId) ;

    CartItem findByCartItemId(Long cartItemId);
    List<CartItem> findByCartCartId(Long cartId);


}
