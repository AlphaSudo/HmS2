package com.pro.ehrreportsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medication {
    private String name;
    private String dosage;
    private String frequency;
    private String route; // e.g., Oral, IV
} 