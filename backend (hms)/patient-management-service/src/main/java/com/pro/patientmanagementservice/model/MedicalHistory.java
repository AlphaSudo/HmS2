package com.pro.patientmanagementservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

import java.util.List;

@Document(collection = "medicalHistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistory {

    @Id
    private String id;

    @Indexed(unique = true, sparse = true)
    @Field("patient_id")
    private Long patientId; // Links to the Patient entity in PostgreSQL

    private Double height;

    private Double weight;

    private List<String> allergies;

    @Field("past_conditions")
    private List<String> pastConditions;

    private List<Surgery> surgeries; // Changed from List<Map<String, Object>>

    private List<Medication> medications; // Changed from List<Map<String, Object>>

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
} 