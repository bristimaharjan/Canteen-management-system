package com.RBS.demo.service;

import com.RBS.demo.model.User;

import java.util.List;

public interface UserService {
    User add(User user);
    List<User> getAll();
    User findByUsername(String username);
    void deleteById(int id);
    User updateUser(User user,int id );
    User getById(int id);
    long getTotalUsers();

}
