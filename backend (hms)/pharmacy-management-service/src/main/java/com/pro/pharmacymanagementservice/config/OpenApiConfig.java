package com.pro.pharmacymanagementservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pharmacy Management Service API")
                        .description("RESTful API for managing pharmacy operations including prescriptions, medications, and inventory")
                        .version("v1.0.0"));
    }
} 