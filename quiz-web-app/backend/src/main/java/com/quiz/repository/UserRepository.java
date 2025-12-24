// backend/src/main/java/com/quiz/repository/UserRepository.java
package com.quiz.repository;

import com.quiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findTop5ByOrderByCreatedAtDesc();
}