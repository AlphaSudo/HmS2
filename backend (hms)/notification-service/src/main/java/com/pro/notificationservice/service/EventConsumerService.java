package com.pro.notificationservice.service;

import com.pro.notificationservice.dto.CreateNotificationDTO;
import com.pro.notificationservice.model.NotificationType;
import com.pro.notificationservice.model.Priority;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventConsumerService {
    
    private final NotificationService notificationService;
    
    @KafkaListener(topics = "appointment-events", groupId = "notification-service-group")
    public void handleAppointmentEvent(Map<String, Object> event) {
        try {
            log.info("Received appointment event: {}", event);
            
            String eventType = (String) event.get("eventType");
            if (eventType == null) return;
            
            switch (eventType) {
                case "APPOINTMENT_CREATED" -> handleAppointmentCreated(event);
                case "APPOINTMENT_CANCELLED" -> handleAppointmentCancelled(event);
                default -> log.debug("Unhandled appointment event type: {}", eventType);
            }
            
        } catch (Exception e) {
            log.error("Error processing appointment event: {}", event, e);
        }
    }
    
    @KafkaListener(topics = "patient-events", groupId = "notification-service-group")
    public void handlePatientEvent(Map<String, Object> event) {
        try {
            log.info("Received patient event: {}", event);
            
            String eventType = (String) event.get("eventType");
            if (eventType == null) return;
            
            switch (eventType) {
                case "PATIENT_REGISTERED" -> handlePatientRegistered(event);
                default -> log.debug("Unhandled patient event type: {}", eventType);
            }
            
        } catch (Exception e) {
            log.error("Error processing patient event: {}", event, e);
        }
    }
    
    @KafkaListener(topics = "billing-events", groupId = "notification-service-group")
    public void handleBillingEvent(Map<String, Object> event) {
        try {
            log.info("Received billing event: {}", event);
            
            String eventType = (String) event.get("eventType");
            if (eventType == null) return;
            
            switch (eventType) {
                case "INVOICE_GENERATED" -> handleInvoiceGenerated(event);
                case "PAYMENT_RECEIVED" -> handlePaymentReceived(event);
                case "PAYMENT_OVERDUE" -> handlePaymentOverdue(event);
                default -> log.debug("Unhandled billing event type: {}", eventType);
            }
            
        } catch (Exception e) {
            log.error("Error processing billing event: {}", event, e);
        }
    }
    
    private void handleAppointmentCreated(Map<String, Object> event) {
        String patientEmail = (String) event.get("email");
        String patientName = (String) event.get("patientName");
        String doctorName = (String) event.get("doctor");
        
        if (patientEmail != null) {
            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .recipientEmail(patientEmail)
                    .recipientName(patientName)
                    .subject("Appointment Confirmation")
                    .content(String.format("Dear %s,\n\nYour appointment with Dr. %s has been scheduled.\n\nBest regards,\nHospital Management System",
                            patientName, doctorName))
                    .type(NotificationType.EMAIL)
                    .priority(Priority.HIGH)
                    .sourceService("appointment-scheduling-service")
                    .referenceId((String) event.get("appointmentId"))
                    .referenceType("APPOINTMENT")
                    .build();
            
            notificationService.createNotification(notification);
        }
    }
    
    private void handleAppointmentCancelled(Map<String, Object> event) {
        String patientEmail = (String) event.get("email");
        String patientName = (String) event.get("patientName");
        
        if (patientEmail != null) {
            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .recipientEmail(patientEmail)
                    .recipientName(patientName)
                    .subject("Appointment Cancelled")
                    .content(String.format("Dear %s,\n\nYour appointment has been cancelled.\n\nBest regards,\nHospital Management System",
                            patientName))
                    .type(NotificationType.EMAIL)
                    .priority(Priority.HIGH)
                    .sourceService("appointment-scheduling-service")
                    .referenceId((String) event.get("appointmentId"))
                    .referenceType("APPOINTMENT")
                    .build();
            
            notificationService.createNotification(notification);
        }
    }
    
    private void handlePatientRegistered(Map<String, Object> event) {
        String patientEmail = (String) event.get("email");
        String patientName = (String) event.get("name");
        
        if (patientEmail != null) {
            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .recipientEmail(patientEmail)
                    .recipientName(patientName)
                    .subject("Welcome to Hospital Management System")
                    .content(String.format("Dear %s,\n\nWelcome to our Hospital Management System!\n\nBest regards,\nHospital Management Team",
                            patientName))
                    .type(NotificationType.EMAIL)
                    .priority(Priority.NORMAL)
                    .sourceService("patient-management-service")
                    .referenceId((String) event.get("patientId"))
                    .referenceType("PATIENT")
                    .build();
            
            notificationService.createNotification(notification);
        }
    }
    
    private void handleInvoiceGenerated(Map<String, Object> event) {
        String patientEmail = (String) event.get("patientEmail");
        String patientName = (String) event.get("patientName");
        String invoiceNumber = (String) event.get("invoiceNumber");
        Object totalAmount = event.get("totalAmount");
        
        if (patientEmail != null) {
            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .recipientEmail(patientEmail)
                    .recipientName(patientName)
                    .subject("Invoice Generated")
                    .content(String.format("Dear %s,\n\nA new invoice (#%s) has been generated for amount $%.2f. Please review and make payment.\n\nBest regards,\nBilling Department",
                            patientName, invoiceNumber, totalAmount != null ? Double.valueOf(totalAmount.toString()) : 0.0))
                    .type(NotificationType.EMAIL)
                    .priority(Priority.HIGH)
                    .sourceService("billing-invoicing-service")
                    .referenceId(invoiceNumber)
                    .referenceType("INVOICE")
                    .build();
            
            notificationService.createNotification(notification);
        }
    }
    
    private void handlePaymentReceived(Map<String, Object> event) {
        String patientEmail = (String) event.get("patientEmail");
        String patientName = (String) event.get("patientName");
        String invoiceNumber = (String) event.get("invoiceNumber");
        Object amount = event.get("amount");
        
        if (patientEmail != null) {
            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .recipientEmail(patientEmail)
                    .recipientName(patientName)
                    .subject("Payment Confirmation")
                    .content(String.format("Dear %s,\n\nThank you! Your payment of $%.2f for invoice #%s has been received successfully.\n\nBest regards,\nBilling Department",
                            patientName, amount != null ? Double.valueOf(amount.toString()) : 0.0, invoiceNumber))
                    .type(NotificationType.EMAIL)
                    .priority(Priority.NORMAL)
                    .sourceService("billing-invoicing-service")
                    .referenceId(invoiceNumber)
                    .referenceType("PAYMENT")
                    .build();
            
            notificationService.createNotification(notification);
        }
    }
    
    private void handlePaymentOverdue(Map<String, Object> event) {
        String patientEmail = (String) event.get("patientEmail");
        String patientName = (String) event.get("patientName");
        String invoiceNumber = (String) event.get("invoiceNumber");
        
        if (patientEmail != null) {
            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .recipientEmail(patientEmail)
                    .recipientName(patientName)
                    .subject("Payment Overdue Notice")
                    .content(String.format("Dear %s,\n\nThis is a reminder that your payment for invoice #%s is overdue. Please make payment at your earliest convenience.\n\nBest regards,\nBilling Department",
                            patientName, invoiceNumber))
                    .type(NotificationType.EMAIL)
                    .priority(Priority.URGENT)
                    .sourceService("billing-invoicing-service")
                    .referenceId(invoiceNumber)
                    .referenceType("PAYMENT_REMINDER")
                    .build();
            
            notificationService.createNotification(notification);
        }
    }
} 