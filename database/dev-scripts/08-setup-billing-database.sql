-- ================================================================
-- HMS Billing Service Database Setup Script
-- ================================================================
-- This script sets up the PostgreSQL database for the HMS Billing Service
-- Run as: psql -U postgres -d hms_billing_db -f 08-setup-billing-database.sql
-- ================================================================

-- Connect to billing database
\c hms_billing_db;

-- ================================================================
-- 1. Create Billing Service Tables
-- ================================================================

-- Billing Items Master Table (for pricing and service codes)
CREATE TABLE IF NOT EXISTS billing_items_master (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- CONSULTATION, PROCEDURE, MEDICATION, LAB_TEST, ROOM_CHARGE
    unit_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Companies Table
CREATE TABLE IF NOT EXISTS insurance_companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) UNIQUE NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    default_coverage_percentage DECIMAL(5,2) DEFAULT 80.00,
    default_copay_amount DECIMAL(10,2) DEFAULT 25.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Insurance Table
CREATE TABLE IF NOT EXISTS patient_insurance (
    id SERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    policy_number VARCHAR(100) NOT NULL,
    coverage_percentage DECIMAL(5,2) DEFAULT 80.00,
    copay_amount DECIMAL(10,2) DEFAULT 25.00,
    deductible DECIMAL(10,2) DEFAULT 500.00,
    max_coverage DECIMAL(12,2) DEFAULT 100000.00,
    policy_start_date DATE,
    policy_end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, policy_number)
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    method_name VARCHAR(50) UNIQUE NOT NULL, -- CASH, CREDIT_CARD, DEBIT_CARD, INSURANCE, BANK_TRANSFER
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    processing_fee_percentage DECIMAL(5,4) DEFAULT 0.0000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 2. Insert Initial Data
-- ================================================================

-- Insert default billing items
INSERT INTO billing_items_master (item_code, description, category, unit_price) VALUES
-- Consultations
('CONS_GEN', 'General Consultation', 'CONSULTATION', 150.00),
('CONS_SPEC', 'Specialist Consultation', 'CONSULTATION', 250.00),
('CONS_EMER', 'Emergency Consultation', 'CONSULTATION', 300.00),
('CONS_FOLLOW', 'Follow-up Consultation', 'CONSULTATION', 100.00),

-- Procedures
('PROC_XRAY', 'X-Ray Imaging', 'PROCEDURE', 120.00),
('PROC_CT', 'CT Scan', 'PROCEDURE', 800.00),
('PROC_MRI', 'MRI Scan', 'PROCEDURE', 1200.00),
('PROC_ULTRA', 'Ultrasound', 'PROCEDURE', 200.00),
('PROC_ECG', 'Electrocardiogram', 'PROCEDURE', 75.00),
('PROC_ECHO', 'Echocardiogram', 'PROCEDURE', 350.00),

-- Laboratory Tests
('LAB_CBC', 'Complete Blood Count', 'LAB_TEST', 45.00),
('LAB_LFT', 'Liver Function Test', 'LAB_TEST', 80.00),
('LAB_RFT', 'Renal Function Test', 'LAB_TEST', 70.00),
('LAB_LIPID', 'Lipid Profile', 'LAB_TEST', 60.00),
('LAB_HBA1C', 'HbA1c Test', 'LAB_TEST', 55.00),
('LAB_TSH', 'Thyroid Function Test', 'LAB_TEST', 65.00),

-- Room Charges
('ROOM_GEN', 'General Ward (per day)', 'ROOM_CHARGE', 200.00),
('ROOM_PRIV', 'Private Room (per day)', 'ROOM_CHARGE', 500.00),
('ROOM_ICU', 'ICU (per day)', 'ROOM_CHARGE', 1500.00),
('ROOM_ER', 'Emergency Room (per hour)', 'ROOM_CHARGE', 100.00),

-- Medications (common ones)
('MED_PARACET', 'Paracetamol 500mg', 'MEDICATION', 15.00),
('MED_AMOXIC', 'Amoxicillin 500mg', 'MEDICATION', 35.00),
('MED_ASPIRIN', 'Aspirin 75mg', 'MEDICATION', 20.00),
('MED_METFORM', 'Metformin 500mg', 'MEDICATION', 25.00)
ON CONFLICT (item_code) DO NOTHING;

-- Insert insurance companies
INSERT INTO insurance_companies (company_name, contact_email, contact_phone, default_coverage_percentage, default_copay_amount) VALUES
('Blue Cross Blue Shield', 'claims@bcbs.com', '1-800-555-0001', 80.00, 25.00),
('Aetna Health Insurance', 'support@aetna.com', '1-800-555-0002', 75.00, 30.00),
('UnitedHealth Group', 'claims@uhg.com', '1-800-555-0003', 85.00, 20.00),
('Cigna Corporation', 'service@cigna.com', '1-800-555-0004', 70.00, 35.00),
('Humana Inc.', 'claims@humana.com', '1-800-555-0005', 80.00, 25.00),
('Kaiser Permanente', 'support@kaiser.com', '1-800-555-0006', 90.00, 15.00)
ON CONFLICT (company_name) DO NOTHING;

-- Insert payment methods
INSERT INTO payment_methods (method_name, description, processing_fee_percentage) VALUES
('CASH', 'Cash Payment', 0.0000),
('CREDIT_CARD', 'Credit Card Payment', 2.9000),
('DEBIT_CARD', 'Debit Card Payment', 1.5000),
('INSURANCE', 'Insurance Claim', 0.0000),
('BANK_TRANSFER', 'Bank Transfer', 0.5000),
('CHECK', 'Check Payment', 0.0000)
ON CONFLICT (method_name) DO NOTHING;

-- Insert sample patient insurance data for our 8 patients
INSERT INTO patient_insurance (patient_id, insurance_company_id, policy_number, coverage_percentage, copay_amount, deductible, max_coverage, policy_start_date, policy_end_date, is_active) VALUES
-- Patient 1: John Doe
(1, 1, 'BCBS-JD-20240001', 80.00, 25.00, 500.00, 100000.00, '2024-01-01', '2024-12-31', true),
-- Patient 2: Jane Smith  
(2, 2, 'AETNA-JS-20240002', 75.00, 30.00, 750.00, 150000.00, '2024-01-01', '2024-12-31', true),
-- Patient 3: Mike Wilson
(3, 3, 'UHG-MW-20240003', 85.00, 20.00, 400.00, 200000.00, '2024-01-01', '2024-12-31', true),
-- Patient 4: Sarah Johnson
(4, 4, 'CIGNA-SJ-20240004', 70.00, 35.00, 800.00, 120000.00, '2024-01-01', '2024-12-31', true),
-- Patient 5: David Brown
(5, 5, 'HUMANA-DB-20240005', 80.00, 25.00, 600.00, 175000.00, '2024-01-01', '2024-12-31', true),
-- Patient 6: Emily Davis
(6, 6, 'KAISER-ED-20240006', 90.00, 15.00, 300.00, 250000.00, '2024-01-01', '2024-12-31', true),
-- Patient 7: Robert Clark
(7, 1, 'BCBS-RC-20240007', 80.00, 25.00, 500.00, 100000.00, '2024-01-01', '2024-12-31', true),
-- Patient 8: Lisa Martinez
(8, 3, 'UHG-LM-20240008', 85.00, 20.00, 400.00, 200000.00, '2024-01-01', '2024-12-31', true)
ON CONFLICT (patient_id, policy_number) DO NOTHING;

-- ================================================================
-- 3. Create Indexes for Performance
-- ================================================================

-- Billing items indexes
CREATE INDEX IF NOT EXISTS idx_billing_items_category ON billing_items_master(category);
CREATE INDEX IF NOT EXISTS idx_billing_items_active ON billing_items_master(is_active);
CREATE INDEX IF NOT EXISTS idx_billing_items_code ON billing_items_master(item_code);

-- Insurance indexes
CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient_id ON patient_insurance(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_insurance_active ON patient_insurance(is_active);
CREATE INDEX IF NOT EXISTS idx_patient_insurance_policy ON patient_insurance(policy_number);

-- Insurance companies indexes
CREATE INDEX IF NOT EXISTS idx_insurance_companies_active ON insurance_companies(is_active);

-- ================================================================
-- 4. Create Views for Common Queries
-- ================================================================

-- Active billing items view
CREATE OR REPLACE VIEW active_billing_items AS
SELECT 
    id,
    item_code,
    description,
    category,
    unit_price,
    created_at,
    updated_at
FROM billing_items_master 
WHERE is_active = true;

-- Patient insurance with company details view
CREATE OR REPLACE VIEW patient_insurance_details AS
SELECT 
    pi.id,
    pi.patient_id,
    pi.policy_number,
    pi.coverage_percentage,
    pi.copay_amount,
    pi.deductible,
    pi.max_coverage,
    pi.policy_start_date,
    pi.policy_end_date,
    pi.is_active,
    ic.company_name,
    ic.contact_email,
    ic.contact_phone
FROM patient_insurance pi
JOIN insurance_companies ic ON pi.insurance_company_id = ic.id
WHERE pi.is_active = true AND ic.is_active = true;

-- ================================================================
-- Display Setup Completion
-- ================================================================

SELECT 'HMS Billing Service Database Setup Completed Successfully!' as status;

-- Show table information
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('billing_items_master', 'insurance_companies', 'patient_insurance', 'payment_methods')
ORDER BY tablename; 