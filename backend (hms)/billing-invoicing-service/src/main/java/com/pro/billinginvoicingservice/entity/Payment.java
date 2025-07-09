package com.pro.billinginvoicingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    private String paymentId;
    private Money amount;
    private String paymentMethod; // CASH, CREDIT_CARD, DEBIT_CARD, INSURANCE, BANK_TRANSFER
    private String transactionId;
    private LocalDateTime paymentDate;
    private String status; // PENDING, COMPLETED, FAILED, REFUNDED
} 