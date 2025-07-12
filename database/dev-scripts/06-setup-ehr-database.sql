-- ================================================================
-- EHR Reports Service - Local Development Database Script
-- ================================================================
-- This script sets up the EHR database for local development
-- Run against PostgreSQL: psql -U postgres -d hms_ehr_db -f 06-setup-ehr-database.sql
-- ================================================================

-- Create a dedicated user and role for the EHR Reports Service
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'ehr_user') THEN

      CREATE ROLE ehr_user WITH LOGIN PASSWORD 'ehr_password';
   END IF;
END
$do$;

-- Create the database for the EHR Reports Service
SELECT 'CREATE DATABASE hms_ehr_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hms_ehr_db');

-- Grant all privileges on the new database to the new user
GRANT ALL PRIVILEGES ON DATABASE hms_ehr_db TO ehr_user;

-- Connect to the new database (commented out for script execution)
-- \c hms_ehr_db;

-- Grant schema permissions to the user
GRANT ALL ON SCHEMA public TO ehr_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ehr_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ehr_user;

-- Note: EHR Reports are stored in MongoDB, but we might need PostgreSQL for audit logs or metadata
-- Creating a basic audit table for EHR report access logs

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS ehr_report_audit_logs CASCADE;

-- Create EHR report audit logs table
CREATE TABLE ehr_report_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    report_id VARCHAR(255) NOT NULL,
    patient_id BIGINT NOT NULL, -- References patient table ID (1-8)
    doctor_id BIGINT, -- References doctor table ID (2-7)
    accessed_by_user_id BIGINT NOT NULL, -- References auth user ID
    accessed_by_username VARCHAR(255) NOT NULL,
    access_type VARCHAR(50) NOT NULL CHECK (access_type IN ('READ', 'CREATE', 'UPDATE', 'DELETE')),
    ip_address INET,
    user_agent TEXT,
    access_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_info JSONB
);

-- Insert sample audit log data with consistent IDs
INSERT INTO ehr_report_audit_logs (report_id, patient_id, doctor_id, accessed_by_user_id, accessed_by_username, access_type, ip_address, user_agent) VALUES
-- Admin accessing patient records
('507f1f77bcf86cd799439011', 1, 2, 1, 'admin', 'CREATE', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('507f1f77bcf86cd799439013', 3, 4, 1, 'admin', 'CREATE', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),

-- Doctors accessing their patients' records
('507f1f77bcf86cd799439012', 2, 3, 3, 'dr.johnson', 'READ', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('507f1f77bcf86cd799439014', 1, 2, 2, 'dr.smith', 'READ', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('507f1f77bcf86cd799439015', 4, 5, 5, 'dr.davis', 'CREATE', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('507f1f77bcf86cd799439016', 5, 6, 6, 'dr.wilson', 'READ', '192.168.1.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('507f1f77bcf86cd799439017', 6, 7, 7, 'dr.garcia', 'UPDATE', '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('507f1f77bcf86cd799439018', 7, 2, 2, 'dr.smith', 'READ', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('507f1f77bcf86cd799439019', 8, 3, 3, 'dr.johnson', 'READ', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Create indexes for better performance
CREATE INDEX idx_ehr_audit_report_id ON ehr_report_audit_logs(report_id);
CREATE INDEX idx_ehr_audit_patient_id ON ehr_report_audit_logs(patient_id);
CREATE INDEX idx_ehr_audit_doctor_id ON ehr_report_audit_logs(doctor_id);
CREATE INDEX idx_ehr_audit_accessed_by ON ehr_report_audit_logs(accessed_by_user_id);
CREATE INDEX idx_ehr_audit_access_type ON ehr_report_audit_logs(access_type);
CREATE INDEX idx_ehr_audit_timestamp ON ehr_report_audit_logs(access_timestamp);

-- Display summary
SELECT 
    'EHR Database Setup Complete' as status,
    (SELECT COUNT(*) FROM ehr_report_audit_logs) as total_audit_logs;

-- Show audit logs by access type
SELECT 
    access_type,
    COUNT(*) as count
FROM ehr_report_audit_logs
GROUP BY access_type
ORDER BY access_type;

-- Show audit logs by doctor
SELECT 
    doctor_id,
    accessed_by_username,
    COUNT(*) as access_count
FROM ehr_report_audit_logs
WHERE doctor_id IS NOT NULL
GROUP BY doctor_id, accessed_by_username
ORDER BY doctor_id;

-- Show recent audit logs
SELECT 
    report_id,
    patient_id,
    doctor_id,
    accessed_by_username,
    access_type,
    access_timestamp
FROM ehr_report_audit_logs
ORDER BY access_timestamp DESC
LIMIT 10; 