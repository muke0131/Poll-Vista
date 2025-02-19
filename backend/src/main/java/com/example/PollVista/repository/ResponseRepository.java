package com.example.PollVista.repository;

import com.example.PollVista.entity.Response;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ResponseRepository extends MongoRepository<Response, String> {
    List<Response> findBySurveyId(Long surveyId);
    Long countBySurveyId(Long surveyId);
    void deleteBySurveyId(Long surveyId);
    Long countByUserId(Long userId);

    @Aggregation(pipeline = {
            "{ $unwind: '$responseData' }",
            "{ $match: { surveyId: ?0 } }",
            "{ $group: { _id: '$responseData.question.questionText', count: { $sum: 1 } } }",
            "{ $sort: { count: -1 } }",
            "{ $limit: 1 }",
            "{ $project: { _id: 0, mostAnsweredQuestion: '$_id' } }"
    })
    String findMostAnsweredQuestion(Long surveyId);

    @Aggregation(pipeline = {
            "{ $unwind: '$responseData' }",
            "{ $match: { surveyId: ?0 } }",
            "{ $group: { _id: '$responseData.question.questionText', count: { $sum: 1 } } }",
            "{ $sort: { count: 1 } }",
            "{ $limit: 1 }",
            "{ $project: { _id: 0, leastAnsweredQuestion: '$_id' } }"
    })
    String findLeastAnsweredQuestion(Long surveyId);

    @Aggregation(pipeline = {
            "{ $match: { surveyId: ?0, startedAt: { $ne: null }, submittedAt: { $ne: null } } }",
            "{ $group: { _id: null, averageResponseTime: { $avg: { $subtract: ['$submittedAt', '$startedAt'] } } } }",
            "{ $project: { _id: 0, averageResponseTime: 1 } }"
    })
    Double findAverageResponseTime(Long surveyId);

    @Aggregation(pipeline = {
            "{ $unwind: '$responseData' }",
            "{ $match: { surveyId: ?0 } }",
            // Project questionText, questionType, and answer (with a default if answer is null)
            "{ $project: { "
                    + "questionText: '$responseData.question.questionText', "
                    + "questionType: '$responseData.question.questionType', "
                    + "answer: { $ifNull: [{ $toString: '$responseData.answer' }, 'Unknown'] } "
                    + "} }",
            // Group by questionText, questionType, and answer
            "{ $group: { _id: { questionText: '$questionText', questionType: '$questionType', answer: '$answer' }, count: { $sum: 1 } } }",
            // Project the desired fields
            "{ $project: { _id: 0, questionText: '$_id.questionText', questionType: '$_id.questionType', answer: '$_id.answer', count: 1 } }"
    })
    List<Map<String, Object>> findResponseDistribution(Long surveyId);



    @Aggregation(pipeline = {
            "{ $match: { userId: ?0 } }",
            "{ $group: { _id: '$surveyId' } }",
            "{ $count: 'totalSurveys' }"
    })
    Long countTotalSurveysByUserId(Long userId);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0, startedAt: { $ne: null }, submittedAt: { $ne: null } } }",
            "{ $group: { _id: null, averageResponseTime: { $avg: { $subtract: ['$submittedAt', '$startedAt'] } } } }",
            "{ $project: { _id: 0, averageResponseTime: 1 } }"
    })
    Double findAverageResponseTimeByUserId(Long userId);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0 } }",
            "{ $unwind: '$responseData' }",
            "{ $project: { "
                    + "questionText: '$responseData.question.questionText', "
                    + "answer: { $ifNull: [{ $toString: '$responseData.answer' }, 'Unknown'] } "
                    + "} }",
            "{ $group: { _id: { questionText: '$questionText', answer: '$answer' }, count: { $sum: 1 } } }",
            "{ $project: { _id: 0, questionText: '$_id.questionText', answer: '$_id.answer', count: 1 } }"
    })
    List<Map<String, Object>> findResponseDistributionByUserId(Long userId);

}