package com.RBS.demo.service;

import com.RBS.demo.dto.LoginResponseDto;

public interface Authservice {
    LoginResponseDto login(String username, String password, String role );
    boolean changePassword(String oldPassword,String newPassword);
}
