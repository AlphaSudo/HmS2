package com.pro.billinginvoicingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "invoices")
public class Invoice {

    @Id
    private String id;

    private Long patientId;
    private Long doctorId;
    private Long appointmentId;

    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private LocalDateTime dueDate;

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

    private String status; // DRAFT, SENT, PAID, OVERDUE, CANCELLED
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 