package com.example.PollVista.service.Impl;

import com.example.PollVista.dto.AnalyticsDTO;
import com.example.PollVista.entity.Survey;
import com.example.PollVista.repository.ResponseRepository;
import com.example.PollVista.repository.SurveyRepository;
import com.example.PollVista.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.logging.Logger;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger logger = Logger.getLogger(AnalyticsServiceImpl.class.getName());

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Override
    public AnalyticsDTO getSurveyAnalytics(Long surveyId) {
        AnalyticsDTO analytics = new AnalyticsDTO();

        logger.info("Fetching analytics for surveyId: " + surveyId);

        List<Survey> allSurveys = surveyRepository.findAll();
        Long totalSurveys = (long) allSurveys.size();
        analytics.setTotalSurveys(totalSurveys);

        Long totalResponses = responseRepository.countBySurveyId(surveyId);
        analytics.setTotalResponses(totalResponses);

        String mostAnsweredQuestion = responseRepository.findMostAnsweredQuestion(surveyId);
        analytics.setMostAnsweredQuestion(mostAnsweredQuestion);

        String leastAnsweredQuestion = responseRepository.findLeastAnsweredQuestion(surveyId);
        analytics.setLeastAnsweredQuestion(leastAnsweredQuestion);

        Double averageResponseTime = responseRepository.findAverageResponseTime(surveyId);
        analytics.setAverageResponseTime(averageResponseTime);

        List<Map<String, Object>> responseDistribution = responseRepository.findResponseDistribution(surveyId);

        List<AnalyticsDTO.QuestionAnalytics> questionAnalyticsList = responseDistribution.stream()
                .collect(Collectors.groupingBy(
                        map -> {
                            String questionText = (String) map.get("questionText");
                            String questionType = (String) map.get("questionType");
                            // Use a default value if questionText is null
                            return (questionText != null ? questionText : "Unknown question")
                                    + "||" + (questionType != null ? questionType : "Unknown type");
                        },
                        Collectors.groupingBy(
                                map -> (String) map.get("answer"),  // Cast answer to String
                                Collectors.summingLong(map -> ((Number) map.get("count")).longValue())
                        )
                ))
                .entrySet().stream()
                .map(entry -> {
                    AnalyticsDTO.QuestionAnalytics questionAnalytics = new AnalyticsDTO.QuestionAnalytics();
                    String[] parts = entry.getKey().split("\\|\\|");
                    questionAnalytics.setQuestionText(parts[0]);
                    questionAnalytics.setQuestionType(parts.length > 1 ? parts[1] : null);
                    questionAnalytics.setResponseDistribution(entry.getValue());
                    if ("TEXT".equalsIgnoreCase(questionAnalytics.getQuestionType())) {
                        List<String> textResponses = entry.getValue().entrySet().stream()
                                .flatMap(e -> {
                                    return java.util.Collections.nCopies(e.getValue().intValue(), e.getKey()).stream();
                                })
                                .collect(Collectors.toList());
                        questionAnalytics.setTextResponses(textResponses);
                    }
                    return questionAnalytics;
                })
                .collect(Collectors.toList());


        analytics.setQuestions(questionAnalyticsList);

        if (totalSurveys != 0) {
            Double averageResponsesPerSurvey = (double) totalResponses / totalSurveys;
            analytics.setAverageResponsesPerSurvey(averageResponsesPerSurvey);
        } else {
            analytics.setAverageResponsesPerSurvey(0.0);
        }

        return analytics;
    }


    public AnalyticsDTO getUserAnalytics(Long userId) {
        AnalyticsDTO analytics = new AnalyticsDTO();

        logger.info("Fetching analytics for userId: " + userId);

        Long totalResponses = responseRepository.countByUserId(userId);
        analytics.setTotalResponses(totalResponses);

        List<Survey> allSurveys = surveyRepository.findAll();
        Long totalSurveys = (long) allSurveys.size();
        analytics.setTotalSurveys(totalSurveys);

        Double averageResponseTime = responseRepository.findAverageResponseTimeByUserId(userId);
        analytics.setAverageResponseTime(averageResponseTime);

        List<Map<String, Object>> responseDistribution = responseRepository.findResponseDistributionByUserId(userId);

        List<AnalyticsDTO.QuestionAnalytics> questionAnalyticsList = responseDistribution.stream()
                .collect(Collectors.groupingBy(
                        map -> {
                            String questionText = (String) map.get("questionText");
                            return questionText != null ? questionText : "Unknown question";
                        },
                        Collectors.groupingBy(
                                map -> (String) map.get("answer"),
                                Collectors.counting()
                        )
                ))
                .entrySet().stream()
                .map(entry -> {
                    AnalyticsDTO.QuestionAnalytics questionAnalytics = new AnalyticsDTO.QuestionAnalytics();
                    questionAnalytics.setQuestionText(entry.getKey());
                    questionAnalytics.setResponseDistribution((Map<String, Long>) entry.getValue());
                    return questionAnalytics;
                })
                .collect(Collectors.toList());

        analytics.setQuestions(questionAnalyticsList);

        if (totalSurveys != 0) {
            Double averageResponsesPerSurvey = (double) totalResponses / totalSurveys;
            analytics.setAverageResponsesPerSurvey(averageResponsesPerSurvey);
        } else {
            analytics.setAverageResponsesPerSurvey(0.0);
        }

        return analytics;
    }

}