// backend/src/main/java/com/quiz/controller/AuthController.java
package com.quiz.controller;

import com.quiz.dto.JwtResponse;
import com.quiz.dto.LoginRequest;
import com.quiz.dto.RegisterRequest;
import com.quiz.entity.Role;
import com.quiz.entity.User;
import com.quiz.repository.RoleRepository;
import com.quiz.repository.UserRepository;
import com.quiz.security.jwt.JwtUtils;
import com.quiz.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    PasswordEncoder passwordEncoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if email exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            response.put("success", false);
            response.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Create new user
            User user = new User(
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword())
            );
            
            // Set avatar color
            String[] colors = {"#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"};
            String avatarColor = colors[(int) (ThreadLocalRandom.current().nextDouble() * colors.length)];
            user.setAvatarColor(avatarColor);
            
            // Assign default role
            Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Student role not found"));
            user.getRoles().add(studentRole);
            
            // Save user
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            // Get user details
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
            
            // Get user from database for additional info
            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create JWT response
            JwtResponse jwtResponse = new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                roles,
                user.getScore() != null ? user.getScore() : 0
            );
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", jwtResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (BadCredentialsException e) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Add a simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Auth API is working");
        return ResponseEntity.ok(response);
    }
}