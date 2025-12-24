// backend/src/main/java/com/quiz/dto/QuizResultDTO.java
package com.quiz.dto;

import lombok.Data;

@Data
public class QuizResultDTO {
    private Long quizId;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Long timeTaken;
    private Boolean passed;
    public void setUserId(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setUserId'");
    }
}