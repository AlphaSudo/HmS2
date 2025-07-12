package com.pro.pharmacymanagementservice.mapper;

import com.pro.pharmacymanagementservice.dto.CreatePrescriptionRequest;
import com.pro.pharmacymanagementservice.dto.PrescriptionDto;
import com.pro.pharmacymanagementservice.model.Prescription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PrescriptionMapper {

    PrescriptionDto toDto(Prescription prescription);

    List<PrescriptionDto> toDtoList(List<Prescription> prescriptions);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "prescriptionNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Prescription toEntity(CreatePrescriptionRequest request);
} 