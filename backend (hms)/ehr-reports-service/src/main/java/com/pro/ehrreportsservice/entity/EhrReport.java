package com.pro.ehrreportsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "ehr_reports")
public class EhrReport {

    @Id
    private String id;

    private Long patientId;
    private Long doctorId;
    private Long appointmentId;

    private LocalDateTime reportDate;
    private String reportType;
    private String clinicalSummary;

    private List<Diagnosis> diagnoses;
    private List<Medication> medications;
    private List<Procedure> procedures;
    private Vitals vitals;
} 