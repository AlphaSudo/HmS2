package com.pro.doctormanagementservice.mapper;

import com.pro.doctormanagementservice.dto.DoctorDTO;
import com.pro.doctormanagementservice.dto.CreateDoctorDTO;
import com.pro.doctormanagementservice.dto.UpdateDoctorDTO;
import com.pro.doctormanagementservice.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    DoctorMapper INSTANCE = Mappers.getMapper(DoctorMapper.class);

    DoctorDTO toDto(Doctor doctor);

    Doctor toEntity(CreateDoctorDTO createDoctorDTO);

    void updateEntityFromDto(UpdateDoctorDTO updateDoctorDTO, @MappingTarget Doctor doctor);
} 