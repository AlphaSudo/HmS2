package com.pro.patientmanagementservice.controller;

import com.pro.patientmanagementservice.service.StrokePredictionService;
import com.pro.patientmanagementservice.service.StrokePredictionService.StrokePredictionRequest;
import com.pro.patientmanagementservice.service.StrokePredictionService.StrokePredictionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.fasterxml.jackson.annotation.JsonProperty;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173","https://stroke-prediction-frontend.vercel.app","http://localhost:5000" })
public class StrokeAssessmentController {

    private final StrokePredictionService strokePredictionService;

    @PostMapping("/stroke-assessment")
    public ResponseEntity<StrokePredictionResponse> assessStrokeRisk(
            @Valid @RequestBody StrokeAssessmentRequest request) {
        
        log.info("Received stroke assessment request for patient");
        
        try {
            // Convert frontend request to service request
            StrokePredictionRequest serviceRequest = mapToServiceRequest(request);
            
            // Call stroke prediction service
            StrokePredictionResponse response = strokePredictionService.predictStroke(serviceRequest);
            
            log.info("Stroke assessment completed. Risk level: {}", response.getRiskLevel());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error during stroke assessment", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stroke-assessment/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Stroke Assessment Service is running");
    }

    private StrokePredictionRequest mapToServiceRequest(StrokeAssessmentRequest request) {
        return new StrokePredictionRequest(
            request.getGender(),
            request.getAge(),
            request.getHypertension(),
            request.getHeart_disease(),
            request.getEver_married(),
            request.getWork_type(),
            request.getResidence_type(),
            request.getAvg_glucose_level(),
            request.getBmi(),
            request.getSmoking_status()
        );
    }

    // Frontend Request DTO
    public static class StrokeAssessmentRequest {
        private String gender;
        private double age;
        private int hypertension;
        private int heart_disease;
        private String ever_married;
        private String work_type;
        @JsonProperty("Residence_type")
        private String Residence_type;
        private double avg_glucose_level;
        private double bmi;
        private String smoking_status;

        // Constructors
        public StrokeAssessmentRequest() {}

        // Getters and Setters
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public double getAge() { return age; }
        public void setAge(double age) { this.age = age; }

        public int getHypertension() { return hypertension; }
        public void setHypertension(int hypertension) { this.hypertension = hypertension; }

        public int getHeart_disease() { return heart_disease; }
        public void setHeart_disease(int heart_disease) { this.heart_disease = heart_disease; }

        public String getEver_married() { return ever_married; }
        public void setEver_married(String ever_married) { this.ever_married = ever_married; }

        public String getWork_type() { return work_type; }
        public void setWork_type(String work_type) { this.work_type = work_type; }

        public String getResidence_type() { return Residence_type; }
        public void setResidence_type(String Residence_type) { this.Residence_type = Residence_type; }

        public double getAvg_glucose_level() { return avg_glucose_level; }
        public void setAvg_glucose_level(double avg_glucose_level) { this.avg_glucose_level = avg_glucose_level; }

        public double getBmi() { return bmi; }
        public void setBmi(double bmi) { this.bmi = bmi; }

        public String getSmoking_status() { return smoking_status; }
        public void setSmoking_status(String smoking_status) { this.smoking_status = smoking_status; }
    }
} 