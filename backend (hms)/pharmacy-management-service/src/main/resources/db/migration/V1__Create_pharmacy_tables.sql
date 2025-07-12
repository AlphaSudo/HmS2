-- Create medications table
CREATE TABLE medications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    generic_name VARCHAR(100),
    manufacturer VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    dosage_form VARCHAR(50) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    min_stock_level INTEGER NOT NULL CHECK (min_stock_level >= 0),
    expiry_date DATE NOT NULL,
    batch_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    requires_prescription BOOLEAN NOT NULL DEFAULT false,
    side_effects TEXT,
    contraindications TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create prescriptions table
CREATE TABLE prescriptions (
    id BIGSERIAL PRIMARY KEY,
    prescription_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    doctor_id BIGINT NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    prescribed_date DATE NOT NULL,
    dispensed_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create prescription_items table
CREATE TABLE prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medication_id BIGINT NOT NULL,
    quantity_prescribed INTEGER NOT NULL CHECK (quantity_prescribed > 0),
    quantity_dispensed INTEGER CHECK (quantity_dispensed >= 0),
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    instructions TEXT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Create inventory_transactions table
CREATE TABLE inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    medication_id BIGINT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reference_number VARCHAR(50),
    supplier_name VARCHAR(100),
    notes TEXT,
    performed_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Create indexes for better performance
CREATE INDEX idx_medications_name ON medications(name);
CREATE INDEX idx_medications_category ON medications(category);
CREATE INDEX idx_medications_manufacturer ON medications(manufacturer);
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medications_expiry_date ON medications(expiry_date);
CREATE INDEX idx_medications_stock_quantity ON medications(stock_quantity);

CREATE INDEX idx_prescriptions_number ON prescriptions(prescription_number);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_prescribed_date ON prescriptions(prescribed_date);
CREATE INDEX idx_prescriptions_dispensed_date ON prescriptions(dispensed_date);

CREATE INDEX idx_prescription_items_prescription_id ON prescription_items(prescription_id);
CREATE INDEX idx_prescription_items_medication_id ON prescription_items(medication_id);
CREATE INDEX idx_prescription_items_status ON prescription_items(status);

CREATE INDEX idx_inventory_transactions_medication_id ON inventory_transactions(medication_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at);

-- Insert some sample data
INSERT INTO medications (name, generic_name, manufacturer, category, description, dosage_form, strength, unit_price, stock_quantity, min_stock_level, expiry_date, batch_number, requires_prescription, side_effects, contraindications) VALUES
('Paracetamol', 'Acetaminophen', 'PharmaCorp', 'Pain Relief', 'Effective pain reliever and fever reducer', 'Tablet', '500mg', 0.50, 1000, 100, '2025-12-31', 'PAR2024001', false, 'Nausea, skin rash in rare cases', 'Severe liver disease'),
('Amoxicillin', 'Amoxicillin', 'BioMed Inc', 'Antibiotic', 'Broad-spectrum antibiotic for bacterial infections', 'Capsule', '250mg', 1.25, 500, 50, '2025-06-30', 'AMX2024001', true, 'Diarrhea, nausea, skin rash', 'Penicillin allergy'),
('Ibuprofen', 'Ibuprofen', 'PharmaCorp', 'Pain Relief', 'Anti-inflammatory pain reliever', 'Tablet', '400mg', 0.75, 800, 80, '2026-01-15', 'IBU2024001', false, 'Stomach upset, dizziness', 'Peptic ulcer, severe heart failure'),
('Metformin', 'Metformin HCl', 'DiabetesCare', 'Diabetes', 'Type 2 diabetes management', 'Tablet', '500mg', 0.85, 600, 60, '2025-09-20', 'MET2024001', true, 'Nausea, diarrhea, metallic taste', 'Severe kidney disease, metabolic acidosis'),
('Cetirizine', 'Cetirizine HCl', 'AllergyFree', 'Antihistamine', 'Allergy and hay fever relief', 'Tablet', '10mg', 0.40, 300, 30, '2025-08-10', 'CET2024001', false, 'Drowsiness, dry mouth', 'Severe kidney disease'); 