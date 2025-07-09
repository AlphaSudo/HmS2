package com.pro.patientmanagementservice.mapper;

import com.pro.patientmanagementservice.dto.CreatePatientDTO;
import com.pro.patientmanagementservice.dto.PatientDTO;
import com.pro.patientmanagementservice.dto.UpdatePatientDTO;
import com.pro.patientmanagementservice.model.Patient;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    PatientDTO toPatientDTO(Patient patient);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Patient toPatient(CreatePatientDTO createPatientDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updatePatientFromDto(UpdatePatientDTO dto, @MappingTarget Patient entity);
} 