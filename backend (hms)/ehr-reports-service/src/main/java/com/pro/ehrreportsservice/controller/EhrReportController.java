package com.pro.ehrreportsservice.controller;

import com.pro.ehrreportsservice.dto.EhrReportDTO;
import com.pro.ehrreportsservice.service.EhrReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class EhrReportController {

    private final EhrReportService ehrReportService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<EhrReportDTO> createReport(@Valid @RequestBody EhrReportDTO reportDTO) {
        EhrReportDTO createdReport = ehrReportService.createReport(reportDTO);
        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<EhrReportDTO> getReportById(@PathVariable String id) {
        EhrReportDTO report = ehrReportService.getReportById(id);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<List<EhrReportDTO>> getReportsByPatientId(@PathVariable Long patientId) {
        List<EhrReportDTO> reports = ehrReportService.getReportsByPatientId(patientId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<List<EhrReportDTO>> getReportsByDoctorId(@PathVariable Long doctorId) {
        List<EhrReportDTO> reports = ehrReportService.getReportsByDoctorId(doctorId);
        return ResponseEntity.ok(reports);
    }
} 