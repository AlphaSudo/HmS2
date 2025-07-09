package com.pro.patientmanagementservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetailsDTO {
    private PatientDTO patient;
    private MedicalHistoryDTO medicalHistory;
} 