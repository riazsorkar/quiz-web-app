// backend/src/main/java/com/quiz/DataSeeder.java
package com.quiz;

import com.quiz.entity.*;
import com.quiz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataSeeder implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Starting Data Seeding ===");
        
        // 1. Create roles
        if (roleRepository.findByName(Role.RoleName.ROLE_STUDENT).isEmpty()) {
            roleRepository.save(new Role(Role.RoleName.ROLE_STUDENT));
            System.out.println("✓ Created ROLE_STUDENT");
        }
        
        if (roleRepository.findByName(Role.RoleName.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(Role.RoleName.ROLE_ADMIN));
            System.out.println("✓ Created ROLE_ADMIN");
        }
        
        // 2. Create test user
        if (userRepository.findByEmail("test@quiz.com").isEmpty()) {
            User testUser = new User();
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setEmail("test@quiz.com");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setAvatarColor("#4F46E5");
            testUser.setScore(100);
            testUser.setTotalQuizzesTaken(2);
            testUser.setQuizzesPassed(2);
            
            Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Student role not found"));
            testUser.setRoles(new HashSet<>());
            testUser.getRoles().add(studentRole);
            
            userRepository.save(testUser);
            System.out.println("✓ Created test user: test@quiz.com / password123");
        }

        // Add in the run method, after creating test user:
// Create admin user
if (userRepository.findByEmail("admin@quiz.com").isEmpty()) {
    User adminUser = new User();
    adminUser.setFirstName("Admin");
    adminUser.setLastName("User");
    adminUser.setEmail("admin@quiz.com");
    adminUser.setPassword(passwordEncoder.encode("admin123"));
    adminUser.setAvatarColor("#8B5CF6");
    adminUser.setScore(500);
    
    Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
        .orElseThrow(() -> new RuntimeException("Admin role not found"));
    Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
        .orElseThrow(() -> new RuntimeException("Student role not found"));
    
    adminUser.setRoles(new HashSet<>());
    adminUser.getRoles().add(adminRole);
    adminUser.getRoles().add(studentRole);
    
    userRepository.save(adminUser);
    System.out.println("✓ Created admin user: admin@quiz.com / admin123");
}
        
        // 3. Create sample quizzes
        if (quizRepository.count() == 0) {
            createSampleQuizzes();
            System.out.println("✓ Created sample quizzes");
        }
        
        System.out.println("=== Data seeding completed! ===");
    }
    
    private void createSampleQuizzes() {
        // Quiz 1: JavaScript Basics
        Quiz jsQuiz = new Quiz();
        jsQuiz.setTitle("JavaScript Fundamentals");
        jsQuiz.setDescription("Test your basic JavaScript knowledge");
        jsQuiz.setCategory("Programming");
        jsQuiz.setDifficulty("Easy");
        jsQuiz.setTimeLimit(15);
        jsQuiz.setPassingScore(70);
        quizRepository.save(jsQuiz);
        
        // Questions for JavaScript quiz
        Question q1 = new Question();
        q1.setText("Which keyword is used to declare a variable in JavaScript?");
        q1.setOptions(Arrays.asList("var", "let", "const", "All of the above"));
        q1.setCorrectOptionIndex(3);
        q1.setExplanation("JavaScript supports var, let, and const for variable declaration.");
        q1.setQuiz(jsQuiz);
        questionRepository.save(q1);
        
        Question q2 = new Question();
        q2.setText("What is the result of 2 + '2' in JavaScript?");
        q2.setOptions(Arrays.asList("4", "'4'", "'22'", "22"));
        q2.setCorrectOptionIndex(2);
        q2.setExplanation("JavaScript performs type coercion, converting 2 to string '2' and concatenating.");
        q2.setQuiz(jsQuiz);
        questionRepository.save(q2);
        
        Question q3 = new Question();
        q3.setText("Which method removes the last element from an array?");
        q3.setOptions(Arrays.asList("pop()", "push()", "shift()", "unshift()"));
        q3.setCorrectOptionIndex(0);
        q3.setExplanation("The pop() method removes the last element from an array and returns that element.");
        q3.setQuiz(jsQuiz);
        questionRepository.save(q3);
        
        Question q4 = new Question();
        q4.setText("What does === operator do?");
        q4.setOptions(Arrays.asList(
            "Compares values only",
            "Compares values and types", 
            "Assigns value",
            "Checks if undefined"
        ));
        q4.setCorrectOptionIndex(1);
        q4.setExplanation("=== is the strict equality operator that compares both value and type.");
        q4.setQuiz(jsQuiz);
        questionRepository.save(q4);
        
        Question q5 = new Question();
        q5.setText("How do you write a comment in JavaScript?");
        q5.setOptions(Arrays.asList(
            "// This is a comment",
            "<!-- This is a comment -->",
            "/* This is a comment */", 
            "Both A and C"
        ));
        q5.setCorrectOptionIndex(3);
        q5.setExplanation("JavaScript supports both single-line (//) and multi-line (/* */) comments.");
        q5.setQuiz(jsQuiz);
        questionRepository.save(q5);
        
        // Quiz 2: HTML Basics
        Quiz htmlQuiz = new Quiz();
        htmlQuiz.setTitle("HTML Fundamentals");
        htmlQuiz.setDescription("Basic HTML tags and structure");
        htmlQuiz.setCategory("Web Development");
        htmlQuiz.setDifficulty("Easy");
        htmlQuiz.setTimeLimit(10);
        htmlQuiz.setPassingScore(60);
        quizRepository.save(htmlQuiz);
        
        Question q6 = new Question();
        q6.setText("Which tag is used for the largest heading?");
        q6.setOptions(Arrays.asList("<h1>", "<head>", "<header>", "<h6>"));
        q6.setCorrectOptionIndex(0);
        q6.setExplanation("<h1> is used for the main heading, while <h6> is for the smallest.");
        q6.setQuiz(htmlQuiz);
        questionRepository.save(q6);
        
        Question q7 = new Question();
        q7.setText("Which tag creates a hyperlink?");
        q7.setOptions(Arrays.asList("<link>", "<a>", "<href>", "<url>"));
        q7.setCorrectOptionIndex(1);
        q7.setExplanation("The <a> tag (anchor tag) is used to create hyperlinks in HTML.");
        q7.setQuiz(htmlQuiz);
        questionRepository.save(q7);
        
        Question q8 = new Question();
        q8.setText("What does HTML stand for?");
        q8.setOptions(Arrays.asList(
            "Hyper Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
            "Hyper Transfer Markup Language"
        ));
        q8.setCorrectOptionIndex(0);
        q8.setExplanation("HTML stands for Hyper Text Markup Language.");
        q8.setQuiz(htmlQuiz);
        questionRepository.save(q8);
        
        // Quiz 3: CSS Basics
        Quiz cssQuiz = new Quiz();
        cssQuiz.setTitle("CSS Styling");
        cssQuiz.setDescription("Basic CSS properties and selectors");
        cssQuiz.setCategory("Web Development");
        cssQuiz.setDifficulty("Medium");
        cssQuiz.setTimeLimit(20);
        cssQuiz.setPassingScore(75);
        quizRepository.save(cssQuiz);
        
        Question q9 = new Question();
        q9.setText("Which property is used to change text color?");
        q9.setOptions(Arrays.asList("text-color", "font-color", "color", "text-style"));
        q9.setCorrectOptionIndex(2);
        q9.setExplanation("The 'color' property is used to set the color of text.");
        q9.setQuiz(cssQuiz);
        questionRepository.save(q9);
        
        Question q10 = new Question();
        q10.setText("How do you select an element with id 'header'?");
        q10.setOptions(Arrays.asList(".header", "#header", "*header", "header"));
        q10.setCorrectOptionIndex(1);
        q10.setExplanation("# is used to select elements by their id attribute.");
        q10.setQuiz(cssQuiz);
        questionRepository.save(q10);
        
        Question q11 = new Question();
        q11.setText("Which property adds space inside an element?");
        q11.setOptions(Arrays.asList("margin", "padding", "border", "spacing"));
        q11.setCorrectOptionIndex(1);
        q11.setExplanation("Padding adds space inside an element, while margin adds space outside.");
        q11.setQuiz(cssQuiz);
        questionRepository.save(q11);
        
        Question q12 = new Question();
        q12.setText("How do you make text bold?");
        q12.setOptions(Arrays.asList(
            "font-weight: bold;",
            "text-style: bold;",
            "font: bold;",
            "style: bold;"
        ));
        q12.setCorrectOptionIndex(0);
        q12.setExplanation("font-weight: bold; is used to make text bold.");
        q12.setQuiz(cssQuiz);
        questionRepository.save(q12);
    }
}