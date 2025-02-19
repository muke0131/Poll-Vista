package com.example.PollVista.service.Impl;

import com.example.PollVista.util.JwtUtil;
import com.example.PollVista.dto.AuthRequest;
import com.example.PollVista.dto.AuthResponse;
import com.example.PollVista.entity.User;
import com.example.PollVista.repository.UserRepository;
import com.example.PollVista.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("user");
        userRepository.save(user);
        return user;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Objects.equals(request.getPassword(), user.getPassword())) {
            AuthResponse response = new AuthResponse();
            response.setToken(jwtUtil.generateToken(user.getEmail()));
            response.setRole(user.getRole());
            return response;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}