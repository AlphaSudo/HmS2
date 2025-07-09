package com.pro.patientmanagementservice.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdatePatientDTO {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String maritalStatus;
    private String treatment;
    private String gender;
    @Pattern(regexp = "\\\\d{3}-\\\\d{3}-\\\\d{4}", message = "Invalid phone number format. Expected format: ddd-ddd-dddd")
    private String mobile;
    private LocalDate admissionDate;
    private String doctorAssigned;
    private String address;
    private String bloodGroup;
    private LocalDate dischargeDate;
    private String status;
} 