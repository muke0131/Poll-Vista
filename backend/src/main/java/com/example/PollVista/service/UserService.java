package com.example.PollVista.service;

import com.example.PollVista.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    void deactivateUser(Long userId);
    UserDTO getUserById(Long userId);
}