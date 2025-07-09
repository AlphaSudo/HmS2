package com.pro.ehrreportsservice.dto;

import com.pro.ehrreportsservice.entity.Diagnosis;
import com.pro.ehrreportsservice.entity.Medication;
import com.pro.ehrreportsservice.entity.Procedure;
import com.pro.ehrreportsservice.entity.Vitals;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EhrReportDTO {
    private String id;
    
    @NotNull(message = "Patient ID cannot be null")
    private Long patientId;
    
    @NotNull(message = "Doctor ID cannot be null")
    private Long doctorId;
    
    private Long appointmentId;
    private LocalDateTime reportDate;
    
    @NotBlank(message = "Report type cannot be blank")
    private String reportType;
    
    @NotBlank(message = "Clinical summary cannot be blank")
    private String clinicalSummary;
    
    private List<Diagnosis> diagnoses;
    private List<Medication> medications;
    private List<Procedure> procedures;
    private Vitals vitals;
} 