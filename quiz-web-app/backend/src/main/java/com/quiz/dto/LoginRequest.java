// backend/src/main/java/com/quiz/dto/LoginRequest.java
package com.quiz.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
}