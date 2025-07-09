package com.pro.patientmanagementservice.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String maritalStatus;
    private String treatment;
    private String gender;
    private String mobile;
    private LocalDate admissionDate;
    private String doctorAssigned;
    private String address;
    private String bloodGroup;
    private LocalDate dischargeDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 