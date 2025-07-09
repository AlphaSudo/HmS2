package com.pro.patientmanagementservice.dto;

import com.pro.patientmanagementservice.model.Medication;
import com.pro.patientmanagementservice.model.Surgery;
import lombok.Data;

import java.time.Instant;

import java.util.List;


@Data
public class MedicalHistoryDTO {
    private String id;
    private Long patientId;
    private List<String> allergies;
    private List<String> pastConditions;
    private List<Surgery> surgeries;
    private List<Medication> medications;
    private Instant createdAt;
    private Instant updatedAt;
} 