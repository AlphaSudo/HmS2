package com.pro.notificationservice.service;

import com.pro.notificationservice.model.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public boolean sendEmail(Notification notification) {
        try {
            if (notification.getTemplateName() != null) {
                return sendHtmlEmail(notification);
            } else {
                return sendSimpleEmail(notification);
            }
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", notification.getRecipientEmail(), e.getMessage(), e);
            return false;
        }
    }
    
    private boolean sendSimpleEmail(Notification notification) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notification.getRecipientEmail());
            message.setSubject(notification.getSubject());
            message.setText(notification.getContent());
            message.setFrom("noreply@hospital-management.com");
            
            mailSender.send(message);
            log.info("Simple email sent successfully to {}", notification.getRecipientEmail());
            return true;
            
        } catch (Exception e) {
            log.error("Failed to send simple email to {}: {}", notification.getRecipientEmail(), e.getMessage());
            return false;
        }
    }
    
    private boolean sendHtmlEmail(Notification notification) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(notification.getRecipientEmail());
            helper.setSubject(notification.getSubject());
            helper.setText(notification.getContent(), true); // true indicates HTML content
            helper.setFrom("noreply@hospital-management.com");
            
            mailSender.send(mimeMessage);
            log.info("HTML email sent successfully to {}", notification.getRecipientEmail());
            return true;
            
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}: {}", notification.getRecipientEmail(), e.getMessage());
            return false;
        }
    }
} 