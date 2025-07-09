-- V2__Insert_sample_appointments.sql
-- Insert sample appointment data for testing and development

-- Sample appointments with various statuses and visit types
INSERT INTO appointments (patient_name, doctor, gender, date, "time", mobile, injury, email, status, visit_type) VALUES

-- Scheduled appointments for today and future
('John Doe', 'Dr. Anderson', 'Male', CURRENT_DATE + 1, '09:00:00', '+1-555-0101', 'Annual checkup', 'john.doe@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'),
('Jane Smith', 'Dr. Garcia', 'Female', CURRENT_DATE + 1, '10:30:00', '+1-555-0102', 'Follow-up on blood pressure', 'jane.smith@email.com', 'CONFIRMED', 'FOLLOW_UP'),
('Mike Wilson', 'Dr. Martinez', 'Male', CURRENT_DATE + 2, '14:00:00', '+1-555-0103', 'Knee pain assessment', 'mike.wilson@email.com', 'SCHEDULED', 'CONSULTATION'),
('Sarah Johnson', 'Dr. Taylor', 'Female', CURRENT_DATE + 2, '15:30:00', '+1-555-0104', 'First pregnancy consultation', 'sarah.johnson@email.com', 'CONFIRMED', 'NEW_PATIENT_VISIT'),
('David Brown', 'Dr. Anderson', 'Male', CURRENT_DATE + 3, '11:00:00', '+1-555-0105', 'Diabetes management', 'david.brown@email.com', 'SCHEDULED', 'FOLLOW_UP'),

-- Urgent care appointments
('Emily Davis', 'Dr. Garcia', 'Female', CURRENT_DATE, '16:00:00', '+1-555-0106', 'Severe headache and fever', 'emily.davis@email.com', 'CONFIRMED', 'URGENT_CARE'),
('Robert Clark', 'Dr. Martinez', 'Male', CURRENT_DATE, '17:30:00', '+1-555-0107', 'Chest pain', 'robert.clark@email.com', 'CONFIRMED', 'URGENT_CARE'),

-- Past appointments (completed and cancelled)
('Lisa Rodriguez', 'Dr. Taylor', 'Female', CURRENT_DATE - 1, '09:30:00', '+1-555-0108', 'Post-surgery follow-up', 'lisa.rodriguez@email.com', 'COMPLETED', 'FOLLOW_UP'),
('James Miller', 'Dr. Anderson', 'Male', CURRENT_DATE - 2, '13:00:00', '+1-555-0109', 'Allergy consultation', 'james.miller@email.com', 'COMPLETED', 'CONSULTATION'),
('Maria Garcia', 'Dr. Garcia', 'Female', CURRENT_DATE - 1, '10:00:00', '+1-555-0110', 'Routine physical exam', 'maria.garcia@email.com', 'CANCELLED', 'ROUTINE_CHECKUP'),

-- More future appointments
('Thomas Anderson', 'Dr. Martinez', 'Male', CURRENT_DATE + 4, '08:30:00', '+1-555-0111', 'Back pain treatment', 'thomas.anderson@email.com', 'SCHEDULED', 'CONSULTATION'),
('Jennifer Wilson', 'Dr. Taylor', 'Female', CURRENT_DATE + 5, '14:30:00', '+1-555-0112', 'Prenatal checkup', 'jennifer.wilson@email.com', 'SCHEDULED', 'FOLLOW_UP'),
('Christopher Lee', 'Dr. Anderson', 'Male', CURRENT_DATE + 6, '10:00:00', '+1-555-0113', 'Initial consultation', 'christopher.lee@email.com', 'PENDING', 'NEW_PATIENT_VISIT'),
('Amanda Taylor', 'Dr. Garcia', 'Female', CURRENT_DATE + 7, '11:30:00', '+1-555-0114', 'Skin condition evaluation', 'amanda.taylor@email.com', 'SCHEDULED', 'CONSULTATION'),
('Daniel Moore', 'Dr. Martinez', 'Male', CURRENT_DATE + 8, '15:00:00', '+1-555-0115', 'Sports injury assessment', 'daniel.moore@email.com', 'CONFIRMED', 'CONSULTATION'),

-- Rescheduled appointments
('Jessica Brown', 'Dr. Taylor', 'Female', CURRENT_DATE + 10, '09:00:00', '+1-555-0116', 'Migraine consultation', 'jessica.brown@email.com', 'RESCHEDULED', 'CONSULTATION'),
('Kevin Davis', 'Dr. Anderson', 'Male', CURRENT_DATE + 12, '16:00:00', '+1-555-0117', 'Hypertension follow-up', 'kevin.davis@email.com', 'RESCHEDULED', 'FOLLOW_UP'),

-- Various visit types examples
('Michelle White', 'Dr. Garcia', 'Female', CURRENT_DATE + 15, '08:00:00', '+1-555-0118', 'Annual wellness exam', 'michelle.white@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'),
('Ryan Thompson', 'Dr. Martinez', 'Male', CURRENT_DATE + 16, '12:30:00', '+1-555-0119', 'New patient intake', 'ryan.thompson@email.com', 'PENDING', 'NEW_PATIENT_VISIT'),
('Laura Martinez', 'Dr. Taylor', 'Female', CURRENT_DATE + 18, '13:45:00', '+1-555-0120', 'Emergency consultation', 'laura.martinez@email.com', 'CONFIRMED', 'URGENT_CARE'),
('Steven Garcia', 'Dr. Anderson', 'Male', CURRENT_DATE + 20, '10:15:00', '+1-555-0121', 'Chronic pain management', 'steven.garcia@email.com', 'SCHEDULED', 'FOLLOW_UP'); 