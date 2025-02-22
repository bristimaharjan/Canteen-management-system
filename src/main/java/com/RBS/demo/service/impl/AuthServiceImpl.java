package com.RBS.demo.service.impl;

import com.RBS.demo.dto.LoginResponseDto;
import com.RBS.demo.model.User;
import com.RBS.demo.service.Authservice;
import com.RBS.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.RBS.demo.util.JwtUtil;

@Service
public class AuthServiceImpl implements Authservice {
    @Autowired
    private UserService userService;
    @Override
    public LoginResponseDto login(String username, String password, String role) {
        User user = userService.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)||!user.getRole().equals(role)) {
            throw new RuntimeException("login Failed");
        }
        if (!password.matches("^[A-Za-z\\d]{8,}$")) {
            throw new RuntimeException("Password must be at least 8 characters and contain only letters or digits");
        }
        String token = JwtUtil.generateToken(user);
        return new LoginResponseDto(token, role);
    }
    //return user!=null&&user.getPassword().equals(password);

    @Override
    public boolean changePassword(String oldPassword, String newPassword) {

        return false;
    }
}
