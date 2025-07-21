-- ================================================================
-- Appointment Scheduling Service - Local Development Database Script
-- ================================================================
-- This script sets up the appointments database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_appointment_db -f 02-setup-appointments-database.sql
-- ================================================================
-- Create appointment database
DROP DATABASE IF EXISTS hms_appointment_db;
CREATE DATABASE hms_appointment_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1; 

-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS appointments CASCADE;

-- Create appointments table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL, -- References patient table ID (1-8)
    patient_name VARCHAR(255) NOT NULL,
    doctor_id BIGINT NOT NULL, -- References doctor table ID (2-7)
    doctor VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    injury VARCHAR(500),
    email VARCHAR(255) NOT NULL,
    appointment_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' 
        CHECK (appointment_status IN ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING', 'RESCHEDULED')),
    visit_type VARCHAR(30) NOT NULL DEFAULT 'ROUTINE_CHECKUP' 
        CHECK (visit_type IN ('ROUTINE_CHECKUP', 'NEW_PATIENT_VISIT', 'FOLLOW_UP', 'CONSULTATION', 'URGENT_CARE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert comprehensive sample appointments with consistent IDs
INSERT INTO appointments (patient_id, patient_name, doctor_id, doctor, gender, appointment_date, appointment_time, mobile, injury, email, appointment_status, visit_type) VALUES
-- Current and upcoming appointments
(1, 'John Doe', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '123-456-7890', 'Annual physical examination', 'john.doe@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'),
(2, 'Jane Smith', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE + INTERVAL '2 days', '10:30:00', '234-567-8901', 'Stroke recovery follow-up', 'jane.smith@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(3, 'Mike Wilson', 4, 'Dr. Michael Brown', 'MALE', CURRENT_DATE + INTERVAL '3 days', '14:00:00', '345-678-9012', 'Neurological consultation', 'mike.wilson@email.com', 'SCHEDULED', 'CONSULTATION'),
(4, 'Sarah Johnson', 5, 'Dr. Emily Davis', 'FEMALE', CURRENT_DATE + INTERVAL '4 days', '11:15:00', '456-789-0123', 'Fever observation follow-up', 'sarah.johnson@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(5, 'David Brown', 6, 'Dr. Robert Wilson', 'MALE', CURRENT_DATE + INTERVAL '5 days', '15:30:00', '567-890-1234', 'Orthopedic consultation', 'david.brown@email.com', 'PENDING', 'CONSULTATION'),

-- Today's appointments
(6, 'Emily Davis', 7, 'Dr. Jessica Garcia', 'FEMALE', CURRENT_DATE, '08:30:00', '678-901-2345', 'Anxiety therapy session', 'emily.davis@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(7, 'Robert Clark', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE, '13:45:00', '789-012-3456', 'Post-treatment checkup', 'robert.clark@email.com', 'SCHEDULED', 'FOLLOW_UP'),
(8, 'Lisa Martinez', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE, '16:00:00', '890-123-4567', 'Chemotherapy consultation', 'lisa.martinez@email.com', 'CONFIRMED', 'CONSULTATION'),

-- Past appointments (completed and cancelled)
(1, 'John Doe', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE - INTERVAL '1 day', '09:30:00', '123-456-7890', 'Completed cardiac surgery follow-up', 'john.doe@email.com', 'COMPLETED', 'FOLLOW_UP'),
(2, 'Jane Smith', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE - INTERVAL '2 days', '11:00:00', '234-567-8901', 'Completed stroke recovery session', 'jane.smith@email.com', 'COMPLETED', 'FOLLOW_UP'),
(3, 'Mike Wilson', 4, 'Dr. Michael Brown', 'MALE', CURRENT_DATE - INTERVAL '3 days', '14:30:00', '345-678-9012', 'Patient cancelled appointment', 'mike.wilson@email.com', 'CANCELLED', 'ROUTINE_CHECKUP'),
(4, 'Sarah Johnson', 5, 'Dr. Emily Davis', 'FEMALE', CURRENT_DATE - INTERVAL '4 days', '10:15:00', '456-789-0123', 'Completed dermatology consultation', 'sarah.johnson@email.com', 'COMPLETED', 'CONSULTATION'),

-- Rescheduled appointments
(5, 'David Brown', 6, 'Dr. Robert Wilson', 'MALE', CURRENT_DATE + INTERVAL '7 days', '12:00:00', '567-890-1234', 'Rescheduled orthopedic consultation', 'david.brown@email.com', 'RESCHEDULED', 'CONSULTATION'),
(6, 'Emily Davis', 7, 'Dr. Jessica Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '8 days', '15:45:00', '678-901-2345', 'Rescheduled therapy session', 'emily.davis@email.com', 'RESCHEDULED', 'FOLLOW_UP'),

-- Additional variety of appointments
(7, 'Robert Clark', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE + INTERVAL '6 days', '08:00:00', '789-012-3456', 'New patient cardiology consultation', 'robert.clark@email.com', 'SCHEDULED', 'NEW_PATIENT_VISIT'),
(8, 'Lisa Martinez', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE + INTERVAL '9 days', '16:30:00', '890-123-4567', 'Oncology follow-up', 'lisa.martinez@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(1, 'John Doe', 4, 'Dr. Michael Brown', 'MALE', CURRENT_DATE + INTERVAL '10 days', '09:45:00', '123-456-7890', 'Neurological screening', 'john.doe@email.com', 'PENDING', 'ROUTINE_CHECKUP'),
(2, 'Jane Smith', 5, 'Dr. Emily Davis', 'FEMALE', CURRENT_DATE + INTERVAL '11 days', '13:00:00', '234-567-8901', 'Emergency skin consultation', 'jane.smith@email.com', 'SCHEDULED', 'URGENT_CARE'),
(3, 'Mike Wilson', 6, 'Dr. Robert Wilson', 'MALE', CURRENT_DATE + INTERVAL '12 days', '14:15:00', '345-678-9012', 'Joint pain consultation', 'mike.wilson@email.com', 'CONFIRMED', 'CONSULTATION'),
(4, 'Sarah Johnson', 7, 'Dr. Jessica Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '13 days', '11:30:00', '456-789-0123', 'Gynecological checkup', 'sarah.johnson@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP');

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_name ON appointments(patient_name);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(appointment_status);
CREATE INDEX idx_appointments_visit_type ON appointments(visit_type);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor, appointment_date);
CREATE INDEX idx_appointments_doctor_id_date ON appointments(doctor_id, appointment_date);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointments_updated_at();

-- Display summary
SELECT 
    'Appointments Database Setup Complete' as status,
    (SELECT COUNT(*) FROM appointments) as total_appointments;

-- Show appointments by status
SELECT 
    appointment_status,
    COUNT(*) as count
FROM appointments
GROUP BY appointment_status
ORDER BY appointment_status;

-- Show appointments by visit type
SELECT 
    visit_type,
    COUNT(*) as count
FROM appointments
GROUP BY visit_type
ORDER BY visit_type;

-- Show appointments by doctor
SELECT 
    doctor_id,
    doctor,
    COUNT(*) as appointment_count
FROM appointments
GROUP BY doctor_id, doctor
ORDER BY doctor_id;

-- Show appointments by patient
SELECT 
    patient_id,
    patient_name,
    COUNT(*) as appointment_count
FROM appointments
GROUP BY patient_id, patient_name
ORDER BY patient_id;

-- Show today's appointments
SELECT 
    patient_name,
    doctor,
    appointment_time,
    appointment_status,
    visit_type
FROM appointments
WHERE appointment_date = CURRENT_DATE
ORDER BY appointment_time; 