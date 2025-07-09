package com.pro.doctormanagementservice.dto;

import com.pro.doctormanagementservice.model.DoctorStatus;
import com.pro.doctormanagementservice.model.Specialization;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DoctorDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String licenseNumber;
    private Specialization specialization;
    private Integer experienceYears;
    private String qualification;
    private LocalDate dateOfBirth;
    private String gender;
    private LocalDate hireDate;
    private DoctorStatus status;
    private Double consultationFee;
    private String bio;
} 