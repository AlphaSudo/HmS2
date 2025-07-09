package com.pro.notificationservice.dto;

import com.pro.notificationservice.model.NotificationStatus;
import com.pro.notificationservice.model.NotificationType;
import com.pro.notificationservice.model.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private String recipientEmail;
    private String recipientPhone;
    private String recipientName;
    private String subject;
    private String content;
    private NotificationType type;
    private NotificationStatus status;
    private Priority priority;
    private String templateName;
    private LocalDateTime sentAt;
    private LocalDateTime deliveredAt;
    private String sourceService;
    private String referenceId;
    private String referenceType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 