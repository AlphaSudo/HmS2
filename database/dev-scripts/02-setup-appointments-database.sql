-- ================================================================
-- Appointment Scheduling Service - Local Development Database Script
-- ================================================================
-- This script sets up the appointments database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_appointment_db -f 02-setup-appointments-database.sql
-- ================================================================

-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS appointments CASCADE;

-- Create appointments table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
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

-- Insert comprehensive sample appointments
INSERT INTO appointments (patient_id, patient_name, doctor, gender, appointment_date, appointment_time, mobile, injury, email, appointment_status, visit_type) VALUES
-- Current and upcoming appointments
(1, 'John Doe', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '+1-555-0101', 'Annual physical examination', 'john.doe@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'),
(1, 'Jane Smith', 'Dr. Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '2 days', '10:30:00', '+1-555-0102', 'First-time visit for general consultation', 'jane.smith@email.com', 'CONFIRMED', 'NEW_PATIENT_VISIT'),
(1, 'Mike Wilson', 'Dr. Martinez', 'MALE', CURRENT_DATE + INTERVAL '3 days', '14:00:00', '+1-555-0103', 'Follow-up for diabetes management', 'mike.wilson@email.com', 'SCHEDULED', 'FOLLOW_UP'),
(1, 'Sarah Johnson', 'Dr. Taylor', 'FEMALE', CURRENT_DATE + INTERVAL '4 days', '11:15:00', '+1-555-0104', 'Chest pain and shortness of breath', 'sarah.johnson@email.com', 'CONFIRMED', 'URGENT_CARE'),
(1, 'David Brown', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '5 days', '15:30:00', '+1-555-0105', 'Routine checkup and blood pressure monitoring', 'david.brown@email.com', 'PENDING', 'ROUTINE_CHECKUP'),

-- Today's appointments
(1, 'Emily Davis', 'Dr. Garcia', 'FEMALE', CURRENT_DATE, '08:30:00', '+1-555-0106', 'Consultation for skin rash', 'emily.davis@email.com', 'CONFIRMED', 'CONSULTATION'),
(1, 'Robert Clark', 'Dr. Martinez', 'MALE', CURRENT_DATE, '13:45:00', '+1-555-0107', 'Back injury from sports activity', 'robert.clark@email.com', 'SCHEDULED', 'URGENT_CARE'),
(1, 'Lisa Anderson', 'Dr. Taylor', 'FEMALE', CURRENT_DATE, '16:00:00', '+1-555-0108', 'Pregnancy consultation', 'lisa.anderson@email.com', 'CONFIRMED', 'CONSULTATION'),

-- Past appointments (completed and cancelled)
(1, 'Michael Taylor', 'Dr. Anderson', 'MALE', CURRENT_DATE - INTERVAL '1 day', '09:30:00', '+1-555-0109', 'Completed routine physical', 'michael.taylor@email.com', 'COMPLETED', 'ROUTINE_CHECKUP'),
(1, 'Jennifer Wilson', 'Dr. Garcia', 'FEMALE', CURRENT_DATE - INTERVAL '2 days', '11:00:00', '+1-555-0110', 'Completed follow-up for hypertension', 'jennifer.wilson@email.com', 'COMPLETED', 'FOLLOW_UP'),
(1, 'Christopher Lee', 'Dr. Martinez', 'MALE', CURRENT_DATE - INTERVAL '3 days', '14:30:00', '+1-555-0111', 'Patient cancelled due to scheduling conflict', 'christopher.lee@email.com', 'CANCELLED', 'NEW_PATIENT_VISIT'),
(1, 'Amanda Rodriguez', 'Dr. Taylor', 'FEMALE', CURRENT_DATE - INTERVAL '4 days', '10:15:00', '+1-555-0112', 'Completed urgent care visit', 'amanda.rodriguez@email.com', 'COMPLETED', 'URGENT_CARE'),

-- Rescheduled appointments
(1, 'Thomas Garcia', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '7 days', '12:00:00', '+1-555-0113', 'Rescheduled from previous week', 'thomas.garcia@email.com', 'RESCHEDULED', 'CONSULTATION'),
(1, 'Maria Gonzalez', 'Dr. Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '8 days', '15:45:00', '+1-555-0114', 'Rescheduled consultation for migraine', 'maria.gonzalez@email.com', 'RESCHEDULED', 'FOLLOW_UP'),

-- Additional variety of appointments
(1, 'James Martinez', 'Dr. Martinez', 'MALE', CURRENT_DATE + INTERVAL '6 days', '08:00:00', '+1-555-0115', 'New patient general examination', 'james.martinez@email.com', 'SCHEDULED', 'NEW_PATIENT_VISIT'),
(1, 'Patricia Davis', 'Dr. Taylor', 'FEMALE', CURRENT_DATE + INTERVAL '9 days', '16:30:00', '+1-555-0116', 'Follow-up for surgical recovery', 'patricia.davis@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(1, 'Daniel Thompson', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '10 days', '09:45:00', '+1-555-0117', 'Consultation for joint pain', 'daniel.thompson@email.com', 'PENDING', 'CONSULTATION'),
(1, 'Karen White', 'Dr. Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '11 days', '13:00:00', '+1-555-0118', 'Emergency consultation for allergic reaction', 'karen.white@email.com', 'SCHEDULED', 'URGENT_CARE'),
(1, 'Richard Johnson', 'Dr. Martinez', 'MALE', CURRENT_DATE + INTERVAL '12 days', '14:15:00', '+1-555-0119', 'Annual health screening', 'richard.johnson@email.com', 'CONFIRMED', 'ROUTINE_CHECKUP'),
(1, 'Michelle Brown', 'Dr. Taylor', 'FEMALE', CURRENT_DATE + INTERVAL '13 days', '11:30:00', '+1-555-0120', 'First visit to establish care', 'michelle.brown@email.com', 'SCHEDULED', 'NEW_PATIENT_VISIT');

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_name ON appointments(patient_name);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(appointment_status);
CREATE INDEX idx_appointments_visit_type ON appointments(visit_type);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor, appointment_date);

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
    doctor,
    COUNT(*) as appointment_count
FROM appointments
GROUP BY doctor
ORDER BY doctor;

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