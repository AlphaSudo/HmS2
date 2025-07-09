package com.pro.patientmanagementservice.mapper;

import com.pro.patientmanagementservice.dto.MedicalHistoryDTO;
import com.pro.patientmanagementservice.dto.UpdateMedicalHistoryDTO;
import com.pro.patientmanagementservice.model.MedicalHistory;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface MedicalHistoryMapper {
    MedicalHistoryDTO toMedicalHistoryDTO(MedicalHistory medicalHistory);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateMedicalHistoryFromDto(UpdateMedicalHistoryDTO dto, @MappingTarget MedicalHistory entity);
} 