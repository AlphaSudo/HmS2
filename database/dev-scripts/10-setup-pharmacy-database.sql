-- ================================================================
-- Pharmacy Management Database Setup Script - Simplified
-- ================================================================
--create pharmacy database
DROP DATABASE IF EXISTS hms_pharmacy_db;
CREATE DATABASE hms_pharmacy_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
-- Create pharmacy database if it doesn't exist
\c postgres;
DROP DATABASE IF EXISTS hms_pharmacy_db;
CREATE DATABASE hms_pharmacy_db;

-- Connect to the pharmacy database
\c hms_pharmacy_db;

-- Create prescriptions table (ONLY TABLE AS REQUESTED)
CREATE TABLE prescriptions (
    id BIGSERIAL PRIMARY KEY,
    prescription_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL, -- References patient table ID (1-8)
    patient_name VARCHAR(100) NOT NULL,
    doctor_id BIGINT NOT NULL, -- References doctor table ID (2-7)
    doctor_name VARCHAR(100) NOT NULL,
    prescribed_date DATE NOT NULL,
    dispensed_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_prescriptions_number ON prescriptions(prescription_number);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_prescribed_date ON prescriptions(prescribed_date);
CREATE INDEX idx_prescriptions_dispensed_date ON prescriptions(dispensed_date);

-- Create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at column
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert sample prescription data with consistent IDs
INSERT INTO prescriptions (prescription_number, patient_id, patient_name, doctor_id, doctor_name, prescribed_date, status, total_amount, notes) VALUES
('RX-1704070800000-A1B2C3D4', 1, 'John Doe', 2, 'Dr. John Smith', '2024-01-15', 'DISPENSED', 15.75, 'Take as prescribed. Complete the full course.'),
('RX-1704157200000-E5F6G7H8', 2, 'Jane Smith', 3, 'Dr. Sarah Johnson', '2024-01-16', 'PENDING', 28.50, 'Stroke recovery medication. Monitor blood pressure.'),
('RX-1704243600000-I9J0K1L2', 3, 'Mike Wilson', 4, 'Dr. Michael Brown', '2024-01-17', 'PARTIALLY_DISPENSED', 12.25, 'Neurological medication. Patient allergic to penicillin. Alternative prescribed.'),
('RX-1704330000000-M3N4O5P6', 4, 'Sarah Johnson', 5, 'Dr. Emily Davis', '2024-01-18', 'DISPENSED', 6.50, 'Dermatology medication for skin condition.'),
('RX-1704416400000-Q7R8S9T0', 5, 'David Brown', 6, 'Dr. Robert Wilson', '2024-01-19', 'PENDING', 45.20, 'Orthopedic pain management prescription.'),
('RX-1704502800000-U1V2W3X4', 6, 'Emily Davis', 7, 'Dr. Jessica Garcia', '2024-01-20', 'DISPENSED', 18.90, 'Anxiety medication for therapy support.'),
('RX-1704589200000-Y5Z6A7B8', 7, 'Robert Clark', 2, 'Dr. John Smith', '2024-01-21', 'DISPENSED', 22.15, 'Post-treatment cardiac medication.'),
('RX-1704675600000-C9D0E1F2', 8, 'Lisa Martinez', 3, 'Dr. Sarah Johnson', '2024-01-22', 'PENDING', 67.30, 'Chemotherapy support medication.');

-- Display summary
SELECT 
    'Pharmacy Database Setup Complete' as status,
    (SELECT COUNT(*) FROM prescriptions) as total_prescriptions;

-- Show prescriptions by status
SELECT 
    status,
    COUNT(*) as count
FROM prescriptions
GROUP BY status
ORDER BY status;

-- Show prescriptions by doctor
SELECT 
    doctor_id,
    doctor_name,
    COUNT(*) as prescription_count
FROM prescriptions
GROUP BY doctor_id, doctor_name
ORDER BY doctor_id;

-- Show prescriptions by patient
SELECT 
    patient_id,
    patient_name,
    COUNT(*) as prescription_count
FROM prescriptions
GROUP BY patient_id, patient_name
ORDER BY patient_id; 