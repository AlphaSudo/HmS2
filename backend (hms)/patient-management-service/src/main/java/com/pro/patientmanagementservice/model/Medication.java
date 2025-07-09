package com.pro.patientmanagementservice.model;

import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;

@Data
public class Medication {
    private String medication;
    private String dosage;
    private String frequency;
    private Instant startDate;
    private Instant endDate;
    private String notes;
} 