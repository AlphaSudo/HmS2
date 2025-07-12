package com.pro.notificationservice.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pro.notificationservice.dto.CreateNotificationDTO;
import com.pro.notificationservice.dto.NotificationDTO;
import com.pro.notificationservice.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring")
public abstract class NotificationMapper {
    
    @Autowired
    protected ObjectMapper objectMapper;
    
    public abstract NotificationDTO toDTO(Notification notification);
    
    public abstract List<NotificationDTO> toDTOList(List<Notification> notifications);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "sentAt", ignore = true)
    @Mapping(target = "deliveredAt", ignore = true)
    @Mapping(target = "retryCount", constant = "0")
    @Mapping(target = "maxRetries", constant = "3")
    @Mapping(target = "errorMessage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "templateVariables", source = "templateVariables", qualifiedByName = "mapToString")
    public abstract Notification toEntity(CreateNotificationDTO createDTO);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "sentAt", ignore = true)
    @Mapping(target = "deliveredAt", ignore = true)
    @Mapping(target = "retryCount", ignore = true)
    @Mapping(target = "maxRetries", ignore = true)
    @Mapping(target = "errorMessage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "templateVariables", source = "templateVariables", qualifiedByName = "mapToString")
    public abstract void updateEntityFromDTO(CreateNotificationDTO updateDTO, @MappingTarget Notification notification);
    
    @org.mapstruct.Named("mapToString")
    protected String mapToString(Map<String, Object> templateVariables) {
        if (templateVariables == null || templateVariables.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(templateVariables);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert template variables to JSON string", e);
        }
    }
} 