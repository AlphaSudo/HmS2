package com.pro.patientmanagementservice.repository;

import com.pro.patientmanagementservice.model.MedicalHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalHistoryRepository extends MongoRepository<MedicalHistory, String> {
    Optional<MedicalHistory> findByPatientId(Long patientId);
    boolean existsByPatientId(Long patientId);
} 