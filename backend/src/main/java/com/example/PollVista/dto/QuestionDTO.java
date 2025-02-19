package com.example.PollVista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuestionDTO {
    private String id;
    private String questionType;
    private String questionText;
    private List<String> options;
}