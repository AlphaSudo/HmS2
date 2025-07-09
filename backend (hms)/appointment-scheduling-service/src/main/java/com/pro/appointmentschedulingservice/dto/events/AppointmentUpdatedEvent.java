package com.pro.appointmentschedulingservice.dto.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AppointmentUpdatedEvent extends BaseEvent {
    
    private Long appointmentId;
    private String patientName;
    private String doctor;
    private String gender;
    private String mobile;
    private String email;
    private String injury;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime appointmentTime;
    
    private AppointmentStatus status;
    private VisitType visitType;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Map of field changes (fieldName -> [oldValue, newValue])
    private Map<String, Object[]> changedFields;
    
    @Override
    public String getEventType() {
        return "APPOINTMENT_UPDATED";
    }
} 