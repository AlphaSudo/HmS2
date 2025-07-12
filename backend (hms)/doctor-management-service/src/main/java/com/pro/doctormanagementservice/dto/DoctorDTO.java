package com.pro.doctormanagementservice.dto;

import com.pro.doctormanagementservice.model.DoctorStatus;
import com.pro.doctormanagementservice.model.Gender;
import com.pro.doctormanagementservice.model.Specialization;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DoctorDTO {
    private Long id;
    private Long userId; // For API compatibility - will be same as id
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String licenseNumber;
    private Specialization specialization;
    private Integer experienceYears;
    private String qualification;
    private LocalDate dateOfBirth;
    private Gender gender;
    private LocalDate hireDate;
    private DoctorStatus status;
    private BigDecimal consultationFee;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 