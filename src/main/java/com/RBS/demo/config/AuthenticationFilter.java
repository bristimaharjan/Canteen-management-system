package com.RBS.demo.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import  org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.RBS.demo.util.JwtUtil;

import java.io.IOException;
import java.util.Collections;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Authorization Header is missing or does not start with 'Bearer '");
            filterChain.doFilter(request, response);
            return;
        }
        final String jwtToken;
        final String username;

        jwtToken = authHeader.substring(7);
        System.out.println("Extracted JWT Token: " + jwtToken);
        username = JwtUtil.extractUsername(jwtToken);

        if (username != null) {
            System.out.println("Validating token for username: " + username);
            if (JwtUtil.validateToken(jwtToken, username)) {
                System.out.println("Token is valid for username: " + username);
                // Set the authentication context
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.emptyList()
                        );
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } else {
                System.out.println("Invalid token for username: " + username);
            }
        } else {
            System.out.println("Failed to extract username from token.");
        }

        filterChain.doFilter(request, response);
    }
}
