package com.pro.billinginvoicingservice.controller;

import com.pro.billinginvoicingservice.dto.BillingStatsDTO;
import com.pro.billinginvoicingservice.dto.InvoiceDTO;
import com.pro.billinginvoicingservice.dto.StatusUpdateDTO;
import com.pro.billinginvoicingservice.entity.Payment;
import com.pro.billinginvoicingservice.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<InvoiceDTO> createInvoice(@Valid @RequestBody InvoiceDTO invoiceDTO) {
        InvoiceDTO createdInvoice = invoiceService.createInvoice(invoiceDTO);
        return new ResponseEntity<>(createdInvoice, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable String id) {
        InvoiceDTO invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/number/{invoiceNumber}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<InvoiceDTO> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        InvoiceDTO invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_BILLING_CLERK','ROLE_PATIENT') or @securityService.isOwner(authentication, #patientId)")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByPatientId(@PathVariable Long patientId) {
        List<InvoiceDTO> invoices = invoiceService.getInvoicesByPatientId(patientId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK','ROLE_PATIENT') or @securityService.isOwner(authentication, #userId)")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByUserId(@PathVariable Long userId) {
        List<InvoiceDTO> invoices = invoiceService.getInvoicesByUserId(userId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/stats/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK','ROLE_PATIENT') or @securityService.isOwner(authentication, #patientId)")
    public ResponseEntity<BillingStatsDTO> getBillingStats(@PathVariable Long patientId) {
        BillingStatsDTO stats = invoiceService.getBillingStats(patientId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK','ROLE_PATIENT') or @securityService.isOwner(authentication, #userId)")
    public ResponseEntity<BillingStatsDTO> getBillingStatsByUserId(@PathVariable Long userId) {
        BillingStatsDTO stats = invoiceService.getBillingStatsByUserId(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}/download-pdf")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_BILLING_CLERK', 'ROLE_PATIENT')") // Simplified for now
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable String id) {
        // More specific security (isOwner) should be handled in the service or with a more complex expression
        byte[] pdf = invoiceService.generateInvoicePdf(id);
        
        InvoiceDTO invoice = invoiceService.getInvoiceById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + invoice.getInvoiceNumber() + ".pdf");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByDoctorId(@PathVariable Long doctorId) {
        List<InvoiceDTO> invoices = invoiceService.getInvoicesByDoctorId(doctorId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK', 'ROLE_DOCTOR','ROLE_PATIENT')")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByStatus(@PathVariable String status) {
        List<InvoiceDTO> invoices = invoiceService.getInvoicesByStatus(status);
        return ResponseEntity.ok(invoices);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<InvoiceDTO> updateInvoice(@PathVariable String id, @Valid @RequestBody InvoiceDTO invoiceDTO) {
        InvoiceDTO updatedInvoice = invoiceService.updateInvoice(id, invoiceDTO);
        return ResponseEntity.ok(updatedInvoice);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<InvoiceDTO> updateInvoiceStatus(@PathVariable String id, @Valid @RequestBody StatusUpdateDTO statusUpdate) {
        InvoiceDTO updatedInvoice = invoiceService.updateInvoiceStatus(id, statusUpdate.getStatus());
        return ResponseEntity.ok(updatedInvoice);
    }

    @PostMapping("/{id}/payments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BILLING_CLERK')")
    public ResponseEntity<InvoiceDTO> addPayment(@PathVariable String id, @Valid @RequestBody Payment payment) {
        InvoiceDTO updatedInvoice = invoiceService.addPayment(id, payment);
        return ResponseEntity.ok(updatedInvoice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteInvoice(@PathVariable String id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
} 