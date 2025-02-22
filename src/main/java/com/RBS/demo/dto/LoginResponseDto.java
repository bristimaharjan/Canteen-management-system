package com.RBS.demo.dto;


public class LoginResponseDto {
    private String token;
    private String userRole;

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public LoginResponseDto(String token, String userRole) {
        this.token = token;
        this.userRole= userRole;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}