package com.example.PollVista.service;


import com.example.PollVista.dto.ResponseDTO;
import java.util.List;
public interface ResponseService {
    ResponseDTO submitResponse(ResponseDTO responseDto);
    List<ResponseDTO> getResponsesBySurveyId(Long surveyId);
    ResponseDTO getResponseById(String responseId);

}