-- ================================================================
-- Doctor Management Service - Local Development Database Script
-- ================================================================
-- This script sets up the doctors database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_doctor_db -f 05-setup-doctor-database.sql
-- ================================================================
-- Create doctor database
DROP DATABASE IF EXISTS hms_doctor_db;
CREATE DATABASE hms_doctor_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS doctors CASCADE;

-- Create doctors table
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY, -- Using BIGSERIAL for auto-increment
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(50) NOT NULL 
        CHECK (specialization IN ('GENERAL_PRACTICE', 'CARDIOLOGY', 'NEUROLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 
                                   'DERMATOLOGY', 'GYNECOLOGY', 'EMERGENCY_MEDICINE', 'RADIOLOGY', 'PSYCHIATRY', 
                                   'SURGERY', 'ONCOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'PULMONOLOGY')),
    experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
    qualification VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    hire_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RETIRED', 'PROBATION')),
    consultation_fee DECIMAL(10, 2) NOT NULL CHECK (consultation_fee > 0),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert exactly 6 doctors matching auth database user IDs (2-7)
INSERT INTO doctors (id, first_name, last_name, email, mobile, license_number, specialization, experience_years, qualification, date_of_birth, gender, hire_date, status, consultation_fee, bio) VALUES
-- Doctor ID 2: dr.smith
(2, 'John', 'Smith', 'dr.smith@hms.com', '123-555-0201', 'LIC001', 'CARDIOLOGY', 15, 'MD, FACC', '1975-03-15', 'Male', '2010-06-01', 'ACTIVE', 250.00, 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention. Board certified with extensive experience in cardiac catheterization.'),

-- Doctor ID 3: dr.johnson
(3, 'Sarah', 'Johnson', 'dr.johnson@hms.com', '123-555-0202', 'LIC002', 'PEDIATRICS', 12, 'MD, FAAP', '1980-07-22', 'Female', '2015-09-15', 'ACTIVE', 180.00, 'Pediatrician with expertise in child development, adolescent medicine, and pediatric emergency care. Fluent in Spanish and English.'),

-- Doctor ID 4: dr.brown
(4, 'Michael', 'Brown', 'dr.brown@hms.com', '123-555-0203', 'LIC003', 'NEUROLOGY', 18, 'MD, PhD', '1970-11-08', 'Male', '2008-03-20', 'ACTIVE', 300.00, 'Neurologist specializing in stroke care, epilepsy management, and neurological disorders. Research focus on neurodegenerative diseases.'),

-- Doctor ID 5: dr.davis
(5, 'Emily', 'Davis', 'dr.davis@hms.com', '123-555-0204', 'LIC004', 'DERMATOLOGY', 10, 'MD, FAAD', '1985-01-30', 'Female', '2018-01-10', 'ACTIVE', 200.00, 'Dermatologist focused on skin cancer detection, cosmetic dermatology, and pediatric dermatology. Mohs surgery certified.'),

-- Doctor ID 6: dr.wilson
(6, 'Robert', 'Wilson', 'dr.wilson@hms.com', '123-555-0205', 'LIC005', 'ORTHOPEDICS', 20, 'MD, FAAOS', '1968-05-12', 'Male', '2005-08-25', 'ACTIVE', 350.00, 'Orthopedic surgeon with expertise in joint replacement, sports medicine, and trauma surgery. Fellowship trained in spine surgery.'),

-- Doctor ID 7: dr.garcia
(7, 'Jessica', 'Garcia', 'dr.garcia@hms.com', '123-555-0206', 'LIC006', 'GYNECOLOGY', 8, 'MD, FACOG', '1987-09-14', 'Female', '2020-02-01', 'ACTIVE', 220.00, 'Obstetrician-gynecologist specializing in high-risk pregnancies and minimally invasive surgery. Certified in robotic surgery.');

-- Create indexes for better performance
CREATE INDEX idx_doctors_last_name ON doctors(last_name);
CREATE INDEX idx_doctors_first_name ON doctors(first_name);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_doctors_email ON doctors(email);
CREATE INDEX idx_doctors_license_number ON doctors(license_number);
CREATE INDEX idx_doctors_hire_date ON doctors(hire_date);
CREATE INDEX idx_doctors_experience_years ON doctors(experience_years);
CREATE INDEX idx_doctors_consultation_fee ON doctors(consultation_fee);
CREATE INDEX idx_doctors_specialization_status ON doctors(specialization, status);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_doctors_updated_at();

-- Display summary
SELECT 
    'Doctors Database Setup Complete' as status,
    (SELECT COUNT(*) FROM doctors) as total_doctors;

-- Show doctors by specialization
SELECT 
    specialization,
    COUNT(*) as count,
    ROUND(AVG(consultation_fee), 2) as avg_fee
FROM doctors
WHERE status = 'ACTIVE'
GROUP BY specialization
ORDER BY specialization;

-- Show doctors by status
SELECT 
    status,
    COUNT(*) as count
FROM doctors
GROUP BY status
ORDER BY status;

-- Show experience distribution
SELECT 
    CASE 
        WHEN experience_years < 5 THEN 'Junior (0-4 years)'
        WHEN experience_years < 10 THEN 'Mid-level (5-9 years)'
        WHEN experience_years < 20 THEN 'Senior (10-19 years)'
        ELSE 'Expert (20+ years)'
    END as experience_level,
    COUNT(*) as count,
    ROUND(AVG(consultation_fee), 2) as avg_fee
FROM doctors
WHERE status = 'ACTIVE'
GROUP BY 
    CASE 
        WHEN experience_years < 5 THEN 'Junior (0-4 years)'
        WHEN experience_years < 10 THEN 'Mid-level (5-9 years)'
        WHEN experience_years < 20 THEN 'Senior (10-19 years)'
        ELSE 'Expert (20+ years)'
    END
ORDER BY MIN(experience_years);

-- Reset the auto-increment sequence to start from 8 (after existing doctors 2-7)
SELECT setval(pg_get_serial_sequence('doctors', 'id'), 7, true);

-- Show all doctors summary
SELECT 
    id,
    CONCAT(first_name, ' ', last_name) as doctor_name,
    email,
    specialization,
    experience_years,
    consultation_fee,
    hire_date,
    status
FROM doctors
ORDER BY id; 