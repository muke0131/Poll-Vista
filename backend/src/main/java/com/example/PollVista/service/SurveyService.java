package com.example.PollVista.service;

import com.example.PollVista.dto.SurveyDTO;
import java.util.List;

public interface SurveyService {
    SurveyDTO createSurvey(SurveyDTO request, Long userId);
    List<SurveyDTO> getAllSurveys();
    void deleteSurvey(Long surveyId);
    SurveyDTO getSurveyById(Long surveyId);
    SurveyDTO updateSurvey(Long surveyId, SurveyDTO request);
    List<SurveyDTO> getSurveysCreatedByUser(Long userId);
    List<SurveyDTO> getSurveysCreatedByOtherUsers(Long userId);
    void deactivateExpiredSurveys();
}
