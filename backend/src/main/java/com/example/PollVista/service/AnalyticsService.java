package com.example.PollVista.service;

import com.example.PollVista.dto.AnalyticsDTO;

public interface AnalyticsService {
    AnalyticsDTO getSurveyAnalytics(Long surveyId);
    AnalyticsDTO getUserAnalytics(Long userId);
}