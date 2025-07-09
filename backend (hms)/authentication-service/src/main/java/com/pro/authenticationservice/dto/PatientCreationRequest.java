package com.pro.authenticationservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PatientCreationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String gender;
    private String address;
    private String treatment;
    private String doctorAssigned;
    private String bloodGroup;
    private String status;
    private LocalDate admissionDate;
    private Long userId;
} 