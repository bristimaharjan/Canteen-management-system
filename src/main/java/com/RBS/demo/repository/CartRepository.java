package com.RBS.demo.repository;



import com.RBS.demo.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    // Find a cart by the associated user's ID
    Optional<Cart> findByUser_Id(int userId);

    // Delete a cart by the associated user's ID (optional use case)
    void deleteByUser_Id(int userId);

}
