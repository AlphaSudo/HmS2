package com.pro.appointmentschedulingservice.repository;

import com.pro.appointmentschedulingservice.model.Appointment;
import com.pro.appointmentschedulingservice.model.AppointmentStatus;
import com.pro.appointmentschedulingservice.model.VisitType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class AppointmentRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AppointmentRepository appointmentRepository;

    private Appointment appointment;

    @BeforeEach
    void setUp() {
        appointment = Appointment.builder()
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
    }

    @Test
    @DisplayName("Should save and retrieve appointment")
    void shouldSaveAndRetrieveAppointment() {
        // Act
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Assert
        assertThat(savedAppointment).isNotNull();
        assertThat(savedAppointment.getId()).isNotNull();
        assertThat(savedAppointment.getPatientName()).isEqualTo("John Doe");
        assertThat(savedAppointment.getDoctor()).isEqualTo("Dr. Smith");
        assertThat(savedAppointment.getStatus()).isEqualTo(AppointmentStatus.SCHEDULED);
    }

    @Test
    @DisplayName("Should find appointment by id")
    void shouldFindAppointmentById() {
        // Arrange
        Appointment savedAppointment = entityManager.persistAndFlush(appointment);

        // Act
        Optional<Appointment> foundAppointment = appointmentRepository.findById(savedAppointment.getId());

        // Assert
        assertThat(foundAppointment).isPresent();
        assertThat(foundAppointment.get().getPatientName()).isEqualTo("John Doe");
    }

    @Test
    @DisplayName("Should return empty when appointment not found")
    void shouldReturnEmptyWhenAppointmentNotFound() {
        // Act
        Optional<Appointment> foundAppointment = appointmentRepository.findById(999L);

        // Assert
        assertThat(foundAppointment).isEmpty();
    }

    @Test
    @DisplayName("Should find all appointments")
    void shouldFindAllAppointments() {
        // Arrange
        Appointment appointment2 = Appointment.builder()
                .patientName("Jane Doe")
                .doctor("Dr. Johnson")
                .gender("Female")
                .date(LocalDate.now().plusDays(2))
                .time(LocalTime.of(14, 0))
                .mobile("0987654321")
                .injury("Fever")
                .email("jane.doe@example.com")
                .status(AppointmentStatus.CONFIRMED)
                .visitType(VisitType.FOLLOW_UP)
                .build();

        entityManager.persistAndFlush(appointment);
        entityManager.persistAndFlush(appointment2);

        // Act
        List<Appointment> appointments = appointmentRepository.findAll();

        // Assert
        assertThat(appointments).hasSize(2);
        assertThat(appointments).extracting(Appointment::getPatientName)
                .containsExactlyInAnyOrder("John Doe", "Jane Doe");
    }

    @Test
    @DisplayName("Should delete appointment")
    void shouldDeleteAppointment() {
        // Arrange
        Appointment savedAppointment = entityManager.persistAndFlush(appointment);

        // Act
        appointmentRepository.deleteById(savedAppointment.getId());

        // Assert
        Optional<Appointment> foundAppointment = appointmentRepository.findById(savedAppointment.getId());
        assertThat(foundAppointment).isEmpty();
    }

    @Test
    @DisplayName("Should check if appointment exists")
    void shouldCheckIfAppointmentExists() {
        // Arrange
        Appointment savedAppointment = entityManager.persistAndFlush(appointment);

        // Act & Assert
        assertThat(appointmentRepository.existsById(savedAppointment.getId())).isTrue();
        assertThat(appointmentRepository.existsById(999L)).isFalse();
    }

    @Test
    @DisplayName("Should update appointment")
    void shouldUpdateAppointment() {
        // Arrange
        Appointment savedAppointment = entityManager.persistAndFlush(appointment);

        // Act
        savedAppointment.setPatientName("John Doe Updated");
        savedAppointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment updatedAppointment = appointmentRepository.save(savedAppointment);

        // Assert
        assertThat(updatedAppointment.getPatientName()).isEqualTo("John Doe Updated");
        assertThat(updatedAppointment.getStatus()).isEqualTo(AppointmentStatus.CONFIRMED);
    }
} 