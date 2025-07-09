package com.pro.notificationservice.controller;

import com.pro.notificationservice.dto.CreateNotificationDTO;
import com.pro.notificationservice.dto.NotificationDTO;
import com.pro.notificationservice.model.NotificationStatus;
import com.pro.notificationservice.model.NotificationType;
import com.pro.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<Page<NotificationDTO>> getAllNotifications(Pageable pageable) {
        return ResponseEntity.ok(notificationService.getAllNotifications(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<Page<NotificationDTO>> searchNotificationsByEmail(
            @RequestParam String email, 
            Pageable pageable) {
        return ResponseEntity.ok(notificationService.getNotificationsByEmail(email, pageable));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<Page<NotificationDTO>> getNotificationsByStatus(
            @PathVariable NotificationStatus status, 
            Pageable pageable) {
        return ResponseEntity.ok(notificationService.getNotificationsByStatus(status, pageable));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<Page<NotificationDTO>> getNotificationsByType(
            @PathVariable NotificationType type, 
            Pageable pageable) {
        return ResponseEntity.ok(notificationService.getNotificationsByType(type, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<NotificationDTO> createNotification(@Valid @RequestBody CreateNotificationDTO createDTO) {
        NotificationDTO createdNotification = notificationService.createNotification(createDTO);
        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
} 