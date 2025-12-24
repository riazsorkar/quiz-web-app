// backend/src/main/java/com/quiz/dto/QuestionDTO.java
package com.quiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private Long id;
    private String text;
    private List<String> options;
    private Integer correctOptionIndex;
    private String explanation;
}