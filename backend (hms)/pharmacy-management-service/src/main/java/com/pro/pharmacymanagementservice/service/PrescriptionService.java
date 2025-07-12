package com.pro.pharmacymanagementservice.service;

import com.pro.pharmacymanagementservice.dto.CreatePrescriptionRequest;
import com.pro.pharmacymanagementservice.dto.PrescriptionDto;

import java.util.List;

public interface PrescriptionService {

    List<PrescriptionDto> getAllPrescriptions();

    List<PrescriptionDto> getPrescriptionsByPatientId(Long patientId);

    List<PrescriptionDto> getPrescriptionsByDoctorId(Long doctorId);

    PrescriptionDto createPrescription(CreatePrescriptionRequest request);

    PrescriptionDto updatePrescription(Long id, CreatePrescriptionRequest request);

    void deletePrescription(Long id);
} 