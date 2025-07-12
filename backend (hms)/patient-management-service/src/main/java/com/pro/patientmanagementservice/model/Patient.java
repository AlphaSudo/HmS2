package com.pro.patientmanagementservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    private String email;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(nullable = false)
    private String treatment;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String mobile;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "doctor_assigned", nullable = false)
    private String doctorAssigned;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @Column(nullable = false)
    private String address;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(name = "discharge_date")
    private LocalDate dischargeDate;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
} 