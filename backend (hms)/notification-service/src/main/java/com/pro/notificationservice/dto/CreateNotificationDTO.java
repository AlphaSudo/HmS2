package com.pro.notificationservice.dto;

import com.pro.notificationservice.model.NotificationType;
import com.pro.notificationservice.model.Priority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNotificationDTO {
    
    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Recipient email is required")
    private String recipientEmail;
    
    private String recipientPhone;
    private String recipientName;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotNull(message = "Notification type is required")
    private NotificationType type;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private String templateName;
    private Map<String, Object> templateVariables;
    
    private String sourceService;
    private String referenceId;
    private String referenceType;
} 