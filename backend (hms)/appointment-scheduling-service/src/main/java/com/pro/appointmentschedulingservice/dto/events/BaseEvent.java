package com.pro.appointmentschedulingservice.dto.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "eventType")
@JsonSubTypes({
    @JsonSubTypes.Type(value = AppointmentCreatedEvent.class, name = "APPOINTMENT_CREATED"),
    @JsonSubTypes.Type(value = AppointmentUpdatedEvent.class, name = "APPOINTMENT_UPDATED"),
    @JsonSubTypes.Type(value = AppointmentCancelledEvent.class, name = "APPOINTMENT_CANCELLED"),
    @JsonSubTypes.Type(value = AppointmentStatusChangedEvent.class, name = "APPOINTMENT_STATUS_CHANGED")
})
public abstract class BaseEvent {
    
    private String eventId = UUID.randomUUID().toString();
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp = LocalDateTime.now();
    
    private String serviceName = "appointment-scheduling-service";
    
    public abstract String getEventType();
} 