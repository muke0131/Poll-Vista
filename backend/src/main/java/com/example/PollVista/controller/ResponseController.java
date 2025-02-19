package com.example.PollVista.controller;

import com.example.PollVista.dto.ResponseDTO;
import com.example.PollVista.entity.User;
import com.example.PollVista.exception.JwtValidationException;
import com.example.PollVista.repository.UserRepository;
import com.example.PollVista.service.ResponseService;
import com.example.PollVista.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

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

    @PostMapping
    public ResponseEntity<ResponseDTO> submitResponse(@RequestBody ResponseDTO request, @RequestHeader("Authorization") String token) {
        validateToken(token);
        String email = jwtUtil.extractEmail(token.substring(7).trim());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getResponses() == null || request.getResponses().isEmpty()) {
            throw new RuntimeException("Responses cannot be null or empty");
        }
        for (ResponseDTO.ResponseDataDTO responseDataDto : request.getResponses()) {
            if (responseDataDto.getQuestion() == null) {
                throw new RuntimeException("Question cannot be null in ResponseDataDTO");
            }
        }

        request.setUserId(user.getId());
        return ResponseEntity.ok(responseService.submitResponse(request));
    }

    @GetMapping("/surveys/{surveyId}")
    public ResponseEntity<List<ResponseDTO>> getSurveyResponses(@PathVariable Long surveyId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        return ResponseEntity.ok(responseService.getResponsesBySurveyId(surveyId));
    }

    @GetMapping("/{responseId}")
    public ResponseEntity<ResponseDTO> getResponseById(@PathVariable String responseId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        return ResponseEntity.ok(responseService.getResponseById(responseId));
    }
}

