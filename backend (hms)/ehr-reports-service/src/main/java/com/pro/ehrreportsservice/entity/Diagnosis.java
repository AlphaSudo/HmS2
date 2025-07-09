package com.pro.ehrreportsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diagnosis {
    private String code; // e.g., ICD-10 code
    private String description;
    private boolean isPrimary;
} 