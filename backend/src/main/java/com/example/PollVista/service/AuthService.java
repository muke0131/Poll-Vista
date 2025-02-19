package com.example.PollVista.service;

import com.example.PollVista.dto.AuthRequest;
import com.example.PollVista.dto.AuthResponse;
import com.example.PollVista.entity.User;

public interface AuthService {
    User register(AuthRequest request);
    AuthResponse login(AuthRequest request);
}