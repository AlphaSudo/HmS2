package com.pro.ehrreportsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vitals {
    private Double heightCm;
    private Double weightKg;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double temperatureCelsius;
    private Integer heartRate;
    private Integer respiratoryRate;
} 