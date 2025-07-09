-- ================================================================
-- Authentication Service - Local Development Database Script
-- ================================================================
-- This script sets up the authentication database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_auth_db -f 01-setup-auth-database.sql
-- ================================================================

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
('admin2', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'admin2@hms.com'),
('patient', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'patient@hms.com'),
('doctor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'doctor@hms.com');

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

-- Patient user for Bob Smith (patient_id = 2)
('bob.smith', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'bob.smith@hms.com'),

-- Doctors
('dr.anderson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.anderson@hms.com'),
('dr.garcia', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.garcia@hms.com'),
('dr.martinez', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.martinez@hms.com'),
('dr.taylor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.taylor@hms.com'),

-- Additional staff
('admin.supervisor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'admin.supervisor@hms.com');

-- Insert user roles
INSERT INTO user_roles (user_id, roles) VALUES
-- Core users (IDs 1-3)
(1, 'ROLE_ADMIN'),
(2, 'ROLE_PATIENT'),
(3, 'ROLE_DOCTOR'),

-- Additional patients (IDs 4-10)
(4, 'ROLE_PATIENT'),
(5, 'ROLE_PATIENT'),
(6, 'ROLE_PATIENT'),
(7, 'ROLE_PATIENT'),
(8, 'ROLE_PATIENT'),
(9, 'ROLE_PATIENT'),
(10, 'ROLE_PATIENT'),

-- Role for Bob Smith (ID 11)
(11, 'ROLE_PATIENT'),

-- Doctors (IDs 12-15)
(12, 'ROLE_DOCTOR'),
(13, 'ROLE_DOCTOR'),
(14, 'ROLE_DOCTOR'),
(15, 'ROLE_DOCTOR'),

-- Additional staff (ID 16)
(16, 'ROLE_ADMIN'),

-- Multiple roles for some users
(12, 'ROLE_ADMIN'),  -- Dr. Anderson (ID 12) also has admin privileges
(16, 'ROLE_DOCTOR'); -- Admin supervisor (ID 16) also licensed doctor

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_roles ON user_roles(roles);

-- Display summary
SELECT 
    'Authentication Database Setup Complete' as status,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM user_roles) as total_role_assignments;

-- Show users by role
SELECT 
    ur.roles as role,
    COUNT(*) as user_count
FROM user_roles ur
GROUP BY ur.roles
ORDER BY ur.roles;