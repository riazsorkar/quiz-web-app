// backend/src/main/java/com/quiz/dto/JwtResponse.java
package com.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;
    private Integer score;
    
    // Add type field with default value
    private String type = "Bearer";
    
    // Constructor that matches what we're using
    public JwtResponse(String token, Long id, String email, String firstName, 
                      String lastName, List<String> roles, Integer score) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
        this.score = score;
    }
}