// backend/src/main/java/com/quiz/dto/QuizSubmissionDTO.java
package com.quiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizSubmissionDTO {
    private Long quizId;
    private List<AnswerDTO> answers;
    private Long timeTaken;
}