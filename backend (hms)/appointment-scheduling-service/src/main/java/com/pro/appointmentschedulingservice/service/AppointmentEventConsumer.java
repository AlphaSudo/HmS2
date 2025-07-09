package com.pro.appointmentschedulingservice.service;

import com.pro.appointmentschedulingservice.dto.events.AppointmentCancelledEvent;
import com.pro.appointmentschedulingservice.dto.events.AppointmentCreatedEvent;
import com.pro.appointmentschedulingservice.dto.events.AppointmentStatusChangedEvent;
import com.pro.appointmentschedulingservice.dto.events.AppointmentUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaHandler;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
//@KafkaListener(topics = "${spring.kafka.topic.appointment-events}", groupId = "${spring.kafka.consumer.group-id}")
public class AppointmentEventConsumer {

    // In a real application, you would have services that react to these events.
    // For now, we'll just log the events to demonstrate consumption.

//    @KafkaHandler
    public void handleAppointmentCreatedEvent(AppointmentCreatedEvent event) {
//        log.info("Received AppointmentCreatedEvent for appointment ID: {}", event.getAppointmentId());
        // Example: Trigger a notification service, update a read model, etc.
    }

//    @KafkaHandler
    public void handleAppointmentUpdatedEvent(AppointmentUpdatedEvent event) {
//        log.info("Received AppointmentUpdatedEvent for appointment ID: {}", event.getAppointmentId());
        // Example: Invalidate caches, notify subscribed users, etc.
    }

//    @KafkaHandler
    public void handleAppointmentCancelledEvent(AppointmentCancelledEvent event) {
//        log.info("Received AppointmentCancelledEvent for appointment ID: {}", event.getAppointmentId());
        // Example: Release resources, notify doctor, etc.
    }
    
//    @KafkaHandler
    public void handleAppointmentStatusChangedEvent(AppointmentStatusChangedEvent event) {
//        log.info("Received AppointmentStatusChangedEvent for appointment ID: {} - new status: {}", 
//                event.getAppointmentId(), event.getCurrentStatus());
        // Example: Trigger billing processes, update patient records, etc.
    }

//    @KafkaHandler(isDefault = true)
    public void handleUnknownEvent(Object event) {
//        log.warn("Received unknown event type: {}", event.getClass().getName());
    }
} 