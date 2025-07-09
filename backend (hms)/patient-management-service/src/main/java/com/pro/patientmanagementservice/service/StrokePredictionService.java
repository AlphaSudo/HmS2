package com.pro.patientmanagementservice.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StrokePredictionService {

    @Value("${stroke.prediction.service.url:http://localhost:8090}")
    private String strokeServiceUrl;

    @Value("${stroke.prediction.use.discovery:false}")
    private boolean useServiceDiscovery;

    private final RestTemplate restTemplate;
    private final DiscoveryClient discoveryClient;

    public StrokePredictionResponse predictStroke(StrokePredictionRequest request) {
        try {
            String url = buildServiceUrl();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<StrokePredictionRequest> entity = new HttpEntity<>(request, headers);
            
            log.info("Sending stroke prediction request to: {} (discovery: {})", url, useServiceDiscovery);
            
            ResponseEntity<StrokePredictionResponse> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                StrokePredictionResponse.class
            );
            
            StrokePredictionResponse result = response.getBody();
            if (result != null) {
                log.info("Stroke prediction completed. Risk level: {}", result.getRiskLevel());
                return result;
            } else {
                throw new RuntimeException("Empty response from stroke prediction service");
            }
            
        } catch (Exception e) {
            log.error("Error calling stroke prediction service", e);
            throw new RuntimeException("Failed to get stroke prediction: " + e.getMessage());
        }
    }

    private String buildServiceUrl() {
        if (useServiceDiscovery) {
            // Use service discovery to find the stroke prediction service
            try {
                List<ServiceInstance> instances = discoveryClient.getInstances("stroke-prediction-service");
                if (instances.isEmpty()) {
                    log.warn("No stroke-prediction-service instances found via discovery, falling back to direct URL");
                    return strokeServiceUrl + "/predict";
                }
                
                // Get the first available instance (no load balancing)
                ServiceInstance instance = instances.get(0);
                String discoveredUrl = instance.getUri().toString();
                log.info("Found stroke-prediction-service at: {}", discoveredUrl);
                return discoveredUrl + "/predict";
                
            } catch (Exception e) {
                log.error("Error discovering stroke-prediction-service, falling back to direct URL: {}", e.getMessage());
                return strokeServiceUrl + "/predict";
            }
        } else {
            // Use direct URL (simple approach)
            return strokeServiceUrl + "/predict";
        }
    }

    // DTO Classes
    public static class StrokePredictionRequest {
        private String gender;
        private double age;
        private int hypertension;
        @JsonProperty("heart_disease")
        private int heartDisease;
        @JsonProperty("ever_married")
        private String everMarried;
        @JsonProperty("work_type")
        private String workType;
        @JsonProperty("Residence_type")
        private String residenceType;
        @JsonProperty("avg_glucose_level")
        private double avgGlucoseLevel;
        private double bmi;
        @JsonProperty("smoking_status")
        private String smokingStatus;

        // Constructors
        public StrokePredictionRequest() {}

        public StrokePredictionRequest(String gender, double age, int hypertension, 
                                     int heartDisease, String everMarried, String workType, 
                                     String residenceType, double avgGlucoseLevel, 
                                     double bmi, String smokingStatus) {
            this.gender = gender;
            this.age = age;
            this.hypertension = hypertension;
            this.heartDisease = heartDisease;
            this.everMarried = everMarried;
            this.workType = workType;
            this.residenceType = residenceType;
            this.avgGlucoseLevel = avgGlucoseLevel;
            this.bmi = bmi;
            this.smokingStatus = smokingStatus;
        }

        // Getters and Setters
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public double getAge() { return age; }
        public void setAge(double age) { this.age = age; }

        public int getHypertension() { return hypertension; }
        public void setHypertension(int hypertension) { this.hypertension = hypertension; }

        public int getHeartDisease() { return heartDisease; }
        public void setHeartDisease(int heartDisease) { this.heartDisease = heartDisease; }

        public String getEverMarried() { return everMarried; }
        public void setEverMarried(String everMarried) { this.everMarried = everMarried; }

        public String getWorkType() { return workType; }
        public void setWorkType(String workType) { this.workType = workType; }

        public String getResidenceType() { return residenceType; }
        public void setResidenceType(String residenceType) { this.residenceType = residenceType; }

        public double getAvgGlucoseLevel() { return avgGlucoseLevel; }
        public void setAvgGlucoseLevel(double avgGlucoseLevel) { this.avgGlucoseLevel = avgGlucoseLevel; }

        public double getBmi() { return bmi; }
        public void setBmi(double bmi) { this.bmi = bmi; }

        public String getSmokingStatus() { return smokingStatus; }
        public void setSmokingStatus(String smokingStatus) { this.smokingStatus = smokingStatus; }
    }

    public static class StrokePredictionResponse {
        @JsonProperty("stroke_risk")
        private int strokeRisk;
        private double probability;
        @JsonProperty("risk_level")
        private String riskLevel;
        @JsonProperty("patient_id")
        private Long patientId;
        @JsonProperty("prediction_timestamp")
        private String predictionTimestamp;

        // Constructors
        public StrokePredictionResponse() {}

        public StrokePredictionResponse(int strokeRisk, double probability, String riskLevel, 
                                      Long patientId, String predictionTimestamp) {
            this.strokeRisk = strokeRisk;
            this.probability = probability;
            this.riskLevel = riskLevel;
            this.patientId = patientId;
            this.predictionTimestamp = predictionTimestamp;
        }

        // Getters and Setters
        public int getStrokeRisk() { return strokeRisk; }
        public void setStrokeRisk(int strokeRisk) { this.strokeRisk = strokeRisk; }

        public double getProbability() { return probability; }
        public void setProbability(double probability) { this.probability = probability; }

        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }

        public String getPredictionTimestamp() { return predictionTimestamp; }
        public void setPredictionTimestamp(String predictionTimestamp) { this.predictionTimestamp = predictionTimestamp; }
    }
} 