package com.pro.doctormanagementservice.service;

import com.pro.doctormanagementservice.dto.DoctorDTO;
import com.pro.doctormanagementservice.dto.CreateDoctorDTO;
import com.pro.doctormanagementservice.dto.UpdateDoctorDTO;
import com.pro.doctormanagementservice.exception.ResourceNotFoundException;
import com.pro.doctormanagementservice.mapper.DoctorMapper;
import com.pro.doctormanagementservice.model.Doctor;
import com.pro.doctormanagementservice.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

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

    public DoctorDTO createDoctor(CreateDoctorDTO createDoctorDTO) {
        Doctor doctor = doctorMapper.toEntity(createDoctorDTO);
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
} 