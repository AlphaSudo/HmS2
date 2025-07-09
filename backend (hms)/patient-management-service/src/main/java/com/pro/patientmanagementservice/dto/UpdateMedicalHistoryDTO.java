package com.pro.patientmanagementservice.dto;

import com.pro.patientmanagementservice.model.Medication;
import com.pro.patientmanagementservice.model.Surgery;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;


@Data
public class UpdateMedicalHistoryDTO {
    private Double height;
    private Double weight;
    private List<String> allergies;
    private List<String> pastConditions;
    private List<Surgery> surgeries;
    private List<Medication> medications;
} 