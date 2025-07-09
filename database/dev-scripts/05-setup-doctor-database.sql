-- ================================================================
-- Doctor Management Service - Local Development Database Script
-- ================================================================
-- This script sets up the doctors database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_doctor_db -f 05-setup-doctor-database.sql
-- ================================================================

-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS doctors CASCADE;

-- Create doctors table
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
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

-- Insert comprehensive sample doctors
INSERT INTO doctors (first_name, last_name, email, mobile, license_number, specialization, experience_years, qualification, date_of_birth, gender, hire_date, status, consultation_fee, bio) VALUES
-- Senior doctors
('John', 'Smith', 'john.smith@hospital.com', '+1-555-0101', 'LIC001', 'CARDIOLOGY', 15, 'MD, FACC', '1975-03-15', 'Male', '2010-06-01', 'ACTIVE', 250.00, 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention. Board certified with extensive experience in cardiac catheterization.'),
('Sarah', 'Johnson', 'sarah.johnson@hospital.com', '+1-555-0102', 'LIC002', 'PEDIATRICS', 12, 'MD, FAAP', '1980-07-22', 'Female', '2015-09-15', 'ACTIVE', 180.00, 'Pediatrician with expertise in child development, adolescent medicine, and pediatric emergency care. Fluent in Spanish and English.'),
('Michael', 'Brown', 'michael.brown@hospital.com', '+1-555-0103', 'LIC003', 'NEUROLOGY', 18, 'MD, PhD', '1970-11-08', 'Male', '2008-03-20', 'ACTIVE', 300.00, 'Neurologist specializing in stroke care, epilepsy management, and neurological disorders. Research focus on neurodegenerative diseases.'),
('Emily', 'Davis', 'emily.davis@hospital.com', '+1-555-0104', 'LIC004', 'DERMATOLOGY', 10, 'MD, FAAD', '1985-01-30', 'Female', '2018-01-10', 'ACTIVE', 200.00, 'Dermatologist focused on skin cancer detection, cosmetic dermatology, and pediatric dermatology. Mohs surgery certified.'),
('Robert', 'Wilson', 'robert.wilson@hospital.com', '+1-555-0105', 'LIC005', 'ORTHOPEDICS', 20, 'MD, FAAOS', '1968-05-12', 'Male', '2005-08-25', 'ACTIVE', 350.00, 'Orthopedic surgeon with expertise in joint replacement, sports medicine, and trauma surgery. Fellowship trained in spine surgery.'),

-- Mid-career doctors
('Jessica', 'Garcia', 'jessica.garcia@hospital.com', '+1-555-0106', 'LIC006', 'GYNECOLOGY', 8, 'MD, FACOG', '1987-09-14', 'Female', '2020-02-01', 'ACTIVE', 220.00, 'Obstetrician-gynecologist specializing in high-risk pregnancies and minimally invasive surgery. Certified in robotic surgery.'),
('David', 'Martinez', 'david.martinez@hospital.com', '+1-555-0107', 'LIC007', 'EMERGENCY_MEDICINE', 7, 'MD, FACEP', '1988-12-03', 'Male', '2021-05-15', 'ACTIVE', 280.00, 'Emergency medicine physician with trauma certification and critical care experience. ACLS and PALS instructor.'),
('Lisa', 'Anderson', 'lisa.anderson@hospital.com', '+1-555-0108', 'LIC008', 'PSYCHIATRY', 9, 'MD, Psychiatry Residency', '1984-04-18', 'Female', '2019-03-10', 'ACTIVE', 190.00, 'Psychiatrist specializing in adult and adolescent mental health, anxiety disorders, and cognitive behavioral therapy.'),
('Christopher', 'Taylor', 'christopher.taylor@hospital.com', '+1-555-0109', 'LIC009', 'RADIOLOGY', 11, 'MD, Fellowship Radiology', '1982-08-26', 'Male', '2017-11-20', 'ACTIVE', 240.00, 'Radiologist with subspecialty training in interventional radiology and diagnostic imaging. Expert in CT and MRI interpretation.'),
('Amanda', 'Rodriguez', 'amanda.rodriguez@hospital.com', '+1-555-0110', 'LIC010', 'ONCOLOGY', 6, 'MD, Hematology-Oncology Fellowship', '1989-02-07', 'Female', '2022-01-08', 'ACTIVE', 320.00, 'Medical oncologist specializing in breast cancer, lung cancer, and immunotherapy treatments. Clinical research experience.'),

-- Junior doctors and residents
('Kevin', 'Lee', 'kevin.lee@hospital.com', '+1-555-0111', 'LIC011', 'GENERAL_PRACTICE', 3, 'MD, Family Medicine Residency', '1992-06-11', 'Male', '2023-07-01', 'ACTIVE', 150.00, 'Family medicine physician providing comprehensive primary care for all ages. Interest in preventive medicine and community health.'),
('Maria', 'Gonzalez', 'maria.gonzalez@hospital.com', '+1-555-0112', 'LIC012', 'ENDOCRINOLOGY', 4, 'MD, Endocrinology Fellowship', '1991-10-19', 'Female', '2023-09-15', 'ACTIVE', 210.00, 'Endocrinologist specializing in diabetes management, thyroid disorders, and hormone replacement therapy.'),
('James', 'Thompson', 'james.thompson@hospital.com', '+1-555-0113', 'LIC013', 'GASTROENTEROLOGY', 5, 'MD, GI Fellowship', '1990-03-25', 'Male', '2022-08-12', 'ACTIVE', 230.00, 'Gastroenterologist with expertise in inflammatory bowel disease, liver disorders, and therapeutic endoscopy.'),
('Rachel', 'White', 'rachel.white@hospital.com', '+1-555-0114', 'LIC014', 'PULMONOLOGY', 4, 'MD, Pulmonology Fellowship', '1991-12-09', 'Female', '2023-04-03', 'ACTIVE', 200.00, 'Pulmonologist specializing in asthma, COPD, and sleep disorders. Critical care medicine training.'),

-- Part-time and special status doctors
('Thomas', 'Clark', 'thomas.clark@hospital.com', '+1-555-0115', 'LIC015', 'SURGERY', 25, 'MD, FACS', '1965-07-14', 'Male', '2000-01-15', 'ON_LEAVE', 400.00, 'General surgeon on medical leave, expected to return next month. Specializes in trauma surgery and emergency procedures.'),
('Patricia', 'Miller', 'patricia.miller@hospital.com', '+1-555-0116', 'LIC016', 'CARDIOLOGY', 30, 'MD, FACC, FSCAI', '1960-11-28', 'Female', '1995-05-10', 'RETIRED', 300.00, 'Recently retired cardiologist, available for consultations. Pioneer in women''s cardiac health and preventive cardiology.'),
('Daniel', 'Moore', 'daniel.moore@hospital.com', '+1-555-0117', 'LIC017', 'GENERAL_PRACTICE', 1, 'MD, Recent Graduate', '1994-08-16', 'Male', '2024-07-01', 'PROBATION', 120.00, 'Recent medical school graduate in probationary period. Supervised practice in family medicine and primary care.');

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

-- Show active doctors summary
SELECT 
    CONCAT(first_name, ' ', last_name) as doctor_name,
    specialization,
    experience_years,
    consultation_fee,
    hire_date
FROM doctors
WHERE status = 'ACTIVE'
ORDER BY specialization, last_name; 