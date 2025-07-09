-- V3__Insert_additional_users.sql
-- Insert additional users with more realistic data
-- All passwords are 'password' (bcrypt encoded)

-- Additional Patients
INSERT INTO users (username, password, email) VALUES
('john.doe', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'john.doe@email.com'),
('jane.smith', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'jane.smith@email.com'),
('mike.wilson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'mike.wilson@email.com'),
('sarah.johnson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'sarah.johnson@email.com'),
('david.brown', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'david.brown@email.com'),

-- Additional Doctors
('dr.anderson', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.anderson@hms.com'),
('dr.garcia', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.garcia@hms.com'),
('dr.martinez', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.martinez@hms.com'),
('dr.taylor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'dr.taylor@hms.com'),

-- Additional Nurses
('nurse.williams', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'nurse.williams@hms.com'),
('nurse.davis', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'nurse.davis@hms.com'),

-- Additional Staff
('admin.supervisor', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'admin.supervisor@hms.com'),
('receptionist2', '$2a$10$8.IdIok2j41gmc3kI3p7o.oPRz5v4u3dJd5SROLpB5N3o52N7.exy', 'receptionist2@hms.com');

-- Insert roles for additional users
-- Patient roles (IDs 8-12)
INSERT INTO user_roles (user_id, roles) VALUES
(8, 'ROLE_PATIENT'),
(9, 'ROLE_PATIENT'),
(10, 'ROLE_PATIENT'),
(11, 'ROLE_PATIENT'),
(12, 'ROLE_PATIENT'),

-- Doctor roles (IDs 13-16)
(13, 'ROLE_DOCTOR'),
(14, 'ROLE_DOCTOR'),
(15, 'ROLE_DOCTOR'),
(16, 'ROLE_DOCTOR'),

-- Nurse roles (IDs 17-18)
(17, 'ROLE_NURSE'),
(18, 'ROLE_NURSE'),

-- Staff roles (IDs 19-20)
(19, 'ROLE_ADMIN'),
(20, 'ROLE_RECEPTIONIST');

-- Add some users with multiple roles
INSERT INTO user_roles (user_id, roles) VALUES
(13, 'ROLE_ADMIN'),  -- Dr. Anderson also has admin privileges
(19, 'ROLE_DOCTOR'); -- Admin supervisor also licensed doctor 