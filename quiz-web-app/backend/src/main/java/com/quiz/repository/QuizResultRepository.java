package com.quiz.repository;

import com.quiz.entity.Quiz;
import com.quiz.entity.QuizResult;
import com.quiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUser(User user);
    List<QuizResult> findByUserOrderByCompletedAtDesc(User user);
    List<QuizResult> findByQuiz(Quiz quiz);
    List<QuizResult> findByQuizId(Long quizId);
    
    @Query("SELECT qr FROM QuizResult qr ORDER BY qr.completedAt DESC")
    List<QuizResult> findAllByOrderByCompletedAtDesc();
}