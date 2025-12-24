// backend/src/main/java/com/quiz/entity/QuizResult.java
package com.quiz.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    private Integer score; // percentage
    
    private Integer totalQuestions;
    
    private Integer correctAnswers;
    
    private Long timeTaken; // in seconds
    
    private Boolean passed;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime completedAt;
}