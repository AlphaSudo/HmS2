-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS appointments CASCADE;

-- Create appointments table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL, -- References patient table ID (1-8)
    patient_name VARCHAR(255) NOT NULL,
    doctor_id BIGINT NOT NULL, -- References doctor table ID (2-7)
    doctor VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    injury VARCHAR(500),
    email VARCHAR(255) NOT NULL,
    appointment_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' 
        CHECK (appointment_status IN ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING', 'RESCHEDULED')),
    visit_type VARCHAR(30) NOT NULL DEFAULT 'ROUTINE_CHECKUP' 
        CHECK (visit_type IN ('ROUTINE_CHECKUP', 'NEW_PATIENT_VISIT', 'FOLLOW_UP', 'CONSULTATION', 'URGENT_CARE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_name ON appointments(patient_name);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(appointment_status);
CREATE INDEX idx_appointments_visit_type ON appointments(visit_type);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor, appointment_date);
CREATE INDEX idx_appointments_doctor_id_date ON appointments(doctor_id, appointment_date);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointments_updated_at(); 