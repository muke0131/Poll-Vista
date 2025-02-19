package com.example.PollVista.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String role;
}