-- ========================================
-- HMS Patient Service Database Setup
-- ========================================

-- Use the patient database
\c hms_patient_db;

-- Drop patients table if it exists
DROP TABLE IF EXISTS patients;
-- Create patients table matching frontend requirements
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    marital_status VARCHAR(50),
    treatment VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    mobile VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
    doctor_assigned VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    discharge_date DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Admitted', 'Discharged', 'Under Observation')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_admission_date ON patients(admission_date);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_assigned ON patients(doctor_assigned);
CREATE INDEX IF NOT EXISTS idx_patients_blood_group ON patients(blood_group);
CREATE INDEX IF NOT EXISTS idx_patients_gender ON patients(gender);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data matching frontend structure
INSERT INTO patients (first_name, last_name, email, date_of_birth, marital_status, treatment, gender, mobile, admission_date, doctor_assigned, address, blood_group, discharge_date, status) VALUES
    ('Alice', 'Johnson', 'alice.j@email.com', '1985-05-20', 'Married', 'Cardiac Surgery', 'Female', '123-456-7890', '2023-01-10', 'Dr. John Doe', '123 Main St, City', 'A+', '2023-01-20', 'Discharged'),
    ('Bob', 'Smith', 'bob.s@email.com', '1978-09-15', 'Single', 'Stroke Recovery', 'Male', '234-567-8901', '2023-02-15', 'Dr. Jane Smith', '456 Oak Ave, City', 'B-', NULL, 'Admitted'),
    ('Carol', 'Williams', 'carol.w@email.com', '1990-03-30', 'Married', 'Fracture Repair', 'Female', '345-678-9012', '2023-03-05', 'Dr. Robert Brown', '789 Pine Rd, City', 'O+', '2023-03-15', 'Discharged'),
    ('David', 'Brown', 'david.b@email.com', '1965-11-01', 'Divorced', 'Fever Observation', 'Male', '456-789-0123', '2023-04-01', 'Dr. Linda Davis', '101 Elm St, City', 'AB+', NULL, 'Under Observation'),
    ('Emma', 'Davis', 'emma.d@email.com', '2001-07-22', 'Single', 'Skin Allergy', 'Female', '567-890-1234', '2023-05-10', 'Dr. Michael Johnson', '202 Birch Ln, City', 'A-', '2023-05-15', 'Discharged'),
    ('Frank', 'Wilson', 'frank.w@email.com', '1982-12-18', 'Married', 'Anxiety Therapy', 'Male', '678-901-2345', '2023-06-20', 'Dr. Sarah Wilson', '303 Cedar Dr, City', 'O-', NULL, 'Admitted'),
    ('Grace', 'Lee', 'grace.l@email.com', '1995-02-10', 'Single', 'Ulcer Treatment', 'Female', '789-012-3456', '2023-07-05', 'Dr. David Lee', '404 Maple Ct, City', 'B+', '2023-07-12', 'Discharged'),
    ('Henry', 'White', 'henry.w@email.com', '1959-08-05', 'Widowed', 'Chemotherapy', 'Male', '890-123-4567', '2023-08-01', 'Dr. Emily White', '505 Spruce Way, City', 'AB-', NULL, 'Admitted')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    date_of_birth = EXCLUDED.date_of_birth,
    marital_status = EXCLUDED.marital_status;

-- Associate Bob Smith (patient_id=2) with his user account (user_id=11)
UPDATE patients SET user_id = 11 WHERE id = 2;

-- Grant permissions to application user (if exists)
-- Note: This assumes you have an application user for the patient service
-- DO $$ 
-- BEGIN
--     IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'patient_service_user') THEN
--         GRANT SELECT, INSERT, UPDATE, DELETE ON patients TO patient_service_user;
--         GRANT USAGE, SELECT ON SEQUENCE patients_id_seq TO patient_service_user;
--     END IF;
-- END $$; 