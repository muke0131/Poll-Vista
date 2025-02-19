package com.example.PollVista.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private String password;

}