package com.example.PollVista.controller;

import com.example.PollVista.dto.AnalyticsDTO;
import com.example.PollVista.exception.JwtValidationException;
import com.example.PollVista.service.AnalyticsService;
import com.example.PollVista.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

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

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<AnalyticsDTO> getSurveyAnalytics(@PathVariable Long surveyId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        AnalyticsDTO analytics = analyticsService.getSurveyAnalytics(surveyId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<AnalyticsDTO> getUserAnalytics(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        AnalyticsDTO analytics = analyticsService.getUserAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
}
