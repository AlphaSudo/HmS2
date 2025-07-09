package com.pro.apigatewayservice.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges ->
                        exchanges
                                .anyExchange().permitAll()  // Allow all requests to pass through to individual services
                );
                // Removed OAuth2 resource server configuration - let individual services handle authentication

        return http.build();
    }

    // Optional: Keep the JWT decoder bean in case it's needed for future use
    // @Bean
    // public ReactiveJwtDecoder jwtDecoder() {
    //     byte[] keyBytes = jwtSecret.getBytes();
    //     SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
    //     return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    // }
}