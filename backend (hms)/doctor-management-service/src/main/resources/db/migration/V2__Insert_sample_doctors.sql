-- Insert exactly 6 doctors matching auth database user IDs (2-7)
INSERT INTO doctors (id, first_name, last_name, email, mobile, license_number, specialization, experience_years, qualification, date_of_birth, gender, hire_date, status, consultation_fee, bio) VALUES
-- Doctor ID 2: dr.smith
(2, 'John', 'Smith', 'dr.smith@hms.com', '123-555-0201', 'LIC001', 'CARDIOLOGY', 15, 'MD, FACC', '1975-03-15', 'Male', '2010-06-01', 'ACTIVE', 250.00, 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention. Board certified with extensive experience in cardiac catheterization.'),

-- Doctor ID 3: dr.johnson
(3, 'Sarah', 'Johnson', 'dr.johnson@hms.com', '123-555-0202', 'LIC002', 'PEDIATRICS', 12, 'MD, FAAP', '1980-07-22', 'Female', '2015-09-15', 'ACTIVE', 180.00, 'Pediatrician with expertise in child development, adolescent medicine, and pediatric emergency care. Fluent in Spanish and English.'),

-- Doctor ID 4: dr.brown
(4, 'Michael', 'Brown', 'dr.brown@hms.com', '123-555-0203', 'LIC003', 'NEUROLOGY', 18, 'MD, PhD', '1970-11-08', 'Male', '2008-03-20', 'ACTIVE', 300.00, 'Neurologist specializing in stroke care, epilepsy management, and neurological disorders. Research focus on neurodegenerative diseases.'),

-- Doctor ID 5: dr.davis
(5, 'Emily', 'Davis', 'dr.davis@hms.com', '123-555-0204', 'LIC004', 'DERMATOLOGY', 10, 'MD, FAAD', '1985-01-30', 'Female', '2018-01-10', 'ACTIVE', 200.00, 'Dermatologist focused on skin cancer detection, cosmetic dermatology, and pediatric dermatology. Mohs surgery certified.'),

-- Doctor ID 6: dr.wilson
(6, 'Robert', 'Wilson', 'dr.wilson@hms.com', '123-555-0205', 'LIC005', 'ORTHOPEDICS', 20, 'MD, FAAOS', '1968-05-12', 'Male', '2005-08-25', 'ACTIVE', 350.00, 'Orthopedic surgeon with expertise in joint replacement, sports medicine, and trauma surgery. Fellowship trained in spine surgery.'),

-- Doctor ID 7: dr.garcia
(7, 'Jessica', 'Garcia', 'dr.garcia@hms.com', '123-555-0206', 'LIC006', 'GYNECOLOGY', 8, 'MD, FACOG', '1987-09-14', 'Female', '2020-02-01', 'ACTIVE', 220.00, 'Obstetrician-gynecologist specializing in high-risk pregnancies and minimally invasive surgery. Certified in robotic surgery.');

-- Reset the auto-increment sequence to start from 8 (after existing doctors 2-7)
SELECT setval(pg_get_serial_sequence('doctors', 'id'), 7, true); 