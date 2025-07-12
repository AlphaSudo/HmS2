package com.pro.pharmacymanagementservice.service.impl;

import com.pro.pharmacymanagementservice.dto.CreatePrescriptionRequest;
import com.pro.pharmacymanagementservice.dto.PrescriptionDto;
import com.pro.pharmacymanagementservice.mapper.PrescriptionMapper;
import com.pro.pharmacymanagementservice.model.Prescription;
import com.pro.pharmacymanagementservice.repository.PrescriptionRepository;
import com.pro.pharmacymanagementservice.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMapper prescriptionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDto> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        return prescriptionMapper.toDtoList(prescriptions);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDto> getPrescriptionsByPatientId(Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
        return prescriptionMapper.toDtoList(prescriptions);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDto> getPrescriptionsByDoctorId(Long doctorId) {
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);
        return prescriptionMapper.toDtoList(prescriptions);
    }

    @Override
    public PrescriptionDto createPrescription(CreatePrescriptionRequest request) {
        log.info("Creating new prescription for patient: {}", request.getPatientName());
        
        Prescription prescription = prescriptionMapper.toEntity(request);
        prescription.setPrescriptionNumber(generatePrescriptionNumber());
        
        if (prescription.getStatus() == null) {
            prescription.setStatus("PENDING");
        }
        
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        
        return prescriptionMapper.toDto(savedPrescription);
    }

    @Override
    public PrescriptionDto updatePrescription(Long id, CreatePrescriptionRequest request) {
        log.info("Updating prescription with ID: {}", id);
        
        Prescription existingPrescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
        
        // Update prescription fields
        existingPrescription.setPatientName(request.getPatientName());
        existingPrescription.setDoctorName(request.getDoctorName());
        existingPrescription.setPatientId(request.getPatientId());
        existingPrescription.setDoctorId(request.getDoctorId());
        existingPrescription.setPrescribedDate(request.getPrescribedDate());
        existingPrescription.setNotes(request.getNotes());
        existingPrescription.setStatus(request.getStatus());
        existingPrescription.setTotalAmount(request.getTotalAmount());
        existingPrescription.setDispensedDate(request.getDispensedDate());
        
        Prescription savedPrescription = prescriptionRepository.save(existingPrescription);
        
        return prescriptionMapper.toDto(savedPrescription);
    }

    @Override
    public void deletePrescription(Long id) {
        log.info("Deleting prescription with ID: {}", id);
        
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription not found with ID: " + id);
        }
        
        prescriptionRepository.deleteById(id);
    }

    private String generatePrescriptionNumber() {
        return "RX-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
} 