package com.example.PollVista.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Setter
@Getter
public class AnalyticsDTO {
    private Long totalSurveys;
    private Long totalResponses;
    private String mostAnsweredQuestion;
    private String leastAnsweredQuestion;
    private Double averageResponseTime;
    private Double averageResponsesPerSurvey;
    private List<QuestionAnalytics> questions;

    @Setter
    @Getter
    public static class QuestionAnalytics {
        private String questionText;
        private String questionType;
        private Map<String, Long> responseDistribution;
        private List<String> textResponses;
    }
}