package com.pro.pharmacymanagementservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePrescriptionRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Patient name is required")
    @Size(min = 2, max = 100, message = "Patient name must be between 2 and 100 characters")
    private String patientName;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotBlank(message = "Doctor name is required")
    @Size(min = 2, max = 100, message = "Doctor name must be between 2 and 100 characters")
    private String doctorName;

    @NotNull(message = "Prescribed date is required")
    private LocalDate prescribedDate;

    @Size(max = 1000, message = "Notes must be at most 1000 characters")
    private String notes;

    private String status;

    private BigDecimal totalAmount;

    private LocalDate dispensedDate;
} 