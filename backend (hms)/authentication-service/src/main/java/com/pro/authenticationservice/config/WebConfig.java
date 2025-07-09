package com.pro.authenticationservice.config;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS is disabled here because API Gateway handles CORS for all microservices
    // If you need CORS for direct access to this service (not through gateway),
    // uncomment the below configuration
    
    /*
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);
    }
    */
}