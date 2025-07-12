package com.pro.pharmacymanagementservice.repository;

import com.pro.pharmacymanagementservice.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);

    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByPatientIdOrderByPrescribedDateDesc(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByStatus(String status);

    @Query("SELECT p FROM Prescription p WHERE p.prescribedDate BETWEEN :startDate AND :endDate")
    List<Prescription> findByPrescribedDateBetween(@Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Prescription p WHERE p.dispensedDate BETWEEN :startDate AND :endDate")
    List<Prescription> findByDispensedDateBetween(@Param("startDate") LocalDate startDate, 
                                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Prescription p WHERE LOWER(p.patientName) LIKE LOWER(CONCAT('%', :patientName, '%'))")
    List<Prescription> findByPatientNameContainingIgnoreCase(@Param("patientName") String patientName);

    @Query("SELECT p FROM Prescription p WHERE LOWER(p.doctorName) LIKE LOWER(CONCAT('%', :doctorName, '%'))")
    List<Prescription> findByDoctorNameContainingIgnoreCase(@Param("doctorName") String doctorName);
} 