package com.pro.billinginvoicingservice.service;

import com.pro.billinginvoicingservice.dto.InvoiceDTO;
import com.pro.billinginvoicingservice.dto.BillingStatsDTO;
import com.pro.billinginvoicingservice.entity.Payment;

import java.util.List;

public interface InvoiceService {
    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);
    InvoiceDTO getInvoiceById(String id);
    InvoiceDTO getInvoiceByNumber(String invoiceNumber);
    List<InvoiceDTO> getInvoicesByPatientId(Long patientId);
    List<InvoiceDTO> getInvoicesByDoctorId(Long doctorId);
    List<InvoiceDTO> getInvoicesByStatus(String status);
    InvoiceDTO updateInvoice(String id, InvoiceDTO invoiceDTO);
    InvoiceDTO updateInvoiceStatus(String id, String status);
    InvoiceDTO addPayment(String invoiceId, Payment payment);
    void deleteInvoice(String id);
    BillingStatsDTO getBillingStats(Long patientId);
    byte[] generateInvoicePdf(String invoiceId);
} 