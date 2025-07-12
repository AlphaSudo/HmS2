package com.pro.appointmentschedulingservice.dto;

import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class UpdateAppointmentDTO {
    private String patientName;
    private Long doctorId;
    private String doctor;
    private String gender;
    @FutureOrPresent(message = "Date must be in the present or future")
    private LocalDate date;
    private LocalTime time;
    private String mobile;
    private String injury;
    @Email(message = "Email should be valid")
    private String email;
    private AppointmentStatus status;
    private VisitType visitType;
    private Long patientId;
} 