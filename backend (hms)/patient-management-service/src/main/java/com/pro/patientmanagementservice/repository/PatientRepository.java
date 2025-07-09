package com.pro.patientmanagementservice.repository;

import com.pro.patientmanagementservice.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByStatus(String status);
    List<Patient> findByDoctorAssigned(String doctorAssigned);
    List<Patient> findByBloodGroup(String bloodGroup);
    Optional<Patient> findByMobile(String mobile);
    Optional<Patient> findByUserId(Long userId);
    boolean existsByMobile(String mobile);
} 