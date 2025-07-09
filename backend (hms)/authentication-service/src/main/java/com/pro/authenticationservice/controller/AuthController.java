package com.pro.authenticationservice.controller;

import com.pro.authenticationservice.dto.LoginRequest;
import com.pro.authenticationservice.dto.RegisterRequest;
import com.pro.authenticationservice.model.JwtResponse;
import com.pro.authenticationservice.model.TokenValidationResponse;
import com.pro.authenticationservice.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authSvc;

    public AuthController(AuthService authSvc) {
        this.authSvc = authSvc;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @NotNull @Valid @RequestBody RegisterRequest req) {

            authSvc.register(req);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("User registered");


    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @NotNull @Valid @RequestBody LoginRequest req) {
            System.out.println("AuthController: Login request received for user: " + req.getUsername());
            if (req.getRole() == null || req.getRole().isEmpty()) {
                System.out.println("AuthController: No role provided, denying login.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            try {
                JwtResponse resp = authSvc.login(req);
                System.out.println("AuthController: Login successful for user: " + resp.getUsername());
                System.out.println("AuthController: Token generated: " + (resp.getToken() != null ? "yes" : "no"));
                System.out.println("AuthController: User roles: " + resp.getRoles());
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(resp);
            } catch (Exception e) {
                System.out.println("AuthController: Login failed: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }
    }

    @PostMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validate(
            @RequestBody Map<String, String> request) {

        String token = request.get("token");
        TokenValidationResponse resp = authSvc.validateToken(token);
        if (!resp.isValid()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo(
            @RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            TokenValidationResponse validation = authSvc.validateToken(token);
            if (!validation.isValid()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            String username = authSvc.getUsernameFromToken(token);
            Long userId = authSvc.getUserIdFromToken(token);
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", userId != null ? userId : username); // fallback to username if no userId
            userInfo.put("username", username);
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
