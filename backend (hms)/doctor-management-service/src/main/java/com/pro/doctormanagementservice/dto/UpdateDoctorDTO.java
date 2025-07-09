package com.pro.doctormanagementservice.dto;

import com.pro.doctormanagementservice.model.DoctorStatus;
import com.pro.doctormanagementservice.model.Specialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateDoctorDTO {
    private String firstName;
    private String lastName;
    @Email(message = "Email should be valid")
    private String email;
    private String mobile;
    private String licenseNumber;
    private Specialization specialization;
    @Min(value = 0, message = "Experience years must be non-negative")
    private Integer experienceYears;
    private String qualification;
    @PastOrPresent(message = "Date of birth must be in the past or present")
    private LocalDate dateOfBirth;
    private String gender;
    @PastOrPresent(message = "Hire date must be in the past or present")
    private LocalDate hireDate;
    private DoctorStatus status;
    @Positive(message = "Consultation fee must be positive")
    private Double consultationFee;
    private String bio;
} 