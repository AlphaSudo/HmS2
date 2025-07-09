package com.pro.billinginvoicingservice.repository;

import com.pro.billinginvoicingservice.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {

    List<Invoice> findByPatientId(Long patientId);

    List<Invoice> findByDoctorId(Long doctorId);

    List<Invoice> findByStatus(String status);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByPatientIdAndStatus(Long patientId, String status);
} 