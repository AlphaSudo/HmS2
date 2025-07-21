-- Migration for patient-management-service, based on central 03-setup-patient-database.sql

-- Drop patients table if it exists
DROP TABLE IF EXISTS patients;
-- Create patients table matching frontend requirements
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- References auth database user ID
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
    doctor_id BIGINT NOT NULL, -- References doctor database ID
    address TEXT NOT NULL,
    blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    discharge_date DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Admitted', 'Discharged', 'Under Observation')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_admission_date ON patients(admission_date);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_assigned ON patients(doctor_assigned);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
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

-- Insert exactly 8 patients matching auth database user IDs (8-15)
INSERT INTO patients (user_id, first_name, last_name, email, date_of_birth, marital_status, treatment, gender, mobile, admission_date, doctor_assigned, doctor_id, address, blood_group, discharge_date, status) VALUES
(8, 'John', 'Doe', 'john.doe@email.com', '1985-05-20', 'Married', 'Cardiac Surgery', 'Male', '123-456-7890', '2023-01-10', 'Dr. John Smith', 2, '123 Main St, City', 'A+', '2023-01-20', 'Discharged'),
(9, 'Jane', 'Smith', 'jane.smith@email.com', '1978-09-15', 'Single', 'Stroke Recovery', 'Female', '234-567-8901', '2023-02-15', 'Dr. Sarah Johnson', 3, '456 Oak Ave, City', 'B-', NULL, 'Admitted'),
(10, 'Mike', 'Wilson', 'mike.wilson@email.com', '1990-03-30', 'Married', 'Fracture Repair', 'Male', '345-678-9012', '2023-03-05', 'Dr. Michael Brown', 4, '789 Pine Rd, City', 'O+', '2023-03-15', 'Discharged'),
(11, 'Sarah', 'Johnson', 'sarah.johnson@email.com', '1965-11-01', 'Divorced', 'Fever Observation', 'Female', '456-789-0123', '2023-04-01', 'Dr. Emily Davis', 5, '101 Elm St, City', 'AB+', NULL, 'Under Observation'),
(12, 'David', 'Brown', 'david.brown@email.com', '2001-07-22', 'Single', 'Skin Allergy', 'Male', '567-890-1234', '2023-05-10', 'Dr. Robert Wilson', 6, '202 Birch Ln, City', 'A-', '2023-05-15', 'Discharged'),
(13, 'Emily', 'Davis', 'emily.davis@email.com', '1982-12-18', 'Married', 'Anxiety Therapy', 'Female', '678-901-2345', '2023-06-20', 'Dr. Jessica Garcia', 7, '303 Cedar Dr, City', 'O-', NULL, 'Admitted'),
(14, 'Robert', 'Clark', 'robert.clark@email.com', '1995-02-10', 'Single', 'Ulcer Treatment', 'Male', '789-012-3456', '2023-07-05', 'Dr. John Smith', 2, '404 Maple Ct, City', 'B+', '2023-07-12', 'Discharged'),
(15, 'Lisa', 'Martinez', 'lisa.martinez@email.com', '1959-08-05', 'Widowed', 'Chemotherapy', 'Female', '890-123-4567', '2023-08-01', 'Dr. Sarah Johnson', 3, '505 Spruce Way, City', 'AB-', NULL, 'Admitted'); 