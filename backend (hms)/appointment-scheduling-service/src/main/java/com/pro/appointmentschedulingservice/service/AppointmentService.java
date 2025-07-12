package com.pro.appointmentschedulingservice.service;

import com.pro.appointmentschedulingservice.dto.AppointmentDTO;
import com.pro.appointmentschedulingservice.dto.CreateAppointmentDTO;
import com.pro.appointmentschedulingservice.dto.UpdateAppointmentDTO;
import com.pro.appointmentschedulingservice.exception.ResourceNotFoundException;
import com.pro.appointmentschedulingservice.mapper.AppointmentMapper;
import com.pro.appointmentschedulingservice.model.Appointment;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.repository.AppointmentRepository;
import com.pro.appointmentschedulingservice.service.AppointmentEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final AppointmentEventPublisher appointmentEventPublisher;

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentDTO getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }

    public AppointmentDTO createAppointment(CreateAppointmentDTO createAppointmentDTO) {
        Appointment appointment = appointmentMapper.toEntity(createAppointmentDTO);
        // Manually set the patientId to confirm the mapping is the issue
        appointment.setPatientId(createAppointmentDTO.getPatientId());
        appointment = appointmentRepository.save(appointment);
        // appointmentEventPublisher.publishAppointmentCreatedEvent(appointment);
        return appointmentMapper.toDto(appointment);
    }

    public AppointmentDTO updateAppointment(Long id, UpdateAppointmentDTO updateAppointmentDTO) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        // Track changes before updating
        Map<String, Object[]> changedFields = getChangedFields(updateAppointmentDTO, appointment);

        appointmentMapper.updateEntityFromDto(updateAppointmentDTO, appointment);
        appointment = appointmentRepository.save(appointment);
        
        if (!changedFields.isEmpty()) {
            // appointmentEventPublisher.publishAppointmentUpdatedEvent(appointment, changedFields);
        }
        
        return appointmentMapper.toDto(appointment);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        
        appointmentRepository.deleteById(id);
        // appointmentEventPublisher.publishAppointmentCancelledEvent(appointment, "Appointment deleted by user.");
    }

    public AppointmentDTO updateAppointmentStatus(Long id, AppointmentStatus newStatus, String reason) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        AppointmentStatus oldStatus = appointment.getStatus();
        if (oldStatus != newStatus) {
            appointment.setStatus(newStatus);
            appointment = appointmentRepository.save(appointment);
            // appointmentEventPublisher.publishAppointmentStatusChangedEvent(appointment, oldStatus, reason);
        }

        return appointmentMapper.toDto(appointment);
    }

    public List<AppointmentDTO> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(appointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    private Map<String, Object[]> getChangedFields(UpdateAppointmentDTO dto, Appointment entity) {
        Map<String, Object[]> changes = new HashMap<>();

        if (dto.getPatientName() != null && !dto.getPatientName().equals(entity.getPatientName())) {
            changes.put("patientName", new Object[]{entity.getPatientName(), dto.getPatientName()});
        }
        if (dto.getDoctorId() != null && !dto.getDoctorId().equals(entity.getDoctorId())) {
            changes.put("doctorId", new Object[]{entity.getDoctorId(), dto.getDoctorId()});
        }
        if (dto.getDoctor() != null && !dto.getDoctor().equals(entity.getDoctor())) {
            changes.put("doctor", new Object[]{entity.getDoctor(), dto.getDoctor()});
        }
        if (dto.getGender() != null && !dto.getGender().equals(entity.getGender())) {
            changes.put("gender", new Object[]{entity.getGender(), dto.getGender()});
        }
        if (dto.getDate() != null && !dto.getDate().equals(entity.getDate())) {
            changes.put("date", new Object[]{entity.getDate(), dto.getDate()});
        }
        if (dto.getTime() != null && !dto.getTime().equals(entity.getTime())) {
            changes.put("time", new Object[]{entity.getTime(), dto.getTime()});
        }
        if (dto.getMobile() != null && !dto.getMobile().equals(entity.getMobile())) {
            changes.put("mobile", new Object[]{entity.getMobile(), dto.getMobile()});
        }
        if (dto.getInjury() != null && !dto.getInjury().equals(entity.getInjury())) {
            changes.put("injury", new Object[]{entity.getInjury(), dto.getInjury()});
        }
        if (dto.getEmail() != null && !dto.getEmail().equals(entity.getEmail())) {
            changes.put("email", new Object[]{entity.getEmail(), dto.getEmail()});
        }
        if (dto.getStatus() != null && !dto.getStatus().equals(entity.getStatus())) {
            changes.put("status", new Object[]{entity.getStatus(), dto.getStatus()});
        }
        if (dto.getVisitType() != null && !dto.getVisitType().equals(entity.getVisitType())) {
            changes.put("visitType", new Object[]{entity.getVisitType(), dto.getVisitType()});
        }
        if (dto.getPatientId() != null && !dto.getPatientId().equals(entity.getPatientId())) {
            changes.put("patientId", new Object[]{entity.getPatientId(), dto.getPatientId()});
        }

        return changes;
    }
} 