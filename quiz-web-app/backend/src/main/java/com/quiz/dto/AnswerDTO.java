// backend/src/main/java/com/quiz/dto/AnswerDTO.java
package com.quiz.dto;

import lombok.Data;

@Data
public class AnswerDTO {
    private Long questionId;
    private Integer selectedOption;
}