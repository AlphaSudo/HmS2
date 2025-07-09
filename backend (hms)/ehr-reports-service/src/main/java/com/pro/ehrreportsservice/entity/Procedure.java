package com.pro.ehrreportsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Procedure {
    private String code; // e.g., CPT code
    private String description;
} 