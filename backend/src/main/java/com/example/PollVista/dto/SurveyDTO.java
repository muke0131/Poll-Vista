package com.example.PollVista.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SurveyDTO {
    private Long id;
    private String title;
    private String description;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private Boolean isActive;
    private Boolean isPublic; // New field
    private List<QuestionDTO> questions;
}
