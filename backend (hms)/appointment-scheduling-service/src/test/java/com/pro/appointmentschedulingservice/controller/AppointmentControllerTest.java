package com.pro.appointmentschedulingservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pro.appointmentschedulingservice.dto.AppointmentDTO;
import com.pro.appointmentschedulingservice.dto.CreateAppointmentDTO;
import com.pro.appointmentschedulingservice.dto.UpdateAppointmentDTO;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import com.pro.appointmentschedulingservice.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AppointmentController.class)
@ActiveProfiles("test")
class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AppointmentService appointmentService;

    private AppointmentDTO appointmentDTO;
    private CreateAppointmentDTO createAppointmentDTO;
    private UpdateAppointmentDTO updateAppointmentDTO;

    @BeforeEach
    void setUp() {
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
    }

    @Test
    @DisplayName("GET /appointments should return appointments for admin")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void getAllAppointments_shouldReturnAppointments_whenAdmin() throws Exception {
        // Arrange
        List<AppointmentDTO> appointments = Arrays.asList(appointmentDTO);
        when(appointmentService.getAllAppointments()).thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/appointments"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].patientName").value("John Doe"));

        verify(appointmentService).getAllAppointments();
    }

    @Test
    @DisplayName("GET /appointments should return appointments for doctor")
    @WithMockUser(authorities = {"ROLE_DOCTOR"})
    void getAllAppointments_shouldReturnAppointments_whenDoctor() throws Exception {
        // Arrange
        List<AppointmentDTO> appointments = Arrays.asList(appointmentDTO);
        when(appointmentService.getAllAppointments()).thenReturn(appointments);

        // Act & Assert
        mockMvc.perform(get("/appointments"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(appointmentService).getAllAppointments();
    }

    @Test
    @DisplayName("GET /appointments should be forbidden for patient")
    @WithMockUser(authorities = {"ROLE_PATIENT"})
    void getAllAppointments_shouldBeForbidden_whenPatient() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/appointments"))
                .andExpect(status().isForbidden());

        verify(appointmentService, never()).getAllAppointments();
    }

    @Test
    @DisplayName("GET /appointments/{id} should return appointment for authorized user")
    @WithMockUser(authorities = {"ROLE_PATIENT"})
    void getAppointmentById_shouldReturnAppointment_whenAuthorized() throws Exception {
        // Arrange
        when(appointmentService.getAppointmentById(1L)).thenReturn(appointmentDTO);

        // Act & Assert
        mockMvc.perform(get("/appointments/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patientName").value("John Doe"));

        verify(appointmentService).getAppointmentById(1L);
    }

    @Test
    @DisplayName("POST /appointments should create appointment for admin")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void createAppointment_shouldCreateAppointment_whenAdmin() throws Exception {
        // Arrange
        when(appointmentService.createAppointment(any(CreateAppointmentDTO.class))).thenReturn(appointmentDTO);

        // Act & Assert
        mockMvc.perform(post("/appointments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createAppointmentDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.patientName").value("John Doe"));

        verify(appointmentService).createAppointment(any(CreateAppointmentDTO.class));
    }

    @Test
    @DisplayName("POST /appointments should create appointment for patient")
    @WithMockUser(authorities = {"ROLE_PATIENT"})
    void createAppointment_shouldCreateAppointment_whenPatient() throws Exception {
        // Arrange
        when(appointmentService.createAppointment(any(CreateAppointmentDTO.class))).thenReturn(appointmentDTO);

        // Act & Assert
        mockMvc.perform(post("/appointments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createAppointmentDTO)))
                .andExpect(status().isCreated());

        verify(appointmentService).createAppointment(any(CreateAppointmentDTO.class));
    }

    @Test
    @DisplayName("POST /appointments should be forbidden for doctor")
    @WithMockUser(authorities = {"ROLE_DOCTOR"})
    void createAppointment_shouldBeForbidden_whenDoctor() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/appointments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createAppointmentDTO)))
                .andExpect(status().isForbidden());

        verify(appointmentService, never()).createAppointment(any());
    }

    @Test
    @DisplayName("PUT /appointments/{id} should update appointment for admin")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void updateAppointment_shouldUpdateAppointment_whenAdmin() throws Exception {
        // Arrange
        when(appointmentService.updateAppointment(eq(1L), any(UpdateAppointmentDTO.class))).thenReturn(appointmentDTO);

        // Act & Assert
        mockMvc.perform(put("/appointments/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateAppointmentDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(appointmentService).updateAppointment(eq(1L), any(UpdateAppointmentDTO.class));
    }

    @Test
    @DisplayName("DELETE /appointments/{id} should delete appointment for admin only")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void deleteAppointment_shouldDeleteAppointment_whenAdmin() throws Exception {
        // Arrange
        doNothing().when(appointmentService).deleteAppointment(1L);

        // Act & Assert
        mockMvc.perform(delete("/appointments/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(appointmentService).deleteAppointment(1L);
    }

    @Test
    @DisplayName("DELETE /appointments/{id} should be forbidden for patient")
    @WithMockUser(authorities = {"ROLE_PATIENT"})
    void deleteAppointment_shouldBeForbidden_whenPatient() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/appointments/1")
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(appointmentService, never()).deleteAppointment(any());
    }

    @Test
    @DisplayName("Should require authentication for all endpoints")
    void shouldRequireAuthentication() throws Exception {
        // Test GET /appointments
        mockMvc.perform(get("/appointments"))
                .andExpect(status().isUnauthorized());

        // Test GET /appointments/{id}
        mockMvc.perform(get("/appointments/1"))
                .andExpect(status().isUnauthorized());

        // Test POST /appointments
        mockMvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createAppointmentDTO)))
                .andExpect(status().isUnauthorized());

        // Test PUT /appointments/{id}
        mockMvc.perform(put("/appointments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateAppointmentDTO)))
                .andExpect(status().isUnauthorized());

        // Test DELETE /appointments/{id}
        mockMvc.perform(delete("/appointments/1"))
                .andExpect(status().isUnauthorized());
    }
} 