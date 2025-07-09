package com.pro.ehrreportsservice.repository;

import com.pro.ehrreportsservice.entity.EhrReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EhrReportRepository extends MongoRepository<EhrReport, String> {

    List<EhrReport> findByPatientId(Long patientId);

    List<EhrReport> findByDoctorId(Long doctorId);

} 