// backend/src/main/java/com/quiz/dto/QuizDTO.java
package com.quiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer timeLimit;
    private Integer passingScore;
    private List<QuestionDTO> questions;
}