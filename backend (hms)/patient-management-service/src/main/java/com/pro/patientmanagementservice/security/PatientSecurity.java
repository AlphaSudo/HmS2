package com.pro.patientmanagementservice.security;

import com.pro.patientmanagementservice.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component("patientSecurity")
@RequiredArgsConstructor
public class PatientSecurity {

    private final PatientService patientService;

    public boolean isOwnerByUserId(Authentication authentication, Long userId) {
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            Object userIdClaim = jwt.getClaim("userId");

            if (userIdClaim instanceof Number) {
                Long tokenUserId = ((Number) userIdClaim).longValue();
                return tokenUserId.equals(userId);
            }
        }
        return false;
    }

    public boolean isOwner(Authentication authentication, Long patientId) {
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            
            // Get the user ID from the JWT token
            Object userIdClaim = jwt.getClaim("userId");
            if (userIdClaim instanceof Number) {
                Long userId = ((Number) userIdClaim).longValue();
                
                @SuppressWarnings("unchecked")
                java.util.List<String> roles = jwt.getClaimAsStringList("roles");
                if (roles != null && (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_DOCTOR"))) {
                    return true;
                }
                
                // Add logic for patients to check ownership
                if (roles != null && roles.contains("ROLE_PATIENT")) {
                    return userId != null && userId.equals(patientId);
                }
            }
        }
        return false; // Default to secure - deny access if unable to determine ownership
    }
} 