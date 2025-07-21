-- V2__Insert_authentication_data.sql

-- Insert users with consistent IDs
-- Password for all users is 'password' (bcrypt encoded)
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'admin@hms.com'),
('dr.smith', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.smith@hms.com'),
('dr.johnson', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.johnson@hms.com'),
('dr.brown', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.brown@hms.com'),
('dr.davis', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.davis@hms.com'),
('dr.wilson', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.wilson@hms.com'),
('dr.garcia', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.garcia@hms.com'),
('john.doe', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'john.doe@email.com'),
('jane.smith', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'jane.smith@email.com'),
('mike.wilson', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'mike.wilson@email.com'),
('sarah.johnson', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'sarah.johnson@email.com'),
('david.brown', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'david.brown@email.com'),
('emily.davis', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'emily.davis@email.com'),
('robert.clark', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'robert.clark@email.com'),
('lisa.martinez', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'lisa.martinez@email.com');

-- Insert user roles
INSERT INTO user_roles (user_id, roles) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_DOCTOR'),
(3, 'ROLE_DOCTOR'),
(4, 'ROLE_DOCTOR'),
(5, 'ROLE_DOCTOR'),
(6, 'ROLE_DOCTOR'),
(7, 'ROLE_DOCTOR'),
(8, 'ROLE_PATIENT'),
(9, 'ROLE_PATIENT'),
(10, 'ROLE_PATIENT'),
(11, 'ROLE_PATIENT'),
(12, 'ROLE_PATIENT'),
(13, 'ROLE_PATIENT'),
(14, 'ROLE_PATIENT'),
(15, 'ROLE_PATIENT'); 