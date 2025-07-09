package com.pro.notificationservice.service;

import com.pro.notificationservice.dto.CreateNotificationDTO;
import com.pro.notificationservice.dto.NotificationDTO;
import com.pro.notificationservice.exception.NotificationNotFoundException;
import com.pro.notificationservice.mapper.NotificationMapper;
import com.pro.notificationservice.model.Notification;
import com.pro.notificationservice.model.NotificationStatus;
import com.pro.notificationservice.model.NotificationType;
import com.pro.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final EmailService emailService;
    
    public NotificationDTO createNotification(CreateNotificationDTO createDTO) {
        log.info("Creating notification for recipient: {}", createDTO.getRecipientEmail());
        
        Notification notification = notificationMapper.toEntity(createDTO);
        notification = notificationRepository.save(notification);
        
        // Immediately try to send the notification
        sendNotification(notification);
        
        return notificationMapper.toDTO(notification);
    }
    
    @Transactional(readOnly = true)
    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        return notificationMapper.toDTO(notification);
    }
    
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable)
                .map(notificationMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getNotificationsByEmail(String email, Pageable pageable) {
        return notificationRepository.findByRecipientEmailContainingIgnoreCase(email, pageable)
                .map(notificationMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getNotificationsByStatus(NotificationStatus status, Pageable pageable) {
        return notificationRepository.findByStatus(status, pageable)
                .map(notificationMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getNotificationsByType(NotificationType type, Pageable pageable) {
        return notificationRepository.findByType(type, pageable)
                .map(notificationMapper::toDTO);
    }
    
    public void sendNotification(Notification notification) {
        try {
            log.info("Sending notification ID: {} of type: {}", notification.getId(), notification.getType());
            
            boolean sent = false;
            switch (notification.getType()) {
                case EMAIL -> sent = emailService.sendEmail(notification);
                case SMS -> {
                    log.warn("SMS notifications not yet implemented");
                    sent = true; // Mark as sent for now
                }
                case PUSH -> {
                    log.warn("Push notifications not yet implemented");
                    sent = true; // Mark as sent for now
                }
                case IN_APP -> {
                    log.warn("In-app notifications not yet implemented");
                    sent = true; // Mark as sent for now
                }
            }
            
            if (sent) {
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
                log.info("Notification ID: {} sent successfully", notification.getId());
            } else {
                handleFailedNotification(notification, "Failed to send notification");
            }
            
            notificationRepository.save(notification);
            
        } catch (Exception e) {
            log.error("Error sending notification ID: {}", notification.getId(), e);
            handleFailedNotification(notification, e.getMessage());
            notificationRepository.save(notification);
        }
    }
    
    private void handleFailedNotification(Notification notification, String errorMessage) {
        notification.setRetryCount(notification.getRetryCount() + 1);
        notification.setErrorMessage(errorMessage);
        
        if (notification.getRetryCount() >= notification.getMaxRetries()) {
            notification.setStatus(NotificationStatus.FAILED);
            log.warn("Notification ID: {} failed after {} retries", notification.getId(), notification.getRetryCount());
        } else {
            notification.setStatus(NotificationStatus.PENDING);
            log.info("Notification ID: {} will be retried. Attempt: {}/{}", 
                    notification.getId(), notification.getRetryCount(), notification.getMaxRetries());
        }
    }
    
    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
        
        notificationRepository.delete(notification);
        log.info("Deleted notification with id: {}", id);
    }
} 