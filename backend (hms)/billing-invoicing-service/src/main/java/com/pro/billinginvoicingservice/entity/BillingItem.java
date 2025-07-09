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
public class BillingItem {
    private String itemCode; // Service/procedure code
    private String description;
    private Integer quantity;
    private Money unitPrice;
    private Money totalPrice;
    private String category; // e.g., CONSULTATION, PROCEDURE, MEDICATION, LAB_TEST
} 