package com.pro.patientmanagementservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreatePatientDTO {
    @NotBlank(message = "First name is mandatory")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    private String lastName;

    private String email;

    private LocalDate dateOfBirth;

    private String maritalStatus;

    @NotBlank(message = "Treatment is mandatory")
    private String treatment;

    @NotBlank(message = "Gender is mandatory")
    private String gender;

    @NotBlank(message = "Mobile is mandatory")
    private String mobile;

    @NotNull(message = "Admission date is mandatory")
    private LocalDate admissionDate;

    @NotBlank(message = "Doctor assigned is mandatory")
    private String doctorAssigned;

    @NotBlank(message = "Address is mandatory")
    private String address;

    @NotBlank(message = "Blood group is mandatory")
    private String bloodGroup;

    private LocalDate dischargeDate;

    @NotBlank(message = "Status is mandatory")
    private String status;
} 