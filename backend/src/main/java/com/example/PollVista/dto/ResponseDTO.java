package com.example.PollVista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "responses")
public class ResponseDTO {
    @Id
    private String id;
    private Long surveyId;
    private Long userId;
    private List<ResponseDataDTO> responses;
    private LocalDateTime submittedAt;
    private LocalDateTime startedAt;

    @Data
    @AllArgsConstructor
    public static class ResponseDataDTO {
        private QuestionDTO question;
        private Object answer;

    }
}