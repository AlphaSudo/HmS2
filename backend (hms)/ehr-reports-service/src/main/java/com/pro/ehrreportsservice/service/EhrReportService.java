package com.pro.ehrreportsservice.service;

import com.pro.ehrreportsservice.dto.EhrReportDTO;

import java.util.List;

public interface EhrReportService {
    EhrReportDTO createReport(EhrReportDTO reportDTO);
    EhrReportDTO getReportById(String id);
    List<EhrReportDTO> getReportsByPatientId(Long patientId);
    List<EhrReportDTO> getReportsByDoctorId(Long doctorId);
} 