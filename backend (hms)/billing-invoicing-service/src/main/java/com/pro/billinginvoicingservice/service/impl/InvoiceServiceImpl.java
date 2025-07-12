package com.pro.billinginvoicingservice.service.impl;

import com.pro.billinginvoicingservice.dto.InvoiceDTO;
import com.pro.billinginvoicingservice.dto.BillingStatsDTO;
import com.pro.billinginvoicingservice.entity.Invoice;
import com.pro.billinginvoicingservice.entity.Money;
import com.pro.billinginvoicingservice.entity.Payment;
import com.pro.billinginvoicingservice.mapper.InvoiceMapper;
import com.pro.billinginvoicingservice.repository.InvoiceRepository;
import com.pro.billinginvoicingservice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceMapper.toEntity(invoiceDTO);
        
        // Set timestamps
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        invoice.setInvoiceDate(LocalDateTime.now());
        
        // Generate invoice number if not provided
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateInvoiceNumber());
        }
        
        // Set default status
        if (invoice.getStatus() == null) {
            invoice.setStatus("DRAFT");
        }
        
        // Calculate totals
        calculateInvoiceTotals(invoice);
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toDto(savedInvoice);
    }

    @Override
    public InvoiceDTO getInvoiceById(String id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        return invoiceMapper.toDto(invoice);
    }

    @Override
    public InvoiceDTO getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found with number: " + invoiceNumber));
        return invoiceMapper.toDto(invoice);
    }

    @Override
    public List<InvoiceDTO> getInvoicesByPatientId(Long patientId) {
        List<Invoice> invoices = invoiceRepository.findByPatientId(patientId);
        return invoiceMapper.toDtoList(invoices);
    }

    @Override
    public List<InvoiceDTO> getInvoicesByUserId(Long userId) {
        // Convert user ID to patient ID based on the database mapping
        // Based on the pattern: patient_id = user_id - 7
        Long patientId = userId - 7;
        return getInvoicesByPatientId(patientId);
    }

    @Override
    public List<InvoiceDTO> getInvoicesByDoctorId(Long doctorId) {
        List<Invoice> invoices = invoiceRepository.findByDoctorId(doctorId);
        return invoiceMapper.toDtoList(invoices);
    }

    @Override
    public List<InvoiceDTO> getInvoicesByStatus(String status) {
        List<Invoice> invoices = invoiceRepository.findByStatus(status);
        return invoiceMapper.toDtoList(invoices);
    }

    @Override
    public InvoiceDTO updateInvoiceStatus(String id, String status) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        
        invoice.setStatus(status);
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toDto(updatedInvoice);
    }

    @Override
    public InvoiceDTO addPayment(String invoiceId, Payment payment) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        if (invoice.getPayments() == null) {
            invoice.setPayments(new ArrayList<>());
        }
        
        payment.setPaymentDate(LocalDateTime.now());
        if (payment.getTransactionId() == null) {
            payment.setTransactionId(UUID.randomUUID().toString());
        }
        
        invoice.getPayments().add(payment);
        
        // Recalculate payment totals
        calculatePaymentTotals(invoice);
        
        // Update status based on payment
        updateStatusBasedOnPayment(invoice);
        
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toDto(updatedInvoice);
    }

    @Override
    public InvoiceDTO updateInvoice(String id, InvoiceDTO invoiceDTO) {
        Invoice existingInvoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        
        Invoice updatedInvoice = invoiceMapper.toEntity(invoiceDTO);
        updatedInvoice.setId(existingInvoice.getId());
        updatedInvoice.setCreatedAt(existingInvoice.getCreatedAt());
        updatedInvoice.setUpdatedAt(LocalDateTime.now());
        
        // Recalculate totals
        calculateInvoiceTotals(updatedInvoice);
        
        Invoice savedInvoice = invoiceRepository.save(updatedInvoice);
        return invoiceMapper.toDto(savedInvoice);
    }

    @Override
    public void deleteInvoice(String id) {
        if (!invoiceRepository.existsById(id)) {
            throw new RuntimeException("Invoice not found with id: " + id);
        }
        invoiceRepository.deleteById(id);
    }

    @Override
    public BillingStatsDTO getBillingStats(Long patientId) {
        List<Invoice> invoices = invoiceRepository.findByPatientId(patientId);

        if (invoices.isEmpty()) {
            return new BillingStatsDTO(patientId, Money.zero("USD"), Money.zero("USD"), Money.zero("USD"));
        }

        final String currency = invoices.get(0).getTotalAmount() != null ?
                                invoices.get(0).getTotalAmount().getCurrency() : "USD";

        Money totalBilled = invoices.stream()
                .map(inv -> inv.getTotalAmount() != null ? inv.getTotalAmount() : Money.zero(currency))
                .reduce(Money.zero(currency), Money::add);

        Money totalPaid = invoices.stream()
                .map(inv -> inv.getPaidAmount() != null ? inv.getPaidAmount() : Money.zero(currency))
                .reduce(Money.zero(currency), Money::add);

        Money totalOutstanding = invoices.stream()
                .map(inv -> inv.getOutstandingAmount() != null ? inv.getOutstandingAmount() : Money.zero(currency))
                .reduce(Money.zero(currency), Money::add);

        return new BillingStatsDTO(patientId, totalBilled, totalPaid, totalOutstanding);
    }

    @Override
    public BillingStatsDTO getBillingStatsByUserId(Long userId) {
        // Convert user ID to patient ID based on the database mapping
        // Based on the pattern: patient_id = user_id - 7
        Long patientId = userId - 7;
        return getBillingStats(patientId);
    }

    @Override
    public byte[] generateInvoicePdf(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Font.NORMAL);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Font.NORMAL);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL);

            // Title
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Invoice Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.addCell(createCell("Invoice Number:", headerFont, Element.ALIGN_LEFT, false));
            infoTable.addCell(createCell(invoice.getInvoiceNumber(), normalFont, Element.ALIGN_RIGHT, false));
            infoTable.addCell(createCell("Invoice Date:", headerFont, Element.ALIGN_LEFT, false));
            infoTable.addCell(createCell(invoice.getInvoiceDate().format(DateTimeFormatter.ISO_LOCAL_DATE), normalFont, Element.ALIGN_RIGHT, false));
            infoTable.addCell(createCell("Due Date:", headerFont, Element.ALIGN_LEFT, false));
            infoTable.addCell(createCell(invoice.getDueDate().format(DateTimeFormatter.ISO_LOCAL_DATE), normalFont, Element.ALIGN_RIGHT, false));
            infoTable.addCell(createCell("Patient ID:", headerFont, Element.ALIGN_LEFT, false));
            infoTable.addCell(createCell(String.valueOf(invoice.getPatientId()), normalFont, Element.ALIGN_RIGHT, false));
            document.add(infoTable);
            document.add(Chunk.NEWLINE);

            // Billing Items Table
            document.add(new Paragraph("Bill Details", headerFont));
            document.add(Chunk.NEWLINE);
            PdfPTable itemsTable = new PdfPTable(4);
            itemsTable.setWidthPercentage(100);
            itemsTable.addCell(createCell("Item Description", headerFont, Element.ALIGN_CENTER, true));
            itemsTable.addCell(createCell("Quantity", headerFont, Element.ALIGN_CENTER, true));
            itemsTable.addCell(createCell("Unit Price", headerFont, Element.ALIGN_CENTER, true));
            itemsTable.addCell(createCell("Total", headerFont, Element.ALIGN_CENTER, true));

            invoice.getBillingItems().forEach(item -> {
                itemsTable.addCell(createCell(item.getDescription(), normalFont, Element.ALIGN_LEFT, true));
                itemsTable.addCell(createCell(String.valueOf(item.getQuantity()), normalFont, Element.ALIGN_RIGHT, true));
                itemsTable.addCell(createCell(item.getUnitPrice().toString(), normalFont, Element.ALIGN_RIGHT, true));
                itemsTable.addCell(createCell(item.getTotalPrice().toString(), normalFont, Element.ALIGN_RIGHT, true));
            });
            document.add(itemsTable);
            document.add(Chunk.NEWLINE);

            // Totals
            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(50);
            totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            addTotalRow(totalsTable, "Subtotal:", invoice.getSubtotal(), headerFont, normalFont);
            addTotalRow(totalsTable, "Discount:", invoice.getDiscountAmount(), headerFont, normalFont);
            addTotalRow(totalsTable, "Tax:", invoice.getTaxAmount(), headerFont, normalFont);
            addTotalRow(totalsTable, "Total:", invoice.getTotalAmount(), headerFont, normalFont);
            addTotalRow(totalsTable, "Amount Paid:", invoice.getPaidAmount(), headerFont, normalFont);
            addTotalRow(totalsTable, "Amount Due:", invoice.getOutstandingAmount(), headerFont, normalFont);
            document.add(totalsTable);

            document.close();
            return baos.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
    
    private PdfPCell createCell(String content, Font font, int alignment, boolean border) {
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setHorizontalAlignment(alignment);
        if (!border) {
            cell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
        }
        cell.setPadding(5);
        return cell;
    }
    
    private void addTotalRow(PdfPTable table, String label, Money amount, Font headerFont, Font normalFont) {
        table.addCell(createCell(label, headerFont, Element.ALIGN_RIGHT, false));
        table.addCell(createCell(amount != null ? amount.toString() : Money.zero("USD").toString(), normalFont, Element.ALIGN_RIGHT, false));
    }

    private void calculateInvoiceTotals(Invoice invoice) {
        if (invoice.getBillingItems() == null || invoice.getBillingItems().isEmpty()) {
            return;
        }
        
        // Get currency from first billing item or default to USD
        String currency = invoice.getBillingItems().get(0).getTotalPrice() != null ? 
                         invoice.getBillingItems().get(0).getTotalPrice().getCurrency() : "USD";
        
        Money subtotal = invoice.getBillingItems().stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : Money.zero(currency))
                .reduce(Money.zero(currency), Money::add);
        
        invoice.setSubtotal(subtotal);
        
        Money taxAmount = invoice.getTaxAmount() != null ? invoice.getTaxAmount() : Money.zero(currency);
        Money discountAmount = invoice.getDiscountAmount() != null ? invoice.getDiscountAmount() : Money.zero(currency);
        
        Money totalAmount = subtotal.add(taxAmount).subtract(discountAmount);
        invoice.setTotalAmount(totalAmount);
        
        // Calculate insurance coverage
        if (invoice.getInsurance() != null && invoice.getInsurance().getCoveragePercentage() != null) {
            Money insuranceCoverage = totalAmount.multiply(invoice.getInsurance().getCoveragePercentage())
                    .multiply(new BigDecimal("0.01")); // Convert percentage to decimal
            invoice.setInsuranceCoverage(insuranceCoverage);
            
            Money copay = invoice.getInsurance().getCopayAmount() != null ? 
                    invoice.getInsurance().getCopayAmount() : Money.zero(currency);
            invoice.setPatientResponsibility(totalAmount.subtract(insuranceCoverage).add(copay));
        } else {
            invoice.setPatientResponsibility(totalAmount);
        }
        
        // Calculate outstanding amount
        calculatePaymentTotals(invoice);
    }

    private void calculatePaymentTotals(Invoice invoice) {
        String currency = invoice.getTotalAmount() != null ? invoice.getTotalAmount().getCurrency() : "USD";
        
        if (invoice.getPayments() == null || invoice.getPayments().isEmpty()) {
            invoice.setPaidAmount(Money.zero(currency));
        } else {
            Money paidAmount = invoice.getPayments().stream()
                    .filter(payment -> "COMPLETED".equals(payment.getStatus()))
                    .map(Payment::getAmount)
                    .reduce(Money.zero(currency), Money::add);
            invoice.setPaidAmount(paidAmount);
        }
        
        Money totalAmount = invoice.getTotalAmount() != null ? invoice.getTotalAmount() : Money.zero(currency);
        Money paidAmount = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : Money.zero(currency);
        invoice.setOutstandingAmount(totalAmount.subtract(paidAmount));
    }

    private void updateStatusBasedOnPayment(Invoice invoice) {
        Money outstandingAmount = invoice.getOutstandingAmount();
        
        if (outstandingAmount.isZero()) {
            invoice.setStatus("PAID");
        } else if (!invoice.getPaidAmount().isZero()) {
            invoice.setStatus("PARTIALLY_PAID");
        }
    }

    private String generateInvoiceNumber() {
        return "INV-" + LocalDateTime.now().getYear() + "-" + 
               String.format("%06d", System.currentTimeMillis() % 1000000);
    }
} 