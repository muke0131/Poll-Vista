package com.example.PollVista.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "questions")
@Data
public class Question {
    @Id
    private String id;
    private Long surveyId;
    private String questionType;
    private String questionText;
    private List<String> options;
    private LocalDateTime createdAt = LocalDateTime.now();
}