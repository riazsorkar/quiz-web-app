// backend/src/main/java/com/quiz/entity/Role.java
package com.quiz.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RoleName name;

    public enum RoleName {
        ROLE_STUDENT,
        ROLE_ADMIN
    }

    public Role(RoleName name) {
        this.name = name;
    }
}