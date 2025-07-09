package com.pro.authenticationservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {
    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtUtils(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:3600000}") long expirationMs
    ) {
        System.out.println("Initializing JwtUtils with secret length: " + (secret != null ? secret.length() : 0));
        System.out.println("Expiration time: " + expirationMs + " ms");
        try {
            // Decode the Base64-encoded secret to get the actual key bytes
            byte[] keyBytes = java.util.Base64.getDecoder().decode(secret);
            System.out.println("Secret string length: " + secret.length());
            System.out.println("Decoded key bytes length: " + keyBytes.length);
            System.out.println("First 8 bytes of key: " + java.util.Arrays.toString(java.util.Arrays.copyOf(keyBytes, Math.min(8, keyBytes.length))));
            this.signingKey = Keys.hmacShaKeyFor(keyBytes);
            System.out.println("Signing key created successfully");
        } catch (Exception e) {
            System.out.println("Error creating signing key: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username, Collection<String> roles) {
        System.out.println("Generating token for user: " + username);
        System.out.println("Roles: " + roles);
        try {
            Date now = new Date();
            Date exp = new Date(now.getTime() + expirationMs);
            System.out.println("Token expiration: " + exp);

            String token = Jwts.builder()
                    .subject(username)
                    .claim("roles", roles)
                    .issuedAt(now)
                    .expiration(exp)
                    .signWith(signingKey, Jwts.SIG.HS256)
                    .compact();
            System.out.println("Token generated successfully");
            return token;
        } catch (Exception e) {
            System.out.println("Error generating token: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String generateToken(String username, Long userId, Collection<String> roles) {
        System.out.println("Generating token for user: " + username + " with ID: " + userId);
        System.out.println("Roles: " + roles);
        try {
            Date now = new Date();
            Date exp = new Date(now.getTime() + expirationMs);
            System.out.println("Token expiration: " + exp);

            String token = Jwts.builder()
                    .subject(username)
                    .claim("userId", userId)
                    .claim("roles", roles)
                    .issuedAt(now)
                    .expiration(exp)
                    .signWith(signingKey, Jwts.SIG.HS256)
                    .compact();
            System.out.println("Token generated successfully with userId");
            return token;
        } catch (Exception e) {
            System.out.println("Error generating token: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public boolean validateToken(String token) {
        System.out.println("Validating token");
        if (token == null) {
            System.out.println("Token is null");
            return false;
        }
        try {
            parseClaims(token);
            System.out.println("Token is valid");
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            System.out.println("Token validation failed: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    public Jws<Claims> parseClaims(String token) {
        System.out.println("Parsing claims from token");
        try {
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token);
            System.out.println("Claims parsed successfully");
            System.out.println("Subject: " + claims.getPayload().getSubject());
            System.out.println("User ID: " + claims.getPayload().get("userId"));
            System.out.println("Roles: " + claims.getPayload().get("roles"));
            return claims;
        } catch (Exception e) {
            System.out.println("Error parsing claims: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String getUsername(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    public Long getUserId(String token) {
        Object userIdClaim = parseClaims(token).getPayload().get("userId");
        if (userIdClaim instanceof Number) {
            return ((Number) userIdClaim).longValue();
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        return (List<String>) parseClaims(token).getPayload().get("roles");
    }
}
