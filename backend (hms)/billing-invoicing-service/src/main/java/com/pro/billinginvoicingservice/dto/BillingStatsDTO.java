package com.pro.billinginvoicingservice.dto;

import com.pro.billinginvoicingservice.entity.Money;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingStatsDTO {
    private Long patientId;
    private Money totalBilled;
    private Money totalPaid;
    private Money totalOutstanding;
} 