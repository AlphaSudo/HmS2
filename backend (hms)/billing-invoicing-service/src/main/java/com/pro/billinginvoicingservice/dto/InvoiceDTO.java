package com.pro.billinginvoicingservice.dto;

import com.pro.billinginvoicingservice.entity.BillingItem;
import com.pro.billinginvoicingservice.entity.Insurance;
import com.pro.billinginvoicingservice.entity.Money;
import com.pro.billinginvoicingservice.entity.Payment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {
    private String id;
    
    @NotNull(message = "Patient ID cannot be null")
    private Long patientId;
    
    @NotNull(message = "Doctor ID cannot be null")
    private Long doctorId;
    
    private Long appointmentId;
    
    @NotBlank(message = "Invoice number cannot be blank")
    private String invoiceNumber;
    
    private LocalDateTime invoiceDate;
    private LocalDateTime dueDate;

    @NotNull(message = "Billing items cannot be null")
    private List<BillingItem> billingItems;
    
    private Money subtotal;
    private Money taxAmount;
    private Money discountAmount;
    private Money totalAmount;

    private Insurance insurance;
    private Money insuranceCoverage;
    private Money patientResponsibility;

    private List<Payment> payments;
    private Money paidAmount;
    private Money outstandingAmount;

    private String status;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 