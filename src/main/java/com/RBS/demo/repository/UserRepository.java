package com.RBS.demo.repository;

import com.RBS.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {


    User findByUsername(String username);

    // Use built-in count() method instead of a custom query
    long count(); // Correct query to count total users
}
