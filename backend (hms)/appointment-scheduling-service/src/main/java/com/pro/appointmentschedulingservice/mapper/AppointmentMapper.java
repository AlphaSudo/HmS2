package com.pro.appointmentschedulingservice.mapper;

import com.pro.appointmentschedulingservice.dto.AppointmentDTO;
import com.pro.appointmentschedulingservice.dto.CreateAppointmentDTO;
import com.pro.appointmentschedulingservice.dto.UpdateAppointmentDTO;
import com.pro.appointmentschedulingservice.model.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    AppointmentDTO toDto(Appointment appointment);

    @Mapping(source = "patientId", target = "patientId")
    Appointment toEntity(CreateAppointmentDTO createAppointmentDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateAppointmentDTO updateAppointmentDTO, @MappingTarget Appointment appointment);
} 