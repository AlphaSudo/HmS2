package com.pro.billinginvoicingservice.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("securityService")
public class SecurityService {

    /**
     * Checks if the authenticated user is the owner of the resource.
     * This method assumes the principal's name is the patient ID.
     * This might need to be adjusted based on the actual authentication principal details.
     *
     * @param authentication the authentication object
     * @param patientId the ID of the patient resource being accessed
     * @return true if the authenticated user is the owner, false otherwise
     */
    public boolean isOwner(Authentication authentication, Long patientId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        // This is a simplified check. In a real app, you'd get the user's ID
        // from the authentication principal in a more robust way.
        // For example, if using JWTs, you'd parse the token to get the patient ID claim.
        String principalName = authentication.getName();
        try {
            Long principalId = Long.parseLong(principalName);
            return principalId.equals(patientId);
        } catch (NumberFormatException e) {
            return false;
        }
    }
} 