package com.quiz.service;

import com.quiz.dto.*;
import com.quiz.entity.*;
import com.quiz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private QuizResultRepository quizResultRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    // Get all quizzes (public)
    public List<QuizDTO> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return convertToDTOList(quizzes);
    }
    
    // Get quiz by ID (public - without correct answers)
    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        return convertToDTO(quiz, false); // Don't include correct answers
    }
    
    // Get quiz by ID (admin - with correct answers)
    public QuizDTO getQuizForAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        return convertToDTO(quiz, true); // Include correct answers for admin
    }
    
    // Create new quiz
    @Transactional
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        // Create quiz entity
        Quiz quiz = new Quiz();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setCategory(quizDTO.getCategory());
        quiz.setDifficulty(quizDTO.getDifficulty());
        quiz.setTimeLimit(quizDTO.getTimeLimit());
        quiz.setPassingScore(quizDTO.getPassingScore());
        quiz.setCreatedAt(LocalDateTime.now());
        
        Quiz savedQuiz = quizRepository.save(quiz);
        
        // Save questions
        if (quizDTO.getQuestions() != null && !quizDTO.getQuestions().isEmpty()) {
            List<Question> questions = new ArrayList<>();
            for (QuestionDTO questionDTO : quizDTO.getQuestions()) {
                Question question = new Question();
                question.setText(questionDTO.getText());
                question.setOptions(questionDTO.getOptions());
                question.setCorrectOptionIndex(questionDTO.getCorrectOptionIndex());
                question.setExplanation(questionDTO.getExplanation());
                question.setQuiz(savedQuiz);
                questions.add(question);
            }
            questionRepository.saveAll(questions);
        }
        
        return convertToDTO(savedQuiz, true);
    }
    
    // Update quiz
    @Transactional
    public QuizDTO updateQuiz(Long quizId, QuizDTO quizDTO) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        // Update quiz fields
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setCategory(quizDTO.getCategory());
        quiz.setDifficulty(quizDTO.getDifficulty());
        quiz.setTimeLimit(quizDTO.getTimeLimit());
        quiz.setPassingScore(quizDTO.getPassingScore());
        
        Quiz updatedQuiz = quizRepository.save(quiz);
        
        // Update questions if provided
        if (quizDTO.getQuestions() != null && !quizDTO.getQuestions().isEmpty()) {
            // Delete existing questions
            questionRepository.deleteByQuiz(quiz);
            
            // Add new questions
            List<Question> questions = new ArrayList<>();
            for (QuestionDTO questionDTO : quizDTO.getQuestions()) {
                Question question = new Question();
                question.setText(questionDTO.getText());
                question.setOptions(questionDTO.getOptions());
                question.setCorrectOptionIndex(questionDTO.getCorrectOptionIndex());
                question.setExplanation(questionDTO.getExplanation());
                question.setQuiz(updatedQuiz);
                questions.add(question);
            }
            questionRepository.saveAll(questions);
        }
        
        return convertToDTO(updatedQuiz, true);
    }
    
    // Delete quiz
    @Transactional
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        // Delete associated results first (due to foreign key constraints)
        List<QuizResult> results = quizResultRepository.findByQuiz(quiz);
        if (!results.isEmpty()) {
            quizResultRepository.deleteAll(results);
        }
        
        // Delete questions
        questionRepository.deleteByQuiz(quiz);
        
        // Finally delete the quiz
        quizRepository.delete(quiz);
    }
    
    // Get quizzes by category
    public List<QuizDTO> getQuizzesByCategory(String category) {
        List<Quiz> quizzes = quizRepository.findByCategory(category);
        return convertToDTOList(quizzes);
    }
    
    // Submit quiz and calculate score
    @Transactional
    public QuizResultDTO submitQuiz(QuizSubmissionDTO submission, Long userId) {
        // Get quiz
        Quiz quiz = quizRepository.findById(submission.getQuizId())
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Calculate score
        int correctAnswers = 0;
        int totalQuestions = quiz.getQuestions().size();
        
        for (AnswerDTO answer : submission.getAnswers()) {
            Question question = questionRepository.findById(answer.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
            
            if (question.getCorrectOptionIndex().equals(answer.getSelectedOption())) {
                correctAnswers++;
            }
        }
        
        // Calculate percentage
        int score = (int) Math.round((correctAnswers * 100.0) / totalQuestions);
        boolean passed = score >= quiz.getPassingScore();
        
        // Create quiz result
        QuizResult quizResult = new QuizResult();
        quizResult.setQuiz(quiz);
        quizResult.setUser(user);
        quizResult.setScore(score);
        quizResult.setTotalQuestions(totalQuestions);
        quizResult.setCorrectAnswers(correctAnswers);
        quizResult.setTimeTaken(submission.getTimeTaken());
        quizResult.setPassed(passed);
        quizResult.setCompletedAt(LocalDateTime.now());
        
        quizResultRepository.save(quizResult);
        
        // Update user score (10 points per correct answer)
        int pointsEarned = correctAnswers * 10;
        user.setScore(user.getScore() + pointsEarned);
        user.setTotalQuizzesTaken(user.getTotalQuizzesTaken() + 1);
        if (passed) {
            user.setQuizzesPassed(user.getQuizzesPassed() + 1);
        }
        userRepository.save(user);
        
        // Convert to DTO
        QuizResultDTO resultDTO = new QuizResultDTO();
        resultDTO.setQuizId(quiz.getId());
        resultDTO.setScore(score);
        resultDTO.setTotalQuestions(totalQuestions);
        resultDTO.setCorrectAnswers(correctAnswers);
        resultDTO.setTimeTaken(submission.getTimeTaken());
        resultDTO.setPassed(passed);
        
        return resultDTO;
    }
    
    // Get user's quiz results
    public List<QuizResultDTO> getUserQuizResults(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<QuizResult> results = quizResultRepository.findByUserOrderByCompletedAtDesc(user);
        List<QuizResultDTO> resultDTOs = new ArrayList<>();
        
        for (QuizResult result : results) {
            QuizResultDTO dto = new QuizResultDTO();
            dto.setQuizId(result.getQuiz().getId());
            dto.setScore(result.getScore());
            dto.setTotalQuestions(result.getTotalQuestions());
            // dto.setCorrectAnswerCount(result.getCorrectAnswers());
            dto.setTimeTaken(result.getTimeTaken());
            dto.setPassed(result.getPassed());
            resultDTOs.add(dto);
        }
        
        return resultDTOs;
    }
    
    // Get all quiz results (admin)
    public List<QuizResultDTO> getAllQuizResults() {
        List<QuizResult> results = quizResultRepository.findAllByOrderByCompletedAtDesc();
        List<QuizResultDTO> resultDTOs = new ArrayList<>();
        
        for (QuizResult result : results) {
            QuizResultDTO dto = new QuizResultDTO();
            dto.setQuizId(result.getQuiz().getId());
            dto.setScore(result.getScore());
            dto.setTotalQuestions(result.getTotalQuestions());
            // dto.setCorrectAnswerCount(result.getCorrectAnswers());
            dto.setTimeTaken(result.getTimeTaken());
            dto.setPassed(result.getPassed());
            dto.setUserId(result.getUser().getId());
            // dto.setUserName(result.getUser().getFirstName() + " " + result.getUser().getLastName());
            resultDTOs.add(dto);
        }
        
        return resultDTOs;
    }
    
    // Helper methods for conversion
    private List<QuizDTO> convertToDTOList(List<Quiz> quizzes) {
        List<QuizDTO> quizDTOs = new ArrayList<>();
        for (Quiz quiz : quizzes) {
            quizDTOs.add(convertToDTO(quiz, false));
        }
        return quizDTOs;
    }
    
    public QuizDTO convertToDTO(Quiz quiz, boolean includeCorrectAnswers) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setCategory(quiz.getCategory());
        dto.setDifficulty(quiz.getDifficulty());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setPassingScore(quiz.getPassingScore());
        
        // Convert questions
        List<QuestionDTO> questionDTOs = new ArrayList<>();
        if (quiz.getQuestions() != null) {
            for (Question question : quiz.getQuestions()) {
                QuestionDTO questionDTO = new QuestionDTO();
                questionDTO.setId(question.getId());
                questionDTO.setText(question.getText());
                questionDTO.setOptions(question.getOptions());
                
                if (includeCorrectAnswers) {
                    questionDTO.setCorrectOptionIndex(question.getCorrectOptionIndex());
                } else {
                    questionDTO.setCorrectOptionIndex(null); // Don't send to regular users
                }
                
                questionDTO.setExplanation(question.getExplanation());
                questionDTOs.add(questionDTO);
            }
        }
        dto.setQuestions(questionDTOs);
        
        return dto;
    }
}