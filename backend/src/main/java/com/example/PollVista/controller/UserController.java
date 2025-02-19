package com.example.PollVista.controller;

import com.example.PollVista.dto.UserDTO;
import com.example.PollVista.exception.JwtValidationException;
import com.example.PollVista.repository.UserRepository;
import com.example.PollVista.service.UserService;
import com.example.PollVista.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private void validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new JwtValidationException("Missing or invalid Authorization header");
        }

        token = token.substring(7).trim();
        String email = jwtUtil.extractEmail(token);
        if (!jwtUtil.validateToken(token, email)) {
            throw new JwtValidationException("Invalid or expired token");
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String token) {
        validateToken(token);
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        userService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        UserDTO userDTO = userService.getUserById(userId);
        return ResponseEntity.ok(userDTO);
    }

}