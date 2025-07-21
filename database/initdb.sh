#!/bin/bash
set -e

echo "Initializing HMS PostgreSQL database..."

# Create additional databases if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create HMS specific databases
    CREATE DATABASE hms_auth_db;
    CREATE DATABASE hms_appointments_db;
    CREATE DATABASE hms_billing_db;
    CREATE DATABASE hms_doctors_db;
    CREATE DATABASE hms_patients_db;
    CREATE DATABASE hms_pharmacy_db;
    CREATE DATABASE hms_laboratory_db;
    CREATE DATABASE hms_emergency_db;
    CREATE DATABASE hms_reports_db;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE hms_auth_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_appointments_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_billing_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_doctors_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_patients_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_pharmacy_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_laboratory_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_emergency_db TO hms_user;
    GRANT ALL PRIVILEGES ON DATABASE hms_reports_db TO hms_user;
EOSQL

echo "PostgreSQL databases initialized successfully!" 