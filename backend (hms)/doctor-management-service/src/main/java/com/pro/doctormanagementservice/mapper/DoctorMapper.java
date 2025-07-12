package com.pro.doctormanagementservice.mapper;

import com.pro.doctormanagementservice.dto.DoctorDTO;
import com.pro.doctormanagementservice.dto.CreateDoctorDTO;
import com.pro.doctormanagementservice.dto.UpdateDoctorDTO;
import com.pro.doctormanagementservice.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    DoctorMapper INSTANCE = Mappers.getMapper(DoctorMapper.class);

    @Mapping(target = "userId", source = "id")
    DoctorDTO toDto(Doctor doctor);

    @Mapping(target = "id", ignore = true) // Ignore ID as it will be auto-generated
    @Mapping(target = "createdAt", ignore = true) // Ignore as it will be auto-generated
    @Mapping(target = "updatedAt", ignore = true) // Ignore as it will be auto-generated
    Doctor toEntity(CreateDoctorDTO createDoctorDTO);

    void updateEntityFromDto(UpdateDoctorDTO updateDoctorDTO, @MappingTarget Doctor doctor);
} 