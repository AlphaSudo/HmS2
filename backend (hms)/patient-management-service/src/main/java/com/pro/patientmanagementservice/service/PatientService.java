package com.pro.patientmanagementservice.service;

import com.pro.patientmanagementservice.dto.*;
import com.pro.patientmanagementservice.exception.MobileAlreadyExistsException;
import com.pro.patientmanagementservice.exception.ResourceNotFoundException;
import com.pro.patientmanagementservice.mapper.MedicalHistoryMapper;
import com.pro.patientmanagementservice.mapper.PatientMapper;
import com.pro.patientmanagementservice.model.MedicalHistory;
import com.pro.patientmanagementservice.model.Patient;
import com.pro.patientmanagementservice.repository.MedicalHistoryRepository;
import com.pro.patientmanagementservice.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final PatientMapper patientMapper;
    private final MedicalHistoryMapper medicalHistoryMapper;

    public PatientProfileDTO getPatientProfile(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        MedicalHistory medicalHistory = medicalHistoryRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    // Create a new medical history if it doesn't exist
                    MedicalHistory newHistory = MedicalHistory.builder()
                            .patientId(patientId)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return medicalHistoryRepository.save(newHistory);
                });

        return PatientProfileDTO.builder()
                .userId(patient.getUserId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .dateOfBirth(patient.getDateOfBirth())
                .maritalStatus(patient.getMaritalStatus())
                .gender(patient.getGender())
                .mobile(patient.getMobile())
                .doctorAssigned(patient.getDoctorAssigned())
                .doctorId(patient.getDoctorId())
                .address(patient.getAddress())
                .bloodGroup(patient.getBloodGroup())
                .treatment(patient.getTreatment())
                .admissionDate(patient.getAdmissionDate())
                .status(patient.getStatus())
                .dischargeDate(patient.getDischargeDate())
                .height(medicalHistory.getHeight())
                .weight(medicalHistory.getWeight())
                .allergies(medicalHistory.getAllergies())
                .pastConditions(medicalHistory.getPastConditions())
                .surgeries(medicalHistory.getSurgeries())
                .medications(medicalHistory.getMedications())
                .build();
    }

    @Transactional
    public PatientProfileDTO createPatient(PatientProfileDTO patientProfileDTO) {
        if (patientRepository.existsByMobile(patientProfileDTO.getMobile())) {
            throw new MobileAlreadyExistsException("Mobile number '" + patientProfileDTO.getMobile() + "' is already in use.");
        }

        // 1. Create and save Patient
        Patient patient = Patient.builder()
                .firstName(patientProfileDTO.getFirstName())
                .lastName(patientProfileDTO.getLastName())
                .email(patientProfileDTO.getEmail())
                .dateOfBirth(patientProfileDTO.getDateOfBirth())
                .maritalStatus(patientProfileDTO.getMaritalStatus())
                .gender(patientProfileDTO.getGender())
                .mobile(patientProfileDTO.getMobile())
                .doctorAssigned(patientProfileDTO.getDoctorAssigned())
                .doctorId(patientProfileDTO.getDoctorId())
                .address(patientProfileDTO.getAddress())
                .bloodGroup(patientProfileDTO.getBloodGroup())
                .treatment(patientProfileDTO.getTreatment())
                .admissionDate(patientProfileDTO.getAdmissionDate())
                .status(patientProfileDTO.getStatus())
                .dischargeDate(patientProfileDTO.getDischargeDate())
                .userId(patientProfileDTO.getUserId())
                .build();
        Patient savedPatient = patientRepository.save(patient);

        // 2. Create and save MedicalHistory
        MedicalHistory medicalHistory = MedicalHistory.builder()
                .patientId(savedPatient.getId())
                .height(patientProfileDTO.getHeight())
                .weight(patientProfileDTO.getWeight())
                .allergies(patientProfileDTO.getAllergies())
                .pastConditions(patientProfileDTO.getPastConditions())
                .surgeries(patientProfileDTO.getSurgeries())
                .medications(patientProfileDTO.getMedications())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        medicalHistoryRepository.save(medicalHistory);

        return patientProfileDTO;
    }

    public List<PatientProfileDTO> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(patient -> getPatientProfile(patient.getId()))
                .collect(Collectors.toList());
    }

    public PatientProfileDTO getPatientById(Long patientId) {
        return getPatientProfile(patientId);
    }

    public PatientProfileDTO getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with user id: " + userId));
        return getPatientProfile(patient.getId());
    }

    public PatientDetailsDTO getPatientDetailsById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        MedicalHistory medicalHistory = medicalHistoryRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    // Create a new medical history if it doesn't exist
                    MedicalHistory newHistory = MedicalHistory.builder()
                            .patientId(patientId)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return medicalHistoryRepository.save(newHistory);
                });

        return new PatientDetailsDTO(
                patientMapper.toPatientDTO(patient),
                medicalHistoryMapper.toMedicalHistoryDTO(medicalHistory)
        );
    }

    public List<PatientProfileDTO> getPatientsByStatus(String status) {
        return patientRepository.findByStatus(status).stream()
                .map(patient -> getPatientProfile(patient.getId()))
                .collect(Collectors.toList());
    }

    public List<PatientProfileDTO> getPatientsByDoctor(Long doctorId) {
        return patientRepository.findByDoctorId(doctorId).stream()
                .map(patient -> getPatientProfile(patient.getId()))
                .collect(Collectors.toList());
    }

    public List<PatientDTO> getPatientsByBloodGroup(String bloodGroup) {
        return patientRepository.findByBloodGroup(bloodGroup).stream()
                .map(patientMapper::toPatientDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PatientDTO updatePatient(Long patientId, UpdatePatientDTO updatePatientDTO) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        if (updatePatientDTO.getMobile() != null && 
            !updatePatientDTO.getMobile().equals(patient.getMobile()) &&
            patientRepository.existsByMobile(updatePatientDTO.getMobile())) {
            throw new MobileAlreadyExistsException("Mobile number '" + updatePatientDTO.getMobile() + "' is already in use.");
        }

        patientMapper.updatePatientFromDto(updatePatientDTO, patient);
        Patient updatedPatient = patientRepository.save(patient);
        return patientMapper.toPatientDTO(updatedPatient);
    }

    @Transactional
    public PatientProfileDTO updatePatientProfile(Long patientId, PatientProfileDTO patientProfileDTO) {
        // 1. Find and update Patient
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        if (patientProfileDTO.getMobile() != null &&
                !patientProfileDTO.getMobile().equals(patient.getMobile()) &&
                patientRepository.existsByMobile(patientProfileDTO.getMobile())) {
            throw new MobileAlreadyExistsException("Mobile number '" + patientProfileDTO.getMobile() + "' is already in use.");
        }

        patient.setFirstName(patientProfileDTO.getFirstName());
        patient.setLastName(patientProfileDTO.getLastName());
        patient.setEmail(patientProfileDTO.getEmail());
        patient.setDateOfBirth(patientProfileDTO.getDateOfBirth());
        patient.setMaritalStatus(patientProfileDTO.getMaritalStatus());
        patient.setGender(patientProfileDTO.getGender());
        patient.setMobile(patientProfileDTO.getMobile());
        patient.setDoctorAssigned(patientProfileDTO.getDoctorAssigned());
        patient.setDoctorId(patientProfileDTO.getDoctorId());
        patient.setAddress(patientProfileDTO.getAddress());
        patient.setBloodGroup(patientProfileDTO.getBloodGroup());
        patient.setTreatment(patientProfileDTO.getTreatment());
        patient.setAdmissionDate(patientProfileDTO.getAdmissionDate());
        patient.setStatus(patientProfileDTO.getStatus());
        patient.setDischargeDate(patientProfileDTO.getDischargeDate());
        patientRepository.save(patient);

        // 2. Find and update MedicalHistory
        MedicalHistory medicalHistory = medicalHistoryRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical history not found for patient id: " + patientId));

        medicalHistory.setHeight(patientProfileDTO.getHeight());
        medicalHistory.setWeight(patientProfileDTO.getWeight());
        medicalHistory.setAllergies(patientProfileDTO.getAllergies());
        medicalHistory.setPastConditions(patientProfileDTO.getPastConditions());
        medicalHistory.setSurgeries(patientProfileDTO.getSurgeries());
        medicalHistory.setMedications(patientProfileDTO.getMedications());
        medicalHistory.setUpdatedAt(Instant.now());
        medicalHistoryRepository.save(medicalHistory);

        return patientProfileDTO;
    }

    @Transactional
    public PatientProfileDTO deletePatient(Long patientId) {
        PatientProfileDTO patientProfile = getPatientProfile(patientId);

        medicalHistoryRepository.findByPatientId(patientId).ifPresent(medicalHistoryRepository::delete);
        patientRepository.deleteById(patientId);

        return patientProfile;
    }

    @Transactional
    public PatientProfileDTO updatePatientProfileByUserId(Long userId, PatientProfileDTO patientProfileDTO) {
        // Find patient by userId first
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with user id: " + userId));
        
        // Use the existing updatePatientProfile method with the table primary key
        return updatePatientProfile(patient.getId(), patientProfileDTO);
    }

    @Transactional
    public PatientProfileDTO deletePatientByUserId(Long userId) {
        // Find patient by userId first
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with user id: " + userId));
        
        // Use the existing deletePatient method with the table primary key
        return deletePatient(patient.getId());
    }

    public MedicalHistoryDTO getMedicalHistory(Long patientId) {
        // First verify patient exists
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }

        MedicalHistory medicalHistory = medicalHistoryRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    // Create a new medical history if it doesn't exist
                    MedicalHistory newHistory = MedicalHistory.builder()
                            .patientId(patientId)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return medicalHistoryRepository.save(newHistory);
                });

        return medicalHistoryMapper.toMedicalHistoryDTO(medicalHistory);
    }
} 