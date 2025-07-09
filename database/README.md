# HMS Database Setup

This directory provides database setup for the Hospital Management System (HMS) with two approaches:

## 🐳 **Docker Setup (Recommended for Testing)**

Quick containerized setup with PostgreSQL and PgAdmin:

```bash
cd database
docker-compose up -d
```

**Access:**
- **PostgreSQL**: `localhost:5432` (user: `postgres`, password: `postgres`)
- **PgAdmin**: `http://localhost:8080` (email: `admin@hms.com`, password: `admin123`)
- **Databases**: `hms_auth_db`, `hms_appointment_db`

## 💻 **Local Development Setup**

For local PostgreSQL development, use the `dev-scripts/` directory:

```bash
cd database/dev-scripts

# 1. Create databases
psql -U postgres -f 00-create-databases.sql

# 2. Setup authentication database  
psql -U postgres -d hms_auth_db -f 01-setup-auth-database.sql

# 3. Setup appointments database
psql -U postgres -d hms_appointment_db -f 02-setup-appointments-database.sql
```

See `dev-scripts/README.md` for detailed local development instructions.

## 📁 **Directory Structure**

```
database/
├── docker-compose.yml          # Docker containers configuration
├── docker-init.sql            # Docker initialization script
├── dev-scripts/               # Local development scripts
│   ├── 00-create-databases.sql
│   ├── 01-setup-auth-database.sql
│   ├── 02-setup-appointments-database.sql
│   └── README.md              # Detailed dev setup guide
└── README.md                  # This file
```

## 🎯 **Use Cases**

- **Docker**: Quick testing, demos, CI/CD
- **Dev Scripts**: Local development, debugging, custom setups

## 📊 **Sample Data**

Both setups include:
- **22 users** with realistic roles (admin, doctors, patients, staff)
- **20 appointments** covering all statuses and visit types
- **Password for all users**: `password`

## 🔧 **Application Configuration**

Update your Spring applications to connect:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hms_auth_db      # or hms_appointment_db
    username: postgres
    password: postgres  # or your local password
``` 