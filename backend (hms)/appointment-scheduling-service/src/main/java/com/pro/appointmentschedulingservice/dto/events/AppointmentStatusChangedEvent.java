package com.pro.appointmentschedulingservice.dto.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AppointmentStatusChangedEvent extends BaseEvent {
    
    private Long appointmentId;
    private String patientName;
    private String doctor;
    private AppointmentStatus previousStatus;
    private AppointmentStatus currentStatus;
    private String statusChangeReason;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime statusChangedAt;
    
    @Override
    public String getEventType() {
        return "APPOINTMENT_STATUS_CHANGED";
    }
} 