package com.pro.doctormanagementservice.dto;

import com.pro.doctormanagementservice.model.DoctorStatus;
import com.pro.doctormanagementservice.model.Specialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateDoctorDTO {
    @NotEmpty(message = "First name cannot be empty")
    private String firstName;

    @NotEmpty(message = "Last name cannot be empty")
    private String lastName;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Mobile number cannot be empty")
    private String mobile;

    @NotEmpty(message = "License number cannot be empty")
    private String licenseNumber;

    @NotNull(message = "Specialization cannot be null")
    private Specialization specialization;

    @NotNull(message = "Experience years cannot be null")
    @Min(value = 0, message = "Experience years must be non-negative")
    private Integer experienceYears;

    @NotEmpty(message = "Qualification cannot be empty")
    private String qualification;

    @NotNull(message = "Date of birth cannot be null")
    @PastOrPresent(message = "Date of birth must be in the past or present")
    private LocalDate dateOfBirth;

    @NotEmpty(message = "Gender cannot be empty")
    private String gender;

    @NotNull(message = "Hire date cannot be null")
    @PastOrPresent(message = "Hire date must be in the past or present")
    private LocalDate hireDate;

    @NotNull(message = "Status cannot be null")
    private DoctorStatus status;

    @NotNull(message = "Consultation fee cannot be null")
    @Positive(message = "Consultation fee must be positive")
    private Double consultationFee;

    private String bio;
} 