package com.pro.pharmacymanagementservice.controller;

import com.pro.pharmacymanagementservice.dto.CreatePrescriptionRequest;
import com.pro.pharmacymanagementservice.dto.PrescriptionDto;
import com.pro.pharmacymanagementservice.service.PrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacy/prescriptions")
@RequiredArgsConstructor
@Tag(name = "Prescription Management", description = "APIs for managing prescriptions in the pharmacy system")
@SecurityRequirement(name = "Bearer Authentication")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all prescriptions", description = "Retrieve all prescriptions in the system. Only accessible by administrators.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all prescriptions"),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    public ResponseEntity<List<PrescriptionDto>> getAllPrescriptions() {
        List<PrescriptionDto> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or (hasRole('PATIENT') and @jwtUtils.getUserIdFromAuthentication(authentication) == #patientId)")
    @Operation(summary = "Get prescriptions by patient ID", description = "Retrieve all prescriptions for a specific patient. Patients can only access their own prescriptions.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved patient prescriptions"),
        @ApiResponse(responseCode = "403", description = "Access denied - Insufficient permissions"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    public ResponseEntity<List<PrescriptionDto>> getPrescriptionsByPatientId(
            @Parameter(description = "Patient ID", required = true) @PathVariable Long patientId, 
            Authentication authentication) {
        List<PrescriptionDto> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('DOCTOR') and @jwtUtils.getUserIdFromAuthentication(authentication) == #doctorId)")
    @Operation(summary = "Get prescriptions by doctor ID", description = "Retrieve all prescriptions created by a specific doctor. Doctors can only access their own prescriptions.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved doctor prescriptions"),
        @ApiResponse(responseCode = "403", description = "Access denied - Insufficient permissions"),
        @ApiResponse(responseCode = "404", description = "Doctor not found")
    })
    public ResponseEntity<List<PrescriptionDto>> getPrescriptionsByDoctorId(
            @Parameter(description = "Doctor ID", required = true) @PathVariable Long doctorId, 
            Authentication authentication) {
        List<PrescriptionDto> prescriptions = prescriptionService.getPrescriptionsByDoctorId(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Create a new prescription", description = "Create a new prescription. Only accessible by administrators and doctors.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Prescription created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid prescription data"),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin or Doctor role required")
    })
    public ResponseEntity<PrescriptionDto> createPrescription(
            @Parameter(description = "Prescription details", required = true) @Valid @RequestBody CreatePrescriptionRequest request) {
        PrescriptionDto prescription = prescriptionService.createPrescription(request);
        return new ResponseEntity<>(prescription, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Update an existing prescription", description = "Update an existing prescription. Only accessible by administrators and doctors.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Prescription updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid prescription data"),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin or Doctor role required"),
        @ApiResponse(responseCode = "404", description = "Prescription not found")
    })
    public ResponseEntity<PrescriptionDto> updatePrescription(
            @Parameter(description = "Prescription ID", required = true) @PathVariable Long id, 
            @Parameter(description = "Updated prescription details", required = true) @Valid @RequestBody CreatePrescriptionRequest request) {
        PrescriptionDto prescription = prescriptionService.updatePrescription(id, request);
        return ResponseEntity.ok(prescription);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a prescription", description = "Delete an existing prescription. Only accessible by administrators.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Prescription deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin role required"),
        @ApiResponse(responseCode = "404", description = "Prescription not found")
    })
    public ResponseEntity<Void> deletePrescription(
            @Parameter(description = "Prescription ID", required = true) @PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
} 