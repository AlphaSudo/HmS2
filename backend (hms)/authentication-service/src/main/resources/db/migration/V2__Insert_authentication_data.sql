-- V2__Insert_authentication_data.sql

-- Insert users with different roles
-- The password for all users is 'password'
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'admin@hms.com'),
('patient', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'patient@hms.com'),
('doctor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'doctor@hms.com'),
('nurse', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'nurse@hms.com'),
('receptionist', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'receptionist@hms.com'),
('labtech', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'labtech@hms.com'),
('pharmacist', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'pharmacist@hms.com');

-- Insert user roles
INSERT INTO user_roles (user_id, roles) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_PATIENT'),
(3, 'ROLE_DOCTOR'),
(4, 'ROLE_NURSE'),
(5, 'ROLE_RECEPTIONIST'),
(6, 'ROLE_LAB_TECHNICIAN'),
(7, 'ROLE_PHARMACIST'); 