CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    doctor VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    "time" TIME NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    injury VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    visit_type VARCHAR(255) NOT NULL
); 