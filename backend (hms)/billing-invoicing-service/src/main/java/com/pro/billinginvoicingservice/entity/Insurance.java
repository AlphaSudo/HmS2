package com.pro.billinginvoicingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insurance {
    private String insuranceCompany;
    private String policyNumber;
    private BigDecimal coveragePercentage; // Keep as percentage (0-100)
    private Money copayAmount;
    private Money deductible;
    private Money maxCoverage;
} 