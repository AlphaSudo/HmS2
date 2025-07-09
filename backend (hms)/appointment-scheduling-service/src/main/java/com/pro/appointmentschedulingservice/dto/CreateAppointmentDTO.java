package com.pro.appointmentschedulingservice.dto;

import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateAppointmentDTO {
    @NotEmpty(message = "Patient name cannot be empty")
    private String patientName;

    @NotEmpty(message = "Doctor name cannot be empty")
    private String doctor;

    @NotEmpty(message = "Gender cannot be empty")
    private String gender;

    @NotNull(message = "Date cannot be null")
    @FutureOrPresent(message = "Date must be in the present or future")
    private LocalDate date;

    @NotNull(message = "Time cannot be null")
    private LocalTime time;

    @NotEmpty(message = "Mobile number cannot be empty")
    private String mobile;

    @NotEmpty(message = "Injury/Reason cannot be empty")
    private String injury;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Status cannot be null")
    private AppointmentStatus status;

    @NotNull(message = "Visit type cannot be null")
    private VisitType visitType;

    @NotNull(message = "Patient id cannot be null")
    private Long patientId;
} 