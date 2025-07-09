package com.pro.notificationservice.mapper;

import com.pro.notificationservice.dto.CreateNotificationDTO;
import com.pro.notificationservice.dto.NotificationDTO;
import com.pro.notificationservice.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    
    NotificationDTO toDTO(Notification notification);
    
    List<NotificationDTO> toDTOList(List<Notification> notifications);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "sentAt", ignore = true)
    @Mapping(target = "deliveredAt", ignore = true)
    @Mapping(target = "retryCount", constant = "0")
    @Mapping(target = "maxRetries", constant = "3")
    @Mapping(target = "errorMessage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "templateVariables", ignore = true)
    Notification toEntity(CreateNotificationDTO createDTO);
    
    void updateEntityFromDTO(CreateNotificationDTO updateDTO, @MappingTarget Notification notification);
} 