package com.example.PollVista.controller;

import com.example.PollVista.dto.SurveyDTO;
import com.example.PollVista.entity.User;
import com.example.PollVista.exception.JwtValidationException;
import com.example.PollVista.repository.UserRepository;
import com.example.PollVista.service.SurveyService;
import com.example.PollVista.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("surveys")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

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

    private Long getUserIdFromToken(String token) {
        token = token.substring(7).trim();
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<?> createSurvey(@RequestBody SurveyDTO request, @RequestHeader("Authorization") String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Authorization header is required");
        }

        validateToken(token);
        Long userId = getUserIdFromToken(token);

        return ResponseEntity.ok(surveyService.createSurvey(request, userId));
    }

    @GetMapping
    public ResponseEntity<?> getAllSurveys(@RequestHeader("Authorization") String token) {
        validateToken(token);
        return ResponseEntity.ok(surveyService.getAllSurveys());
    }

    @DeleteMapping("/{surveyId}")
    public ResponseEntity<?> deleteSurvey(@PathVariable Long surveyId,
                                          @RequestHeader("Authorization") String token) {
        validateToken(token);
        surveyService.deleteSurvey(surveyId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Survey deleted successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{surveyId}")
    public ResponseEntity<?> getSurveyById(@PathVariable Long surveyId, @RequestHeader("Authorization") String token) {
        validateToken(token);
        SurveyDTO surveyDTO = surveyService.getSurveyById(surveyId);
        return ResponseEntity.ok(surveyDTO);
    }

    @PutMapping("/{surveyId}")
    public ResponseEntity<?> updateSurvey(
            @PathVariable Long surveyId,
            @RequestBody SurveyDTO request,
            @RequestHeader("Authorization") String token) {
        validateToken(token);
        Long userId = getUserIdFromToken(token);
        SurveyDTO updatedSurvey = surveyService.updateSurvey(surveyId, request);
        return ResponseEntity.ok(updatedSurvey);
    }

    @GetMapping("/my-surveys")
    public ResponseEntity<?> getMySurveys(@RequestHeader("Authorization") String token) {
        validateToken(token);
        Long userId = getUserIdFromToken(token);
        return ResponseEntity.ok(surveyService.getSurveysCreatedByUser(userId));
    }

    @GetMapping("/others-surveys")
    public ResponseEntity<?> getSurveysCreatedByOtherUsers(@RequestHeader("Authorization") String token) {
        validateToken(token);
        Long userId = getUserIdFromToken(token);
        return ResponseEntity.ok(surveyService.getSurveysCreatedByOtherUsers(userId));
    }
}
