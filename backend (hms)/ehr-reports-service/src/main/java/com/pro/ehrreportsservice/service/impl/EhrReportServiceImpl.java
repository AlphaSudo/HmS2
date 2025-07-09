package com.pro.ehrreportsservice.service.impl;

import com.pro.ehrreportsservice.dto.EhrReportDTO;
import com.pro.ehrreportsservice.entity.EhrReport;
import com.pro.ehrreportsservice.mapper.EhrReportMapper;
import com.pro.ehrreportsservice.repository.EhrReportRepository;
import com.pro.ehrreportsservice.service.EhrReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EhrReportServiceImpl implements EhrReportService {

    private final EhrReportRepository ehrReportRepository;
    private final EhrReportMapper ehrReportMapper;

    @Override
    public EhrReportDTO createReport(EhrReportDTO reportDTO) {
        EhrReport ehrReport = ehrReportMapper.toEntity(reportDTO);
        ehrReport.setReportDate(LocalDateTime.now());
        EhrReport savedReport = ehrReportRepository.save(ehrReport);
        return ehrReportMapper.toDto(savedReport);
    }

    @Override
    public EhrReportDTO getReportById(String id) {
        EhrReport ehrReport = ehrReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        return ehrReportMapper.toDto(ehrReport);
    }

    @Override
    public List<EhrReportDTO> getReportsByPatientId(Long patientId) {
        List<EhrReport> ehrReports = ehrReportRepository.findByPatientId(patientId);
        return ehrReportMapper.toDtoList(ehrReports);
    }

    @Override
    public List<EhrReportDTO> getReportsByDoctorId(Long doctorId) {
        List<EhrReport> ehrReports = ehrReportRepository.findByDoctorId(doctorId);
        return ehrReportMapper.toDtoList(ehrReports);
    }
} 