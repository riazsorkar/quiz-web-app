// backend/src/main/java/com/quiz/repository/RoleRepository.java
package com.quiz.repository;

import com.quiz.entity.Role;
import com.quiz.entity.Role.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(RoleName name);
}