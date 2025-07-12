package com.pro.pharmacymanagementservice.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret:defaultSecretKey}")
    private String jwtSecret;

    /**
     * Extract username from JWT token
     */
    public String getUsernameFromAuthentication(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            return jwt.getClaimAsString("sub");
        }
        return null;
    }

    /**
     * Extract user ID from JWT token
     */
    public Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            Object userIdClaim = jwt.getClaim("userId");
            if (userIdClaim instanceof Number) {
                return ((Number) userIdClaim).longValue();
            }
        }
        return null;
    }

    /**
     * Extract user roles from JWT token
     */
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromAuthentication(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            return jwt.getClaimAsStringList("roles");
        }
        return List.of();
    }

    /**
     * Check if user has specific role
     */
    public boolean hasRole(Authentication authentication, String role) {
        List<String> roles = getRolesFromAuthentication(authentication);
        return roles.contains(role) || roles.contains("ROLE_" + role);
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin(Authentication authentication) {
        return hasRole(authentication, "ADMIN");
    }

    // Add more role-specific methods here if needed, e.g., isDoctor, isPatient

    /**
     * Get SecretKey for JWT operations
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
} 