-- Insert comprehensive sample appointments with consistent IDs
INSERT INTO appointments (patient_id, patient_name, doctor_id, doctor, gender, appointment_date, appointment_time, mobile, injury, email, appointment_status, visit_type) VALUES
-- Current and upcoming appointments
(1, 'John Doe', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '123-456-7890', 'Annual physical examination', 'john.doe@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'),
(2, 'Jane Smith', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE + INTERVAL '2 days', '10:30:00', '234-567-8901', 'Stroke recovery follow-up', 'jane.smith@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(3, 'Mike Wilson', 4, 'Dr. Michael Brown', 'MALE', CURRENT_DATE + INTERVAL '3 days', '14:00:00', '345-678-9012', 'Neurological consultation', 'mike.wilson@email.com', 'SCHEDULED', 'CONSULTATION'),
(4, 'Sarah Johnson', 5, 'Dr. Emily Davis', 'FEMALE', CURRENT_DATE + INTERVAL '4 days', '11:15:00', '456-789-0123', 'Fever observation follow-up', 'sarah.johnson@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(5, 'David Brown', 6, 'Dr. Robert Wilson', 'MALE', CURRENT_DATE + INTERVAL '5 days', '15:30:00', '567-890-1234', 'Orthopedic consultation', 'david.brown@email.com', 'PENDING', 'CONSULTATION'),

-- Today's appointments
(6, 'Emily Davis', 7, 'Dr. Jessica Garcia', 'FEMALE', CURRENT_DATE, '08:30:00', '678-901-2345', 'Anxiety therapy session', 'emily.davis@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(7, 'Robert Clark', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE, '13:45:00', '789-012-3456', 'Post-treatment checkup', 'robert.clark@email.com', 'SCHEDULED', 'FOLLOW_UP'),
(8, 'Lisa Martinez', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE, '16:00:00', '890-123-4567', 'Chemotherapy consultation', 'lisa.martinez@email.com', 'CONFIRMED', 'CONSULTATION'),

-- Past appointments (completed and cancelled)
(1, 'John Doe', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE - INTERVAL '1 day', '09:30:00', '123-456-7890', 'Completed cardiac surgery follow-up', 'john.doe@email.com', 'COMPLETED', 'FOLLOW_UP'),
(2, 'Jane Smith', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE - INTERVAL '2 days', '11:00:00', '234-567-8901', 'Completed stroke recovery session', 'jane.smith@email.com', 'COMPLETED', 'FOLLOW_UP'),
(3, 'Mike Wilson', 4, 'Dr. Michael Brown', 'MALE', CURRENT_DATE - INTERVAL '3 days', '14:30:00', '345-678-9012', 'Patient cancelled appointment', 'mike.wilson@email.com', 'CANCELLED', 'ROUTINE_CHECKUP'),
(4, 'Sarah Johnson', 5, 'Dr. Emily Davis', 'FEMALE', CURRENT_DATE - INTERVAL '4 days', '10:15:00', '456-789-0123', 'Completed dermatology consultation', 'sarah.johnson@email.com', 'COMPLETED', 'CONSULTATION'),

-- Rescheduled appointments
(5, 'David Brown', 6, 'Dr. Robert Wilson', 'MALE', CURRENT_DATE + INTERVAL '7 days', '12:00:00', '567-890-1234', 'Rescheduled orthopedic consultation', 'david.brown@email.com', 'RESCHEDULED', 'CONSULTATION'),
(6, 'Emily Davis', 7, 'Dr. Jessica Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '8 days', '15:45:00', '678-901-2345', 'Rescheduled therapy session', 'emily.davis@email.com', 'RESCHEDULED', 'FOLLOW_UP'),

-- Additional variety of appointments
(7, 'Robert Clark', 2, 'Dr. John Smith', 'MALE', CURRENT_DATE + INTERVAL '6 days', '08:00:00', '789-012-3456', 'New patient cardiology consultation', 'robert.clark@email.com', 'SCHEDULED', 'NEW_PATIENT_VISIT'),
(8, 'Lisa Martinez', 3, 'Dr. Sarah Johnson', 'FEMALE', CURRENT_DATE + INTERVAL '9 days', '16:30:00', '890-123-4567', 'Oncology follow-up', 'lisa.martinez@email.com', 'CONFIRMED', 'FOLLOW_UP'),
(1, 'John Doe', 4, 'Dr. Michael Brown', 'MALE', CURRENT_DATE + INTERVAL '10 days', '09:45:00', '123-456-7890', 'Neurological screening', 'john.doe@email.com', 'PENDING', 'ROUTINE_CHECKUP'),
(2, 'Jane Smith', 5, 'Dr. Emily Davis', 'FEMALE', CURRENT_DATE + INTERVAL '11 days', '13:00:00', '234-567-8901', 'Emergency skin consultation', 'jane.smith@email.com', 'SCHEDULED', 'URGENT_CARE'),
(3, 'Mike Wilson', 6, 'Dr. Robert Wilson', 'MALE', CURRENT_DATE + INTERVAL '12 days', '14:15:00', '345-678-9012', 'Joint pain consultation', 'mike.wilson@email.com', 'CONFIRMED', 'CONSULTATION'),
(4, 'Sarah Johnson', 7, 'Dr. Jessica Garcia', 'FEMALE', CURRENT_DATE + INTERVAL '13 days', '11:30:00', '456-789-0123', 'Gynecological checkup', 'sarah.johnson@email.com', 'SCHEDULED', 'ROUTINE_CHECKUP'); 