-- ================================================================
-- Local Development Database Creation Script
-- ================================================================
-- This script creates the databases needed for local HMS development
-- Run as PostgreSQL superuser: psql -U postgres -f 00-create-databases.sql
-- ================================================================

 -- Create authentication database
DROP DATABASE IF EXISTS hms_auth_db;
CREATE DATABASE hms_auth_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create appointment database
DROP DATABASE IF EXISTS hms_appointment_db;
CREATE DATABASE hms_appointment_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1; 

/* -- Create doctor database
DROP DATABASE IF EXISTS hms_doctor_db;
CREATE DATABASE hms_doctor_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
 */
/* -- Create patient database
DROP DATABASE IF EXISTS hms_patient_db;
CREATE DATABASE hms_patient_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
 */
-- Create EHR database
/* DROP DATABASE IF EXISTS hms_ehr_db;
CREATE DATABASE hms_ehr_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create billing database
DROP DATABASE IF EXISTS hms_billing_db;
CREATE DATABASE hms_billing_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1; */

-- Create pharmacy database
/* DROP DATABASE IF EXISTS hms_pharmacy_db;
CREATE DATABASE hms_pharmacy_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1; */

-- Display created databases
SELECT 
    'HMS Local Development Databases Created Successfully' as status;

-- Show all HMS databases
SELECT 
    datname as database_name,
    pg_encoding_to_char(encoding) as encoding,
    datcollate as collation
FROM pg_database 
WHERE datname IN ('hms_auth_db', 'hms_appointment_db', 'hms_doctor_db', 'hms_patient_db', 'hms_ehr_db', 'hms_billing_db', 'hms_pharmacy_db')
ORDER BY datname;