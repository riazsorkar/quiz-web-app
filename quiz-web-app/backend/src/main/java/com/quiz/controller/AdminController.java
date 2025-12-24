package com.quiz.controller;

import com.quiz.dto.*;
import com.quiz.entity.Quiz;
import com.quiz.entity.User;
import com.quiz.repository.QuizRepository;
import com.quiz.repository.QuestionRepository;
import com.quiz.repository.UserRepository;
import com.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private QuizService quizService;
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userDTOs = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("firstName", user.getFirstName());
                    userMap.put("lastName", user.getLastName());
                    userMap.put("email", user.getEmail());
                    userMap.put("score", user.getScore());
                    userMap.put("quizzesTaken", user.getTotalQuizzesTaken());
                    userMap.put("quizzesPassed", user.getQuizzesPassed());
                    userMap.put("avatarColor", user.getAvatarColor());
                    userMap.put("createdAt", user.getCreatedAt());
                    return userMap;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get all quizzes (admin version with correct answers)
    @GetMapping("/quizzes")
    public ResponseEntity<?> getAllQuizzesForAdmin() {
        try {
            List<QuizDTO> quizzes = quizService.getAllQuizzes();
            // For admin, we need to include correct answers
            List<QuizDTO> adminQuizzes = quizzes.stream()
                .map(quizDTO -> {
                    Quiz quiz = quizRepository.findById(quizDTO.getId()).orElse(null);
                    if (quiz != null) {
                        return quizService.convertToDTO(quiz, true);
                    }
                    return quizDTO;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", adminQuizzes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get quiz by ID for admin (with correct answers)
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<?> getQuizForAdmin(@PathVariable Long quizId) {
        try {
            QuizDTO quiz = quizService.getQuizForAdmin(quizId);
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
    
    // Create new quiz
    @PostMapping("/quiz")
    public ResponseEntity<?> createQuiz(@RequestBody QuizDTO quizDTO) {
        try {
            // Validate quiz data
            if (quizDTO.getTitle() == null || quizDTO.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Quiz title is required")
                );
            }
            
            if (quizDTO.getQuestions() == null || quizDTO.getQuestions().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Quiz must have at least one question")
                );
            }
            
            // Validate each question
            for (int i = 0; i < quizDTO.getQuestions().size(); i++) {
                QuestionDTO question = quizDTO.getQuestions().get(i);
                if (question.getText() == null || question.getText().trim().isEmpty()) {
                    return ResponseEntity.badRequest().body(
                        Map.of("success", false, "message", "Question " + (i + 1) + " text is required")
                    );
                }
                
                if (question.getOptions() == null || question.getOptions().size() < 2) {
                    return ResponseEntity.badRequest().body(
                        Map.of("success", false, "message", "Question " + (i + 1) + " must have at least 2 options")
                    );
                }
                
                if (question.getCorrectOptionIndex() == null || 
                    question.getCorrectOptionIndex() < 0 || 
                    question.getCorrectOptionIndex() >= question.getOptions().size()) {
                    return ResponseEntity.badRequest().body(
                        Map.of("success", false, "message", "Question " + (i + 1) + " must have a valid correct option")
                    );
                }
            }
            
            QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quiz created successfully!");
            response.put("data", createdQuiz);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Update quiz
    @PutMapping("/quiz/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long quizId, @RequestBody QuizDTO quizDTO) {
        try {
            // Validate quiz exists
            if (!quizRepository.existsById(quizId)) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Quiz not found")
                );
            }
            
            // Validate quiz data
            if (quizDTO.getTitle() == null || quizDTO.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Quiz title is required")
                );
            }
            
            QuizDTO updatedQuiz = quizService.updateQuiz(quizId, quizDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quiz updated successfully!");
            response.put("data", updatedQuiz);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Delete quiz
    @DeleteMapping("/quiz/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long quizId) {
        try {
            if (!quizRepository.existsById(quizId)) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Quiz not found")
                );
            }
            
            quizService.deleteQuiz(quizId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quiz deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get all quiz results
    @GetMapping("/results")
    public ResponseEntity<?> getAllQuizResults() {
        try {
            List<QuizResultDTO> results = quizService.getAllQuizResults();
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
    
    // Delete user
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "User not found")
                );
            }
            
            userRepository.deleteById(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
    
    // Get quiz statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            long totalUsers = userRepository.count();
            long totalQuizzes = quizRepository.count();
            long totalQuestions = questionRepository.count();
            
            // Calculate average user score
            List<User> users = userRepository.findAll();
            double averageScore = users.stream()
                .mapToInt(User::getScore)
                .average()
                .orElse(0.0);
            
            // Get recent activity
            List<Quiz> recentQuizzes = quizRepository.findTop5ByOrderByCreatedAtDesc();
            List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalQuizzes", totalQuizzes);
            stats.put("totalQuestions", totalQuestions);
            stats.put("averageUserScore", Math.round(averageScore));
            stats.put("recentQuizzes", recentQuizzes.size());
            stats.put("recentUsers", recentUsers.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
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
            "message", "Admin API is working!"
        ));
    }
}