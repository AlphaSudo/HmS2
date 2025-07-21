-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS doctors CASCADE;

-- Create doctors table
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY, -- Using BIGSERIAL for auto-increment
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(50) NOT NULL 
        CHECK (specialization IN ('GENERAL_PRACTICE', 'CARDIOLOGY', 'NEUROLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 
                                   'DERMATOLOGY', 'GYNECOLOGY', 'EMERGENCY_MEDICINE', 'RADIOLOGY', 'PSYCHIATRY', 
                                   'SURGERY', 'ONCOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'PULMONOLOGY')),
    experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
    qualification VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    hire_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RETIRED', 'PROBATION')),
    consultation_fee DECIMAL(10, 2) NOT NULL CHECK (consultation_fee > 0),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_doctors_last_name ON doctors(last_name);
CREATE INDEX idx_doctors_first_name ON doctors(first_name);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_doctors_email ON doctors(email);
CREATE INDEX idx_doctors_license_number ON doctors(license_number);
CREATE INDEX idx_doctors_hire_date ON doctors(hire_date);
CREATE INDEX idx_doctors_experience_years ON doctors(experience_years);
CREATE INDEX idx_doctors_consultation_fee ON doctors(consultation_fee);
CREATE INDEX idx_doctors_specialization_status ON doctors(specialization, status);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_doctors_updated_at(); 