package com.pro.patientmanagementservice.dto;

import com.pro.patientmanagementservice.model.Medication;
import com.pro.patientmanagementservice.model.Surgery;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfileDTO {
    // From Patient
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String maritalStatus;
    private String gender;
    private String mobile;
    private String doctorAssigned;
    private Long doctorId;
    private String address;
    private String bloodGroup;

    private String treatment;
    private LocalDate admissionDate;
    private String status;
    private LocalDate dischargeDate;

    // From MedicalHistory
    private Double height;
    private Double weight;
    private List<String> allergies;
    private List<String> pastConditions;
    private List<Surgery> surgeries;
    private List<Medication> medications;
} 
   