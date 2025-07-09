package com.pro.appointmentschedulingservice.service;

import com.pro.appointmentschedulingservice.dto.events.*;
import com.pro.appointmentschedulingservice.model.Appointment;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
//@RequiredArgsConstructor
@Slf4j
public class AppointmentEventPublisher {

//    private final KafkaTemplate<String, Object> kafkaTemplate;

//    @Value("${spring.kafka.topic.appointment-events}")
    private String appointmentEventsTopic;

    public AppointmentEventPublisher() {
        // this.kafkaTemplate = kafkaTemplate;
    }

    public void publishAppointmentCreatedEvent(Appointment appointment) {
        AppointmentCreatedEvent event = AppointmentCreatedEvent.builder()
                .appointmentId(appointment.getId())
                .patientName(appointment.getPatientName())
                .doctor(appointment.getDoctor())
                .gender(appointment.getGender())
                .mobile(appointment.getMobile())
                .email(appointment.getEmail())
                .injury(appointment.getInjury())
                .appointmentDate(appointment.getDate())
                .appointmentTime(appointment.getTime())
                .status(appointment.getStatus())
                .visitType(appointment.getVisitType())
                .createdAt(appointment.getCreatedAt())
                .build();

//        publishEvent(event, appointment.getId().toString());
        log.info("Published appointment created event for appointment ID: {}", appointment.getId());
    }

    public void publishAppointmentUpdatedEvent(Appointment appointment, Map<String, Object[]> changedFields) {
        AppointmentUpdatedEvent event = AppointmentUpdatedEvent.builder()
                .appointmentId(appointment.getId())
                .patientName(appointment.getPatientName())
                .doctor(appointment.getDoctor())
                .gender(appointment.getGender())
                .mobile(appointment.getMobile())
                .email(appointment.getEmail())
                .injury(appointment.getInjury())
                .appointmentDate(appointment.getDate())
                .appointmentTime(appointment.getTime())
                .status(appointment.getStatus())
                .visitType(appointment.getVisitType())
                .updatedAt(appointment.getUpdatedAt())
                .changedFields(changedFields)
                .build();

//        publishEvent(event, appointment.getId().toString());
        log.info("Published appointment updated event for appointment ID: {} with changes: {}", 
                appointment.getId(), changedFields.keySet());
    }

    public void publishAppointmentCancelledEvent(Appointment appointment, String cancellationReason) {
        AppointmentCancelledEvent event = AppointmentCancelledEvent.builder()
                .appointmentId(appointment.getId())
                .patientName(appointment.getPatientName())
                .doctor(appointment.getDoctor())
                .appointmentDate(appointment.getDate())
                .appointmentTime(appointment.getTime())
                .cancellationReason(cancellationReason)
                .cancelledAt(LocalDateTime.now())
                .build();

//        publishEvent(event, appointment.getId().toString());
        log.info("Published appointment cancelled event for appointment ID: {} with reason: {}", 
                appointment.getId(), cancellationReason);
    }

    public void publishAppointmentStatusChangedEvent(Appointment appointment, 
                                                   AppointmentStatus previousStatus, 
                                                   String statusChangeReason) {
        AppointmentStatusChangedEvent event = AppointmentStatusChangedEvent.builder()
                .appointmentId(appointment.getId())
                .patientName(appointment.getPatientName())
                .doctor(appointment.getDoctor())
                .previousStatus(previousStatus)
                .currentStatus(appointment.getStatus())
                .statusChangeReason(statusChangeReason)
                .statusChangedAt(LocalDateTime.now())
                .build();

//        publishEvent(event, appointment.getId().toString());
        log.info("Published appointment status changed event for appointment ID: {} from {} to {}", 
                appointment.getId(), previousStatus, appointment.getStatus());
    }

    private void publishEvent(BaseEvent event, String key) {
//        try {
//            CompletableFuture<SendResult<String, Object>> future = 
//                    kafkaTemplate.send(appointmentEventsTopic, key, event);
//            
//            future.whenComplete((result, exception) -> {
//                if (exception != null) {
//                    log.error("Failed to publish event {} for appointment {}: {}", 
//                            event.getEventType(), key, exception.getMessage(), exception);
//                } else {
//                    log.debug("Successfully published event {} for appointment {} to partition {} with offset {}", 
//                            event.getEventType(), key, 
//                            result.getRecordMetadata().partition(), 
//                            result.getRecordMetadata().offset());
//                }
//            });
//        } catch (Exception e) {
//            log.error("Error publishing event {} for appointment {}: {}", 
//                    event.getEventType(), key, e.getMessage(), e);
//        }
    }
} 