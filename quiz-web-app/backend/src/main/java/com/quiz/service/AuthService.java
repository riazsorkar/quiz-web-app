// backend/src/main/java/com/quiz/service/AuthService.java
package com.quiz.service;

import com.quiz.dto.LoginRequest;
import com.quiz.dto.RegisterRequest;
import com.quiz.entity.Role;
import com.quiz.entity.User;
import com.quiz.repository.RoleRepository;
import com.quiz.repository.UserRepository;
import com.quiz.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create new user's account
        User user = new User(
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword())
        );
        
        // Generate avatar color
        String[] colors = {"#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"};
        String avatarColor = colors[(int) (Math.random() * colors.length)];
        user.setAvatarColor(avatarColor);
        
        Set<Role> roles = new HashSet<>();
        Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Student role not found"));
        roles.add(studentRole);
        
        user.setRoles(roles);
        userRepository.save(user);
    }
    
    public Authentication authenticateUser(LoginRequest loginRequest) {
        try {
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), 
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }
    
    public List<String> getUserRoles(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }
    
    public UserDetailsImpl getUserDetails(Authentication authentication) {
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}