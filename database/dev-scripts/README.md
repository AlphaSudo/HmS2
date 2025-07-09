# HMS Local Development Database Scripts

This directory contains standalone SQL scripts for setting up the Hospital Management System databases locally for development purposes.

## Prerequisites

- PostgreSQL 12+ installed and running locally
- PostgreSQL user with database creation privileges (typically `postgres`)
- Command line access to `psql`

## Quick Setup

### Option 1: Individual Database Setup
Run these commands in order:

```bash
# 1. Create databases
psql -U postgres -f  database/dev-scripts/00-create-databases.sql

# 2. Setup authentication database
psql -U postgres -d hms_auth_db -f database/dev-scripts/01-setup-auth-database.sql

# 3. Setup appointments database
psql -U postgres -d hms_appointment_db -f database/dev-scripts/02-setup-appointments-database.sql

#4. setup patient database
psql -U postgres -d hms_patient_db -f database/dev-scripts/03-setup-patient-database.sql

# 4. Setup doctor database
psql -U postgres -d hms_doctor_db -f database/dev-scripts/05-setup-doctor-database.sql

# 5. Setup EHR database
psql -U postgres -d hms_ehr_db -f database/dev-scripts/06-setup-ehr-database.sql

# 6. Setup billing database
psql -U postgres -d hms_billing_db -f database/dev-scripts/08-setup-billing-database.sql

# 7. Setup pharmacy database
psql -U postgres -d hms_pharmacy_db -f database/dev-scripts/10-setup-pharmacy-database.sql

#8. setup patient mongoDB
mongosh "mongodb://localhost:27017/hms_patient_db" --file "C:\Users\CM\Downloads\Compressed\Hospital Management System\database\dev-scripts\04-setup-mongodb-patient.js"
#8. setup ehr mongoDB
mongosh "mongodb://localhost:27017/hms_ehr_db" --file "C:\Users\CM\Downloads\Compressed\Hospital Management System\database\dev-scripts\07-setup-mongodb-ehr.js"
#9. setup billing mongoDB
mongosh "mongodb://localhost:27017/hms_billing_db" --file "C:\Users\CM\Downloads\Compressed\Hospital Management System\database\dev-scripts\09-setup-mongodb-billing-no-validation.js"

```

### Option 2: One-Command Setup
Run all scripts at once:

```bash
# Windows PowerShell
foreach ($script in @("00-create-databases.sql", "01-setup-auth-database.sql", "02-setup-appointments-database.sql", "05-setup-doctor-database.sql")) {
    if ($script -eq "00-create-databases.sql") {
        psql -U postgres -f $script
    } elseif ($script -eq "01-setup-auth-database.sql") {
        psql -U postgres -d hms_auth_db -f $script
    } elseif ($script -eq "02-setup-appointments-database.sql") {
        psql -U postgres -d hms_appointment_db -f $script
    } else {
        psql -U postgres -d hms_doctor_db -f $script
    }
}

# Linux/Mac
for script in 00-create-databases.sql 01-setup-auth-database.sql 02-setup-appointments-database.sql 05-setup-doctor-database.sql; do
    if [ "$script" = "00-create-databases.sql" ]; then
        psql -U postgres -f $script
    elif [ "$script" = "01-setup-auth-database.sql" ]; then
        psql -U postgres -d hms_auth_db -f $script
    elif [ "$script" = "02-setup-appointments-database.sql" ]; then
        psql -U postgres -d hms_appointment_db -f $script
    else
        psql -U postgres -d hms_doctor_db -f $script
    fi
done
```

## Script Details

### 00-create-databases.sql
- Creates `hms_auth_db`, `hms_appointment_db`, `hms_doctor_db`, `hms_patient_db`, `hms_ehr_db`, `hms_billing_db`, and `hms_pharmacy_db` databases
- Sets UTF8 encoding and appropriate collation
- Drops existing databases if they exist (clean setup)

### 01-setup-auth-database.sql
- Creates `users` and `user_roles` tables for authentication service
- Inserts 22 test users with various roles:
  - **Core users**: admin, patient, doctor, nurse, receptionist, labtech, pharmacist
  - **Additional patients**: john.doe, jane.smith, mike.wilson, sarah.johnson, david.brown, emily.davis, robert.clark
  - **Additional doctors**: dr.anderson, dr.garcia, dr.martinez, dr.taylor
  - **Additional staff**: nurse.williams, nurse.davis, admin.supervisor, receptionist2
- Password for all users: `password` (bcrypt encoded)
- Creates performance indexes
- Shows summary statistics

### 02-setup-appointments-database.sql
- Creates `appointments` table with all required columns
- Inserts 20 realistic sample appointments covering:
  - All appointment statuses (SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, PENDING, RESCHEDULED)
  - All visit types (ROUTINE_CHECKUP, NEW_PATIENT_VISIT, FOLLOW_UP, CONSULTATION, URGENT_CARE)
  - Past, present, and future appointments
  - Various doctors and realistic medical scenarios
- Creates performance indexes
- Adds automatic `updated_at` timestamp trigger
- Shows summary statistics and today's appointments

### 05-setup-doctor-database.sql
- Creates `doctors` table with comprehensive doctor information
- Inserts 17 realistic sample doctors covering:
  - All medical specializations (CARDIOLOGY, NEUROLOGY, PEDIATRICS, etc.)
  - All doctor statuses (ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED, RETIRED, PROBATION)
  - Various experience levels from recent graduates to expert physicians
  - Realistic consultation fees, qualifications, and biographical information
- Creates performance indexes for efficient queries
- Adds automatic `updated_at` timestamp trigger
- Shows summary statistics including specialization distribution and experience levels

## Sample Data Overview

### Authentication Database
- **Total Users**: 22
- **Roles Available**: ADMIN, PATIENT, DOCTOR, NURSE, RECEPTIONIST, LAB_TECHNICIAN, PHARMACIST
- **Special Users**:
  - `dr.anderson` has both DOCTOR and ADMIN roles
  - `admin.supervisor` has both ADMIN and DOCTOR roles

### Appointments Database
- **Total Appointments**: 20
- **Status Distribution**:
  - SCHEDULED: 6 appointments
  - CONFIRMED: 6 appointments
  - COMPLETED: 4 appointments
  - CANCELLED: 1 appointment
  - PENDING: 2 appointments
  - RESCHEDULED: 2 appointments
- **Doctors**: Dr. Anderson, Dr. Garcia, Dr. Martinez, Dr. Taylor
- **Time Range**: Past 4 days to future 13 days

### Doctors Database
- **Total Doctors**: 17
- **Status Distribution**:
  - ACTIVE: 14 doctors
  - ON_LEAVE: 1 doctor
  - RETIRED: 1 doctor
  - PROBATION: 1 doctor
- **Specializations**: 15 different medical specializations covered
- **Experience Range**: 1 to 30 years of experience
- **Consultation Fees**: $120 to $400

### 08-setup-billing-database.sql
- Creates billing service tables:
  - `billing_items_master`: Service codes and pricing
  - `insurance_companies`: Insurance provider information
  - `patient_insurance`: Patient insurance policies
  - `payment_methods`: Available payment methods
- Inserts comprehensive sample data:
  - **Billing Items**: 25 items across 5 categories (CONSULTATION, PROCEDURE, LAB_TEST, ROOM_CHARGE, MEDICATION)
  - **Insurance Companies**: 6 major insurance providers with realistic coverage rates
  - **Payment Methods**: 6 payment types with processing fees
- Creates performance indexes and database views
- Sets up PostgreSQL support tables for invoice management

### 09-setup-mongodb-billing.js
- Sets up MongoDB collections for billing service
- Creates `invoices` collection with comprehensive validation schema
- Inserts sample invoice data with realistic billing scenarios
- Creates performance indexes for common query patterns
- Sets up data validation for invoice integrity

## Billing Database Overview

### PostgreSQL Tables (Master Data)
- **Billing Items**: 25 predefined services with pricing
- **Insurance Companies**: 6 providers (BCBS, Aetna, UnitedHealth, Cigna, Humana, Kaiser)
- **Payment Methods**: Cash, Credit/Debit Cards, Insurance, Bank Transfer, Check

### MongoDB Collections (Transactional Data)
- **Invoices**: Complete invoice documents with billing items, payments, and insurance information
- Built-in validation for data integrity
- Flexible schema for complex billing scenarios

## Useful Development Queries

### Authentication Database
```sql
-- List all users with their roles
SELECT u.username, u.email, STRING_AGG(ur.roles, ', ') as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.id, u.username, u.email
ORDER BY u.username;

-- Count users by role
SELECT roles, COUNT(*) as user_count
FROM user_roles
GROUP BY roles
ORDER BY roles;
```

### Appointments Database
```sql
-- Today's appointments
SELECT patient_name, doctor, appointment_time, appointment_status, visit_type
FROM appointments
WHERE appointment_date = CURRENT_DATE
ORDER BY appointment_time;

-- Upcoming appointments by doctor
SELECT doctor, COUNT(*) as upcoming_appointments
FROM appointments
WHERE appointment_date > CURRENT_DATE
AND appointment_status NOT IN ('CANCELLED', 'COMPLETED')
GROUP BY doctor
ORDER BY upcoming_appointments DESC;

-- Appointments by status and date range
SELECT 
    appointment_status,
    COUNT(*) as count,
    MIN(appointment_date) as earliest_date,
    MAX(appointment_date) as latest_date
FROM appointments
GROUP BY appointment_status
ORDER BY appointment_status;
```

### Doctors Database
```sql
-- Active doctors by specialization
SELECT specialization, COUNT(*) as doctor_count, ROUND(AVG(consultation_fee), 2) as avg_fee
FROM doctors
WHERE status = 'ACTIVE'
GROUP BY specialization
ORDER BY specialization;

-- Doctors by experience level
SELECT 
    CASE 
        WHEN experience_years < 5 THEN 'Junior (0-4 years)'
        WHEN experience_years < 10 THEN 'Mid-level (5-9 years)'
        WHEN experience_years < 20 THEN 'Senior (10-19 years)'
        ELSE 'Expert (20+ years)'
    END as experience_level,
    COUNT(*) as count,
    ROUND(AVG(consultation_fee), 2) as avg_fee
FROM doctors
WHERE status = 'ACTIVE'
GROUP BY 
    CASE 
        WHEN experience_years < 5 THEN 'Junior (0-4 years)'
        WHEN experience_years < 10 THEN 'Mid-level (5-9 years)'
        WHEN experience_years < 20 THEN 'Senior (10-19 years)'
        ELSE 'Expert (20+ years)'
    END
ORDER BY MIN(experience_years);

-- Find doctors by specialization
SELECT CONCAT(first_name, ' ', last_name) as doctor_name, consultation_fee, experience_years
FROM doctors
WHERE specialization = 'CARDIOLOGY' AND status = 'ACTIVE'
ORDER BY experience_years DESC;
```

## Clean Up

To remove all data and start fresh:

```bash
# Drop databases
psql -U postgres -c "DROP DATABASE IF EXISTS hms_auth_db;"
psql -U postgres -c "DROP DATABASE IF EXISTS hms_appointment_db;"
psql -U postgres -c "DROP DATABASE IF EXISTS hms_doctor_db;"

# Then re-run the setup scripts
```

## Connection Strings for Applications

### Authentication Service
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hms_auth_db
    username: postgres
    password: your_postgres_password
```

### Appointment Scheduling Service
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hms_appointment_db
    username: postgres
    password: your_postgres_password
```

### Doctor Management Service
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hms_doctor_db
    username: postgres
    password: your_postgres_password
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Make sure you're running as postgres user or have sufficient privileges
   sudo -u postgres psql -f script.sql
   ```

2. **Database Already Exists**
   - The scripts include `DROP DATABASE IF EXISTS` commands
   - If you get conflicts, manually drop databases first

3. **Encoding Issues**
   ```sql
   -- Check your PostgreSQL locale settings
   SHOW lc_collate;
   SHOW lc_ctype;
   ```

4. **Connection Refused**
   ```bash
   # Make sure PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgresql  # Mac
   ```

### Verification

After running the scripts, verify setup:

```bash
# Check databases exist
psql -U postgres -c "\l" | grep -E "(hms_auth_db|hms_appointment_db)"

# Check table counts
psql -U postgres -d hms_auth_db -c "SELECT COUNT(*) as users FROM users;"
psql -U postgres -d hms_appointment_db -c "SELECT COUNT(*) as appointments FROM appointments;"
``` 