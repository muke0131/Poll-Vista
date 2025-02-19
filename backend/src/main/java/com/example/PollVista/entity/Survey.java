package com.example.PollVista.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "surveys")
@Data
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime deadline;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;

    @ElementCollection
    @Column(name = "question_ids")
    private List<String> questionIds;
}
