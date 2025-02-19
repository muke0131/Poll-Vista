package com.example.PollVista.entity;

import com.example.PollVista.dto.QuestionDTO;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "responses")
@Data
public class Response {
    @Id
    private String id;
    private Long surveyId;
    private Long userId;
    private List<ResponseData> responseData;
    private LocalDateTime submittedAt;
    private LocalDateTime startedAt;

    @Data
    public static class ResponseData {
        private Question question;
        private Object answer;
    }
}