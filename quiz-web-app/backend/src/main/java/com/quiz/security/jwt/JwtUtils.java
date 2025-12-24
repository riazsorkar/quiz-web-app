// backend/src/main/java/com/quiz/security/jwt/JwtUtils.java
package com.quiz.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;


import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

// Alternative: Use HS256 algorithm (requires only 32 characters)
@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${quiz.app.jwtSecret}")
    private String jwtSecret;

    @Value("${quiz.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private SecretKey getSigningKey() {
        // For HS256, we need at least 256 bits (32 characters)
        // If secret is shorter, we'll pad it
        String secret = jwtSecret;
        if (secret.length() < 32) {
            logger.warn("JWT secret is short. For production, use at least 32 characters.");
            // Pad with default characters to reach minimum length
            while (secret.length() < 32) {
                secret += "0";
            }
        }
        
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Changed to HS256
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (JwtException e) {
            logger.error("JWT validation error: {}", e.getMessage());
        }
        return false;
    }
}