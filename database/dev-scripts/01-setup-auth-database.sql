-- ================================================================
-- Authentication Service - Local Development Database Script
-- ================================================================
-- This script sets up the authentication database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_auth_db -f 01-setup-auth-database.sql
-- ================================================================
 -- Create authentication database
DROP DATABASE IF EXISTS hms_auth_db;
CREATE DATABASE hms_auth_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
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

-- Insert users with consistent IDs
-- Password for all users is 'password' (bcrypt encoded)

-- Admin (ID 1)
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'admin@hms.com');

-- Doctors (IDs 2-7)
INSERT INTO users (username, password, email) VALUES
('dr.smith', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.smith@hms.com'),
('dr.johnson', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.johnson@hms.com'),
('dr.brown', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.brown@hms.com'),
('dr.davis', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.davis@hms.com'),
('dr.wilson', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.wilson@hms.com'),
('dr.garcia', '$2a$12$N2z1FcNWGkfCwjnSv8gV6e4ai8NL1MkW3E1b6EbyastuturrAgKCK', 'dr.garcia@hms.com');

-- Patients (IDs 8-15)
INSERT INTO users (username, password, email) VALUES
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
-- Admin (ID 1)
(1, 'ROLE_ADMIN'),

-- Doctors (IDs 2-7)
(2, 'ROLE_DOCTOR'),
(3, 'ROLE_DOCTOR'),
(4, 'ROLE_DOCTOR'),
(5, 'ROLE_DOCTOR'),
(6, 'ROLE_DOCTOR'),
(7, 'ROLE_DOCTOR'),

-- Patients (IDs 8-15)
(8, 'ROLE_PATIENT'),
(9, 'ROLE_PATIENT'),
(10, 'ROLE_PATIENT'),
(11, 'ROLE_PATIENT'),
(12, 'ROLE_PATIENT'),
(13, 'ROLE_PATIENT'),
(14, 'ROLE_PATIENT'),
(15, 'ROLE_PATIENT');

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

-- Show all users with their roles
SELECT 
    u.id,
    u.username,
    u.email,
    ur.roles
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.id;