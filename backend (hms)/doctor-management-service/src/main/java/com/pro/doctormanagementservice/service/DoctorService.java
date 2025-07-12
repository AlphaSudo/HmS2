package com.pro.doctormanagementservice.service;

import com.pro.doctormanagementservice.config.JwtUtils;
import com.pro.doctormanagementservice.dto.DoctorDTO;
import com.pro.doctormanagementservice.dto.CreateDoctorDTO;
import com.pro.doctormanagementservice.dto.UpdateDoctorDTO;
import com.pro.doctormanagementservice.exception.ResourceNotFoundException;
import com.pro.doctormanagementservice.mapper.DoctorMapper;
import com.pro.doctormanagementservice.model.Doctor;
import com.pro.doctormanagementservice.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    private final JwtUtils jwtUtils;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(doctorMapper::toDto)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(doctorMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    public DoctorDTO getDoctorByUserId(Long userId) {
        // Since doctor ID and user ID are the same, delegate to getDoctorById
        return getDoctorById(userId);
    }

    public DoctorDTO createDoctor(CreateDoctorDTO createDoctorDTO) {
        // Manually create the Doctor entity to avoid MapStruct ID mapping issues
        Doctor doctor = Doctor.builder()
                .firstName(createDoctorDTO.getFirstName())
                .lastName(createDoctorDTO.getLastName())
                .email(createDoctorDTO.getEmail())
                .mobile(createDoctorDTO.getMobile())
                .licenseNumber(createDoctorDTO.getLicenseNumber())
                .specialization(createDoctorDTO.getSpecialization())
                .experienceYears(createDoctorDTO.getExperienceYears())
                .qualification(createDoctorDTO.getQualification())
                .dateOfBirth(createDoctorDTO.getDateOfBirth())
                .gender(createDoctorDTO.getGender())
                .hireDate(createDoctorDTO.getHireDate())
                .status(createDoctorDTO.getStatus())
                .consultationFee(createDoctorDTO.getConsultationFee())
                .bio(createDoctorDTO.getBio())
                .build();
        
        // Let JPA auto-generate the ID and timestamps
        doctor = doctorRepository.save(doctor);
        return doctorMapper.toDto(doctor);
    }

    public DoctorDTO updateDoctor(Long id, UpdateDoctorDTO updateDoctorDTO) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        doctorMapper.updateEntityFromDto(updateDoctorDTO, doctor);
        doctor = doctorRepository.save(doctor);
        return doctorMapper.toDto(doctor);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    /**
     * Check if the authenticated user is the doctor with the given doctor ID
     * Since doctor.id now directly represents the user ID from auth service
     */
    public boolean isDoctorOwnProfile(Long doctorId, Authentication authentication) {
        try {
            Long authenticatedUserId = jwtUtils.getUserIdFromAuthentication(authentication);
            if (authenticatedUserId == null) {
                return false;
            }

            // Since doctor.id is the user ID, we can directly compare
            return Objects.equals(doctorId, authenticatedUserId);
        } catch (Exception e) {
            return false;
        }
    }
} 