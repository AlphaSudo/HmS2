package com.pro.appointmentschedulingservice.dto;

import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentDTO {
    private Long id;
    private String patientName;
    private Long doctorId;
    private String doctor;
    private String gender;
    private LocalDate date;
    private LocalTime time;
    private String mobile;
    private String injury;
    private String email;
    private AppointmentStatus status;
    private VisitType visitType;
    private Long patientId;
} 