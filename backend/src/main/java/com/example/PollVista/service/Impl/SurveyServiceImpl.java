package com.example.PollVista.service.Impl;

import com.example.PollVista.dto.QuestionDTO;
import com.example.PollVista.dto.SurveyDTO;
import com.example.PollVista.entity.Question;
import com.example.PollVista.entity.Survey;
import com.example.PollVista.entity.User;
import com.example.PollVista.repository.QuestionRepository;
import com.example.PollVista.repository.ResponseRepository;
import com.example.PollVista.repository.SurveyRepository;
import com.example.PollVista.repository.UserRepository;
import com.example.PollVista.service.SurveyService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurveyServiceImpl implements SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Override
    public SurveyDTO createSurvey(SurveyDTO request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Question> savedQuestions = request.getQuestions().stream()
                .map(q -> {
                    Question question = new Question();
                    question.setSurveyId(null);
                    question.setQuestionType(q.getQuestionType());
                    question.setQuestionText(q.getQuestionText());
                    question.setOptions(q.getOptions());
                    return questionRepository.save(question);
                })
                .collect(Collectors.toList());

        Survey survey = new Survey();
        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setCreatedBy(user);
        survey.setDeadline(request.getDeadline());
        // Set isPublic value (default true if not provided)
        survey.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : true);

        List<String> questionIds = savedQuestions.stream()
                .map(question -> question.getId().toString())
                .collect(Collectors.toList());

        survey.setQuestionIds(questionIds);
        surveyRepository.save(survey);

        return mapToDTO(survey, savedQuestions);
    }

    @Override
    public List<SurveyDTO> getAllSurveys() {
        return surveyRepository.findAll().stream()
                .map(survey -> {
                    List<Question> questions = questionRepository.findAllById(survey.getQuestionIds());
                    return mapToDTO(survey, questions);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSurvey(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found with ID: " + surveyId));
        if (survey.getQuestionIds() != null && !survey.getQuestionIds().isEmpty()) {
            questionRepository.deleteAllById(survey.getQuestionIds());
        }
        responseRepository.deleteBySurveyId(surveyId);
        surveyRepository.deleteById(surveyId);
    }

    @Override
    public SurveyDTO getSurveyById(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found with ID: " + surveyId));

        List<Question> questions = questionRepository.findAllById(survey.getQuestionIds());

        return mapToDTO(survey, questions);
    }

    @Override
    public SurveyDTO updateSurvey(Long surveyId, SurveyDTO request) {
        Survey existingSurvey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found with ID: " + surveyId));

        existingSurvey.setTitle(request.getTitle());
        existingSurvey.setDescription(request.getDescription());
        existingSurvey.setDeadline(request.getDeadline());
        existingSurvey.setIsActive(request.getIsActive());
        existingSurvey.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : true);

        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            questionRepository.deleteAllById(existingSurvey.getQuestionIds());

            List<Question> updatedQuestions = request.getQuestions().stream()
                    .map(q -> {
                        Question question = new Question();
                        question.setSurveyId(surveyId);
                        question.setQuestionType(q.getQuestionType());
                        question.setQuestionText(q.getQuestionText());
                        question.setOptions(q.getOptions());
                        return questionRepository.save(question);
                    })
                    .toList();

            List<String> updatedQuestionIds = updatedQuestions.stream()
                    .map(question -> question.getId().toString())
                    .collect(Collectors.toList());
            existingSurvey.setQuestionIds(updatedQuestionIds);
        }

        Survey updatedSurvey = surveyRepository.save(existingSurvey);

        List<Question> questions = questionRepository.findAllById(updatedSurvey.getQuestionIds());

        return mapToDTO(updatedSurvey, questions);
    }

    @Override
    public List<SurveyDTO> getSurveysCreatedByUser(Long userId) {
        List<Survey> surveys = surveyRepository.findByCreatedById(userId);
        return surveys.stream()
                .map(survey -> {
                    List<Question> questions = questionRepository.findAllById(survey.getQuestionIds());
                    return mapToDTO(survey, questions);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<SurveyDTO> getSurveysCreatedByOtherUsers(Long userId) {
        List<Survey> surveys = surveyRepository.findByCreatedByIdNotAndIsPublicTrue(userId);
        return surveys.stream()
                .map(survey -> {
                    List<Question> questions = questionRepository.findAllById(survey.getQuestionIds());
                    return mapToDTO(survey, questions);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void deactivateExpiredSurveys() {
        LocalDateTime now = LocalDateTime.now();
        List<Survey> expiredSurveys = surveyRepository.findByDeadlineBeforeAndIsActiveTrue(now);

        if (!expiredSurveys.isEmpty()) {
            for (Survey survey : expiredSurveys) {
                survey.setIsActive(false);
            }
            surveyRepository.saveAll(expiredSurveys);
        }
    }

    private SurveyDTO mapToDTO(Survey survey, List<Question> questions) {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(survey.getId());
        dto.setTitle(survey.getTitle());
        dto.setDescription(survey.getDescription());
        dto.setCreatedBy(survey.getCreatedBy().getId());
        dto.setCreatedAt(survey.getCreatedAt());
        dto.setDeadline(survey.getDeadline());
        dto.setIsActive(survey.getIsActive());
        dto.setIsPublic(survey.getIsPublic());
        dto.setQuestions(questions.stream()
                .map(q -> new QuestionDTO(q.getId(), q.getQuestionType(), q.getQuestionText(), q.getOptions()))
                .collect(Collectors.toList()));
        return dto;
    }
}
