package com.example.PollVista.service.Impl;

import com.example.PollVista.dto.QuestionDTO;
import com.example.PollVista.dto.ResponseDTO;
import com.example.PollVista.entity.Question;
import com.example.PollVista.entity.Response;
import com.example.PollVista.repository.QuestionRepository;
import com.example.PollVista.repository.ResponseRepository;
import com.example.PollVista.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponseServiceImpl implements ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public ResponseDTO submitResponse(ResponseDTO responseDto) {
        Response response = mapToEntity(responseDto);
        response.setSubmittedAt(LocalDateTime.now());
        Response savedResponse = responseRepository.save(response);
        return mapToDTO(savedResponse);
    }

    @Override
    public List<ResponseDTO> getResponsesBySurveyId(Long surveyId) {
        List<Response> responses = responseRepository.findBySurveyId(surveyId);
        System.out.println(responses);
        return responses.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseDTO getResponseById(String responseId) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found with ID: " + responseId));
        return mapToDTO(response);
    }

    private Response mapToEntity(ResponseDTO responseDto) {
        Response response = new Response();
        response.setId(responseDto.getId());
        response.setSurveyId(responseDto.getSurveyId());
        response.setUserId(responseDto.getUserId());
        response.setSubmittedAt(responseDto.getSubmittedAt());
        response.setStartedAt(responseDto.getStartedAt());

        List<Response.ResponseData> responseDataList = responseDto.getResponses().stream()
                .map(responseDataDto -> {
                    Response.ResponseData responseData = new Response.ResponseData();
                    Question question = questionRepository.findById(responseDataDto.getQuestion().getId())
                            .orElseThrow(() -> new RuntimeException("Question not found with ID: " + responseDataDto.getQuestion().getId()));
                    responseData.setQuestion(question);
                    responseData.setAnswer(responseDataDto.getAnswer());
                    return responseData;
                })
                .collect(Collectors.toList());

        response.setResponseData(responseDataList);
        return response;
    }

    private ResponseDTO mapToDTO(Response response) {
        ResponseDTO dto = new ResponseDTO();
        dto.setId(response.getId());
        dto.setSurveyId(response.getSurveyId());
        dto.setUserId(response.getUserId());
        dto.setSubmittedAt(response.getSubmittedAt());
        dto.setStartedAt(response.getStartedAt());

        List<ResponseDTO.ResponseDataDTO> responseDataDtoList = response.getResponseData().stream()
                .map(responseData -> {
                    QuestionDTO questionDto = new QuestionDTO(
                            responseData.getQuestion().getId(),
                            responseData.getQuestion().getQuestionType(),
                            responseData.getQuestion().getQuestionText(),
                            responseData.getQuestion().getOptions()
                    );
                    return new ResponseDTO.ResponseDataDTO(questionDto, responseData.getAnswer());
                })
                .collect(Collectors.toList());

        dto.setResponses(responseDataDtoList);
        return dto;
    }
}
