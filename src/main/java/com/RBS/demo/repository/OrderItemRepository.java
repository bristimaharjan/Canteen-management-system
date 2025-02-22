package com.RBS.demo.repository;

import com.RBS.demo.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

     void deleteByMenuItem_ItemId(int itemId) ;

    // New method to fetch order items by orderId
    List<OrderItem> findByOrderId(Long orderId);
}
