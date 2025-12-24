package com.quiz.repository;

import com.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCategory(String category);
    List<Quiz> findByDifficulty(String difficulty);
    List<Quiz> findByCategoryAndDifficulty(String category, String difficulty);
    List<Quiz> findTop5ByOrderByCreatedAtDesc();
}