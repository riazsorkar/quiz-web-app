package com.quiz.controller;

import com.quiz.dto.*;
import com.quiz.security.services.UserDetailsImpl;
import com.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class QuizController {
    
    @Autowired
    private QuizService quizService;
    
    // Get all quizzes
    @GetMapping("/all")
    public ResponseEntity<?> getAllQuizzes() {
        try {
            List<QuizDTO> quizzes = quizService.getAllQuizzes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", quizzes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get quiz by ID
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizById(@PathVariable Long quizId) {
        try {
            QuizDTO quiz = quizService.getQuizById(quizId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", quiz);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get quizzes by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getQuizzesByCategory(@PathVariable String category) {
        try {
            List<QuizDTO> quizzes = quizService.getQuizzesByCategory(category);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", quizzes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Submit quiz
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody QuizSubmissionDTO submission) {
        try {
            // Get current user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Long userId = userDetails.getId();
            
            QuizResultDTO result = quizService.submitQuiz(submission, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quiz submitted successfully!");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get user's quiz results
    @GetMapping("/my-results")
    public ResponseEntity<?> getMyQuizResults() {
        try {
            // Get current user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Long userId = userDetails.getId();
            
            List<QuizResultDTO> results = quizService.getUserQuizResults(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", results);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Quiz API is working!"
        ));
    }
}