package com.pro.notificationservice.repository;

import com.pro.notificationservice.model.Notification;
import com.pro.notificationservice.model.NotificationStatus;
import com.pro.notificationservice.model.NotificationType;
import com.pro.notificationservice.model.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByRecipientEmailContainingIgnoreCase(String email, Pageable pageable);
    
    List<Notification> findByStatusAndRetryCountLessThanMaxRetries(NotificationStatus status, Pageable pageable);
    
    Page<Notification> findByType(NotificationType type, Pageable pageable);
    
    Page<Notification> findByStatus(NotificationStatus status, Pageable pageable);
    
    Page<Notification> findByPriority(Priority priority, Pageable pageable);
    
    Page<Notification> findBySourceService(String sourceService, Pageable pageable);
    
    Page<Notification> findByReferenceIdAndReferenceType(String referenceId, String referenceType, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.createdAt BETWEEN :startDate AND :endDate")
    Page<Notification> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate, 
                                            Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.status = :status AND n.retryCount < n.maxRetries ORDER BY n.priority DESC, n.createdAt ASC")
    List<Notification> findPendingNotificationsForRetry(@Param("status") NotificationStatus status, Pageable pageable);
    
    long countByStatusAndCreatedAtAfter(NotificationStatus status, LocalDateTime date);
} 