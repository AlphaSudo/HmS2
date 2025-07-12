package com.pro.doctormanagementservice.controller;

import com.pro.doctormanagementservice.dto.DoctorDTO;
import com.pro.doctormanagementservice.dto.CreateDoctorDTO;
import com.pro.doctormanagementservice.dto.UpdateDoctorDTO;
import com.pro.doctormanagementservice.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor Management", description = "APIs for managing doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all doctors", description = "Retrieve a list of all doctors in the system")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT') or @doctorService.isDoctorOwnProfile(#id, authentication)")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT') or @doctorService.isDoctorOwnProfile(#userId, authentication)")
    public ResponseEntity<DoctorDTO> getDoctorByUserId(@PathVariable Long userId, Authentication authentication) {
        // Since doctor ID and user ID are the same, delegate to getDoctorById
        return ResponseEntity.ok(doctorService.getDoctorById(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorDTO> createDoctor(@Valid @RequestBody CreateDoctorDTO createDoctorDTO) {
        DoctorDTO createdDoctor = doctorService.createDoctor(createDoctorDTO);
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @doctorService.isDoctorOwnProfile(#id, authentication)")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @Valid @RequestBody UpdateDoctorDTO updateDoctorDTO, Authentication authentication) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, updateDoctorDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
} 