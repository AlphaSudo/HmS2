-- ================================================================
-- Docker Initialization Script for HMS
-- ================================================================
-- This script is designed to run in Docker's postgres initialization
-- It creates databases and sets up the schema with sample data
-- ================================================================

-- Create HMS databases
CREATE DATABASE hms_auth_db;
CREATE DATABASE hms_appointment_db;

-- Setup Authentication Database
\c hms_auth_db;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Create user_roles table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    roles VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_roles_on_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert core system users
-- Password for all users is 'password' (bcrypt encoded)
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'admin@hms.com'),
('patient', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'patient@hms.com'),
('doctor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'doctor@hms.com'),
('nurse', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'nurse@hms.com'),
('receptionist', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'receptionist@hms.com'),
('labtech', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'labtech@hms.com'),
('pharmacist', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'pharmacist@hms.com');

-- Insert realistic test users
INSERT INTO users (username, password, email) VALUES
-- Patients
('john.doe', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'john.doe@email.com'),
('jane.smith', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'jane.smith@email.com'),
('mike.wilson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'mike.wilson@email.com'),
('sarah.johnson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'sarah.johnson@email.com'),
('david.brown', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'david.brown@email.com'),
('emily.davis', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'emily.davis@email.com'),
('robert.clark', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'robert.clark@email.com'),

-- Doctors
('dr.anderson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.anderson@hms.com'),
('dr.garcia', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.garcia@hms.com'),
('dr.martinez', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.martinez@hms.com'),
('dr.taylor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.taylor@hms.com'),

-- Additional staff
('nurse.williams', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'nurse.williams@hms.com'),
('nurse.davis', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'nurse.davis@hms.com'),
('admin.supervisor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'admin.supervisor@hms.com'),
('receptionist2', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'receptionist2@hms.com');

-- Insert user roles
INSERT INTO user_roles (user_id, roles) VALUES
-- Core users (IDs 1-7)
(1, 'ROLE_ADMIN'),
(2, 'ROLE_PATIENT'),
(3, 'ROLE_DOCTOR'),
(4, 'ROLE_NURSE'),
(5, 'ROLE_RECEPTIONIST'),
(6, 'ROLE_LAB_TECHNICIAN'),
(7, 'ROLE_PHARMACIST'),

-- Additional patients (IDs 8-14)
(8, 'ROLE_PATIENT'),
(9, 'ROLE_PATIENT'),
(10, 'ROLE_PATIENT'),
(11, 'ROLE_PATIENT'),
(12, 'ROLE_PATIENT'),
(13, 'ROLE_PATIENT'),
(14, 'ROLE_PATIENT'),

-- Doctors (IDs 15-18)
(15, 'ROLE_DOCTOR'),
(16, 'ROLE_DOCTOR'),
(17, 'ROLE_DOCTOR'),
(18, 'ROLE_DOCTOR'),

-- Additional nurses (IDs 19-20)
(19, 'ROLE_NURSE'),
(20, 'ROLE_NURSE'),

-- Additional staff (IDs 21-22)
(21, 'ROLE_ADMIN'),
(22, 'ROLE_RECEPTIONIST'),

-- Multiple roles for some users
(15, 'ROLE_ADMIN'),  -- Dr. Anderson also has admin privileges
(21, 'ROLE_DOCTOR'); -- Admin supervisor also licensed doctor

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_roles ON user_roles(roles);

-- Setup Appointments Database
\c hms_appointment_db;

-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS appointments CASCADE;

-- Create appointments table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
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
INSERT INTO appointments (patient_name, doctor, gender, appointment_date, appointment_time, mobile, injury, email, appointment_status, visit_type) VALUES
-- Current and upcoming appointments
('John Doe', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '+1-555-0101', 'Annual physical examination', 'john.doe@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'),
('Jane Smith', 'Dr. Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '2 days', '10:30:00', '+1-555-0102', 'First-time visit for general consultation', 'jane.smith@email.com', 'CONFIRMED', 'NEW_PATIENT_VISIT'),
('Mike Wilson', 'Dr. Martinez', 'MALE', CURRENT_DATE + INTERVAL '3 days', '14:00:00', '+1-555-0103', 'Follow-up for diabetes management', 'mike.wilson@email.com', 'SCHEDULED', 'FOLLOW_UP'),
('Sarah Johnson', 'Dr. Taylor', 'FEMALE', CURRENT_DATE + INTERVAL '4 days', '11:15:00', '+1-555-0104', 'Chest pain and shortness of breath', 'sarah.johnson@email.com', 'CONFIRMED', 'URGENT_CARE'),
('David Brown', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '5 days', '15:30:00', '+1-555-0105', 'Routine checkup and blood pressure monitoring', 'david.brown@email.com', 'PENDING', 'ROUTINE_CHECKUP'),

-- Today's appointments
('Emily Davis', 'Dr. Garcia', 'FEMALE', CURRENT_DATE, '08:30:00', '+1-555-0106', 'Consultation for skin rash', 'emily.davis@email.com', 'CONFIRMED', 'CONSULTATION'),
('Robert Clark', 'Dr. Martinez', 'MALE', CURRENT_DATE, '13:45:00', '+1-555-0107', 'Back injury from sports activity', 'robert.clark@email.com', 'SCHEDULED', 'URGENT_CARE'),
('Lisa Anderson', 'Dr. Taylor', 'FEMALE', CURRENT_DATE, '16:00:00', '+1-555-0108', 'Pregnancy consultation', 'lisa.anderson@email.com', 'CONFIRMED', 'CONSULTATION'),

-- Past appointments (completed and cancelled)
('Michael Taylor', 'Dr. Anderson', 'MALE', CURRENT_DATE - INTERVAL '1 day', '09:30:00', '+1-555-0109', 'Completed routine physical', 'michael.taylor@email.com', 'COMPLETED', 'ROUTINE_CHECKUP'),
('Jennifer Wilson', 'Dr. Garcia', 'FEMALE', CURRENT_DATE - INTERVAL '2 days', '11:00:00', '+1-555-0110', 'Completed follow-up for hypertension', 'jennifer.wilson@email.com', 'COMPLETED', 'FOLLOW_UP'),
('Christopher Lee', 'Dr. Martinez', 'MALE', CURRENT_DATE - INTERVAL '3 days', '14:30:00', '+1-555-0111', 'Patient cancelled due to scheduling conflict', 'christopher.lee@email.com', 'CANCELLED', 'NEW_PATIENT_VISIT'),
('Amanda Rodriguez', 'Dr. Taylor', 'FEMALE', CURRENT_DATE - INTERVAL '4 days', '10:15:00', '+1-555-0112', 'Completed urgent care visit', 'amanda.rodriguez@email.com', 'COMPLETED', 'URGENT_CARE'),

-- Rescheduled appointments
('Thomas Garcia', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '7 days', '12:00:00', '+1-555-0113', 'Rescheduled from previous week', 'thomas.garcia@email.com', 'RESCHEDULED', 'CONSULTATION'),
('Maria Gonzalez', 'Dr. Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '8 days', '15:45:00', '+1-555-0114', 'Rescheduled consultation for migraine', 'maria.gonzalez@email.com', 'RESCHEDULED', 'FOLLOW_UP'),

-- Additional variety of appointments
('James Martinez', 'Dr. Martinez', 'MALE', CURRENT_DATE + INTERVAL '6 days', '08:00:00', '+1-555-0115', 'New patient general examination', 'james.martinez@email.com', 'SCHEDULED', 'NEW_PATIENT_VISIT'),
('Patricia Davis', 'Dr. Taylor', 'FEMALE', CURRENT_DATE + INTERVAL '9 days', '16:30:00', '+1-555-0116', 'Follow-up for surgical recovery', 'patricia.davis@email.com', 'CONFIRMED', 'FOLLOW_UP'),
('Daniel Thompson', 'Dr. Anderson', 'MALE', CURRENT_DATE + INTERVAL '10 days', '09:45:00', '+1-555-0117', 'Consultation for joint pain', 'daniel.thompson@email.com', 'PENDING', 'CONSULTATION'),
('Karen White', 'Dr. Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '11 days', '13:00:00', '+1-555-0118', 'Emergency consultation for allergic reaction', 'karen.white@email.com', 'SCHEDULED', 'URGENT_CARE'),
('Richard Johnson', 'Dr. Martinez', 'MALE', CURRENT_DATE + INTERVAL '12 days', '14:15:00', '+1-555-0119', 'Annual health screening', 'richard.johnson@email.com', 'CONFIRMED', 'ROUTINE_CHECKUP'),
('Michelle Brown', 'Dr. Taylor', 'FEMALE', CURRENT_DATE + INTERVAL '13 days', '11:30:00', '+1-555-0120', 'First visit to establish care', 'michelle.brown@email.com', 'SCHEDULED', 'NEW_PATIENT_VISIT');

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_name ON appointments(patient_name);
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