package com.pro.appointmentschedulingservice.service;

import com.pro.appointmentschedulingservice.dto.AppointmentDTO;
import com.pro.appointmentschedulingservice.dto.CreateAppointmentDTO;
import com.pro.appointmentschedulingservice.dto.UpdateAppointmentDTO;
import com.pro.appointmentschedulingservice.exception.ResourceNotFoundException;
import com.pro.appointmentschedulingservice.mapper.AppointmentMapper;
import com.pro.appointmentschedulingservice.model.Appointment;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import com.pro.appointmentschedulingservice.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentMapper appointmentMapper;

    @InjectMocks
    private AppointmentService appointmentService;

    private CreateAppointmentDTO createAppointmentDTO;
    private UpdateAppointmentDTO updateAppointmentDTO;
    private Appointment appointment;
    private AppointmentDTO appointmentDTO;

    @BeforeEach
    void setUp() {
        createAppointmentDTO = new CreateAppointmentDTO();
        createAppointmentDTO.setPatientName("John Doe");
        createAppointmentDTO.setDoctor("Dr. Smith");
        createAppointmentDTO.setGender("Male");
        createAppointmentDTO.setDate(LocalDate.now().plusDays(1));
        createAppointmentDTO.setTime(LocalTime.of(10, 0));
        createAppointmentDTO.setMobile("1234567890");
        createAppointmentDTO.setInjury("Headache");
        createAppointmentDTO.setEmail("john.doe@example.com");
        createAppointmentDTO.setStatus(AppointmentStatus.SCHEDULED);
        createAppointmentDTO.setVisitType(VisitType.CONSULTATION);

        updateAppointmentDTO = new UpdateAppointmentDTO();
        updateAppointmentDTO.setPatientName("John Doe Updated");
        updateAppointmentDTO.setStatus(AppointmentStatus.CONFIRMED);

        appointment = Appointment.builder()
                .id(1L)
                .patientName("John Doe")
                .doctor("Dr. Smith")
                .gender("Male")
                .date(LocalDate.now().plusDays(1))
                .time(LocalTime.of(10, 0))
                .mobile("1234567890")
                .injury("Headache")
                .email("john.doe@example.com")
                .status(AppointmentStatus.SCHEDULED)
                .visitType(VisitType.CONSULTATION)
                .build();

        appointmentDTO = new AppointmentDTO();
        appointmentDTO.setId(1L);
        appointmentDTO.setPatientName("John Doe");
        appointmentDTO.setDoctor("Dr. Smith");
        appointmentDTO.setGender("Male");
        appointmentDTO.setDate(LocalDate.now().plusDays(1));
        appointmentDTO.setTime(LocalTime.of(10, 0));
        appointmentDTO.setMobile("1234567890");
        appointmentDTO.setInjury("Headache");
        appointmentDTO.setEmail("john.doe@example.com");
        appointmentDTO.setStatus(AppointmentStatus.SCHEDULED);
        appointmentDTO.setVisitType(VisitType.CONSULTATION);
    }

    @Test
    @DisplayName("getAllAppointments should return all appointments")
    void getAllAppointments_shouldReturnAllAppointments() {
        // Arrange
        List<Appointment> appointments = Arrays.asList(appointment, new Appointment());
        when(appointmentRepository.findAll()).thenReturn(appointments);
        when(appointmentMapper.toDto(any(Appointment.class))).thenReturn(appointmentDTO);

        // Act
        List<AppointmentDTO> result = appointmentService.getAllAppointments();

        // Assert
        assertThat(result).hasSize(2);
        verify(appointmentRepository).findAll();
        verify(appointmentMapper, times(2)).toDto(any(Appointment.class));
    }

    @Test
    @DisplayName("getAppointmentById should return appointment when it exists")
    void getAppointmentById_shouldReturnAppointment_whenExists() {
        // Arrange
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentMapper.toDto(appointment)).thenReturn(appointmentDTO);

        // Act
        AppointmentDTO result = appointmentService.getAppointmentById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getPatientName()).isEqualTo("John Doe");
        verify(appointmentRepository).findById(1L);
        verify(appointmentMapper).toDto(appointment);
    }

    @Test
    @DisplayName("getAppointmentById should throw exception when appointment doesn't exist")
    void getAppointmentById_shouldThrowException_whenNotExists() {
        // Arrange
        when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> appointmentService.getAppointmentById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Appointment not found with id: 999");
        verify(appointmentRepository).findById(999L);
        verify(appointmentMapper, never()).toDto(any());
    }

    @Test
    @DisplayName("createAppointment should save and return appointment")
    void createAppointment_shouldSaveAndReturnAppointment() {
        // Arrange
        when(appointmentMapper.toEntity(createAppointmentDTO)).thenReturn(appointment);
        when(appointmentRepository.save(appointment)).thenReturn(appointment);
        when(appointmentMapper.toDto(appointment)).thenReturn(appointmentDTO);

        // Act
        AppointmentDTO result = appointmentService.createAppointment(createAppointmentDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPatientName()).isEqualTo("John Doe");
        verify(appointmentMapper).toEntity(createAppointmentDTO);
        verify(appointmentRepository).save(appointment);
        verify(appointmentMapper).toDto(appointment);
    }

    @Test
    @DisplayName("updateAppointment should update and return appointment")
    void updateAppointment_shouldUpdateAndReturnAppointment() {
        // Arrange
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(appointment)).thenReturn(appointment);
        when(appointmentMapper.toDto(appointment)).thenReturn(appointmentDTO);

        // Act
        AppointmentDTO result = appointmentService.updateAppointment(1L, updateAppointmentDTO);

        // Assert
        assertThat(result).isNotNull();
        verify(appointmentRepository).findById(1L);
        verify(appointmentMapper).updateEntityFromDto(updateAppointmentDTO, appointment);
        verify(appointmentRepository).save(appointment);
        verify(appointmentMapper).toDto(appointment);
    }

    @Test
    @DisplayName("updateAppointment should throw exception when appointment doesn't exist")
    void updateAppointment_shouldThrowException_whenNotExists() {
        // Arrange
        when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> appointmentService.updateAppointment(999L, updateAppointmentDTO))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Appointment not found with id: 999");
        verify(appointmentRepository).findById(999L);
        verify(appointmentMapper, never()).updateEntityFromDto(any(), any());
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteAppointment should delete appointment when it exists")
    void deleteAppointment_shouldDeleteAppointment_whenExists() {
        // Arrange
        when(appointmentRepository.existsById(1L)).thenReturn(true);

        // Act
        appointmentService.deleteAppointment(1L);

        // Assert
        verify(appointmentRepository).existsById(1L);
        verify(appointmentRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteAppointment should throw exception when appointment doesn't exist")
    void deleteAppointment_shouldThrowException_whenNotExists() {
        // Arrange
        when(appointmentRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> appointmentService.deleteAppointment(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Appointment not found with id: 999");
        verify(appointmentRepository).existsById(999L);
        verify(appointmentRepository, never()).deleteById(any());
    }
} 