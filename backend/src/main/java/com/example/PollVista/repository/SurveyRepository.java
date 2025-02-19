package com.example.PollVista.repository;

import com.example.PollVista.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCreatedById(Long userId);

    List<Survey> findByCreatedByIdNotAndIsPublicTrue(Long userId);

    List<Survey> findByDeadlineBeforeAndIsActiveTrue(LocalDateTime now);
}
