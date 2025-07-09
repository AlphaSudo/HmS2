package com.pro.authenticationservice.service;



import com.pro.authenticationservice.dto.LoginRequest;
import com.pro.authenticationservice.dto.RegisterRequest;
import com.pro.authenticationservice.exception.UsernameAlreadyExistsException;
import com.pro.authenticationservice.model.JwtResponse;
import com.pro.authenticationservice.model.Role;
import com.pro.authenticationservice.model.TokenValidationResponse;
import com.pro.authenticationservice.model.User;
import com.pro.authenticationservice.repository.UserRepository;
import com.pro.authenticationservice.security.JwtUtils;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.pro.authenticationservice.dto.PatientCreationRequest;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {


    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final WebClient.Builder webClientBuilder;

    public AuthService(UserRepository userRepo,
                       PasswordEncoder encoder,
                       AuthenticationManager authManager,
                       JwtUtils jwtUtils,
                       WebClient.Builder webClientBuilder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtUtils = jwtUtils;
        this.webClientBuilder = webClientBuilder;
    }

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            throw new UsernameAlreadyExistsException(req.getUsername());
        }
        var user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRoles(Set.of(Role.ROLE_PATIENT));
        user.setEmail(req.getEmail());
        User savedUser = userRepo.save(user);

        // After saving the user, create the patient record
        createPatientRecord(savedUser);
    }

    private void createPatientRecord(User user) {
        PatientCreationRequest patientRequest = PatientCreationRequest.builder()
                .userId(user.getId())
                .firstName(user.getUsername()) // Using username as first name by default
                .lastName("") // Last name is empty by default
                .email(user.getEmail())
                .mobile("000-000-0000") // Default mobile
                .gender("Not Specified")
                .address("Not Specified")
                .treatment("Initial Consultation")
                .doctorAssigned("Unassigned")
                .bloodGroup("Unknown")
                .status("Admitted")
                .admissionDate(LocalDate.now())
                .build();

        webClientBuilder.build().post()
                .uri("http://patient-service/patients") // Using service discovery
                .body(Mono.just(patientRequest), PatientCreationRequest.class)
                .retrieve()
                .bodyToMono(Void.class)
                .doOnError(error -> {
                    // Log the error, maybe publish an event for retry, etc.
                    System.err.println("Failed to create patient record for user " + user.getId() + ": " + error.getMessage());
                })
                .subscribe(); // Fire-and-forget
    }


    public JwtResponse login(LoginRequest req) {
        System.out.println("Login attempt for user: " + req.getUsername());
        try {
            var authToken = new UsernamePasswordAuthenticationToken(
                    req.getUsername(), req.getPassword());
            System.out.println("Created authentication token");
            var auth = authManager.authenticate(authToken);
            System.out.println("Authentication successful");

            var userDetails = (org.springframework.security.core.userdetails.User)
                    auth.getPrincipal();
            System.out.println("User details retrieved: " + userDetails.getUsername());

            // Check if the user has the requested role
            String requestedRole = "ROLE_" + req.getRole().toUpperCase();
            boolean hasRole = userDetails.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(requestedRole));

            if (!hasRole) {
                throw new AccessDeniedException("User does not have the required role: " + req.getRole());
            }

            // Get the full user entity to access the ID
            User user = userRepo.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            System.out.println("User entity retrieved: " + user.getUsername() + " with ID: " + user.getId());

            List<String> roles = userDetails.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            System.out.println("User roles: " + roles);

            String token = jwtUtils.generateToken(userDetails.getUsername(), user.getId(), roles);
            System.out.println("JWT token generated with userId");

            // JwtResponse(String token, String type, Long id, String username, List<String> roles)
            return new JwtResponse(token, "Bearer", user.getId(), userDetails.getUsername(), roles);
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    public TokenValidationResponse validateToken(String token) {
        boolean valid = jwtUtils.validateToken(token);

        List<String> roles = valid
                ? jwtUtils.getRoles(token)
                : Collections.emptyList();

        return new TokenValidationResponse(valid, roles);
    }

    public String getUsernameFromToken(String token) {
        return jwtUtils.getUsername(token);
    }

    public Long getUserIdFromToken(String token) {
        return jwtUtils.getUserId(token);
    }

}
