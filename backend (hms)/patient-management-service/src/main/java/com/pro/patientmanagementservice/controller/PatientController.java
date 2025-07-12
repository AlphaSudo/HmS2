package com.pro.patientmanagementservice.controller;

import com.pro.patientmanagementservice.dto.*;
import com.pro.patientmanagementservice.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")  // Add a PATIENT role
    public ResponseEntity<PatientProfileDTO> createPatient(@Valid @RequestBody PatientProfileDTO patientProfileDTO) {
        try {
            PatientProfileDTO createdPatient = patientService.createPatient(patientProfileDTO);
            return new ResponseEntity<>(createdPatient, HttpStatus.CREATED);
        } catch (Exception e) {  // Catch general exceptions for now; consider specific ones like DataIntegrityViolationException
            System.err.println("Error creating patient: " + e.getMessage());  // Log the error
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);  // Or return a custom error message
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<PatientProfileDTO>> getAllPatients() {
        List<PatientProfileDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or (hasRole('PATIENT') and @jwtUtils.getUserIdFromAuthentication(authentication) == #patientId)")
    public ResponseEntity<PatientProfileDTO> getPatientById(@PathVariable Long patientId) {
        PatientProfileDTO patient = patientService.getPatientById(patientId);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @jwtUtils.getUserIdFromAuthentication(authentication) == #userId")
    public ResponseEntity<PatientProfileDTO> getPatientByUserId(@PathVariable Long userId) {
        PatientProfileDTO patient = patientService.getPatientByUserId(userId);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/{patientId}/details")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or (hasRole('PATIENT') and @jwtUtils.getUserIdFromAuthentication(authentication) == #patientId)")
    public ResponseEntity<PatientDetailsDTO> getPatientDetailsById(@PathVariable Long patientId) {
        PatientDetailsDTO patientDetails = patientService.getPatientDetailsById(patientId);
        return ResponseEntity.ok(patientDetails);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DOCTOR')")
    public ResponseEntity<List<PatientProfileDTO>> getPatientsByStatus(@PathVariable String status) {
        List<PatientProfileDTO> patients = patientService.getPatientsByStatus(status);
        return ResponseEntity.ok(patients);
    }


    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('DOCTOR') and @jwtUtils.getUserIdFromAuthentication(authentication) == #doctorId)")
    public ResponseEntity<List<PatientProfileDTO>> getPatientsByDoctor(@PathVariable Long doctorId) {
        List<PatientProfileDTO> patients = patientService.getPatientsByDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }



    @GetMapping("/blood-group/{bloodGroup}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DOCTOR')")
    public ResponseEntity<List<PatientDTO>> getPatientsByBloodGroup(@PathVariable String bloodGroup) {
        List<PatientDTO> patients = patientService.getPatientsByBloodGroup(bloodGroup);
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN') or (hasRole('PATIENT') and @jwtUtils.getUserIdFromAuthentication(authentication) == #userId)")
    public ResponseEntity<PatientProfileDTO> updatePatientProfile(@PathVariable Long userId, @Valid @RequestBody PatientProfileDTO patientProfileDTO) {
        PatientProfileDTO updatedPatient = patientService.updatePatientProfileByUserId(userId, patientProfileDTO);
        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PatientProfileDTO> deletePatientByUserId(@PathVariable Long userId) {
        PatientProfileDTO deletedPatient = patientService.deletePatientByUserId(userId);
        return ResponseEntity.ok(deletedPatient);
    }

    @GetMapping("/{patientId}/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DOCTOR') or (hasRole('PATIENT') and @jwtUtils.getUserIdFromAuthentication(authentication) == #patientId)")
    public ResponseEntity<MedicalHistoryDTO> getMedicalHistory(@PathVariable Long patientId) {
        MedicalHistoryDTO medicalHistory = patientService.getMedicalHistory(patientId);
        return ResponseEntity.ok(medicalHistory);
    }

} 