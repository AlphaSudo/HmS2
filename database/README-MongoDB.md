# MongoDB Setup for HMS Patient Service

This directory contains MongoDB setup scripts for the Hospital Management System's Patient Service medical history data.

## Overview

The Patient Service uses a **hybrid database approach**:
- **PostgreSQL**: For structured patient data (personal info, admission details, etc.)
- **MongoDB**: For flexible medical history data (allergies, medications, surgeries, etc.)

## Files

### Development Scripts
- `dev-scripts/04-setup-mongodb-patient.js` - Full MongoDB setup with sample data for local development
- `docker-mongodb-init.js` - Docker initialization script (schema only)

### Docker Compose
- `docker-compose.yml` - Updated to include MongoDB and Mongo Express

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)
```bash
# Start both PostgreSQL and MongoDB
cd database
docker-compose up -d

# This will automatically:
# - Create PostgreSQL databases (auth, appointment, patient)
# - Create MongoDB database (hms_medical_history_db)
# - Set up collection schema and indexes
```

### Option 2: Manual MongoDB Setup
```bash
# 1. Install MongoDB locally
# 2. Start MongoDB service
# 3. Run the setup script
mongosh "mongodb://localhost:27017/hms_patient_db" --file "C:\Users\CM\Downloads\Compressed\Hospital Management System\database\dev-scripts\04-setup-mongodb-patient.js"
```

## Access Information

### MongoDB (Docker)
- **URL**: `mongodb://localhost:27017`
- **Database**: `hms_medical_history_db`
- **Collection**: `medicalHistory`

### Mongo Express (Web UI)
- **URL**: http://localhost:8081
- **Username**: `admin`
- **Password**: `admin123`

## Database Schema

### Medical History Collection Structure
```javascript
{
  _id: ObjectId,
  patientId: Long,           // References patient.id from PostgreSQL
  allergies: [String],       // Array of allergy names
  pastConditions: [String],  // Array of past medical conditions
  surgeries: [{              // Array of surgery objects
    surgery: String,         // Surgery name
    date: Date,             // Surgery date
    notes: String           // Optional notes
  }],
  medications: [{           // Array of medication objects
    medication: String,     // Medication name
    dosage: String,        // Dosage amount
    frequency: String,     // How often to take
    startDate: Date,       // Start date
    endDate: Date,         // End date (optional)
    notes: String          // Optional notes
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Sample Data

The development script includes sample medical history data for 8 patients, including:
- Allergies and medical conditions
- Surgical histories
- Current and past medications
- Realistic medical scenarios

## Patient Service Configuration

The patient service connects to MongoDB using these settings:

### Local Development
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/hms_medical_history_db
```

### Docker Environment
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://mongo:27017/hms_medical_history_db
```

## Indexes Created

For optimal query performance:
- `patientId` (unique) - Primary lookup field
- `createdAt` - Time-based queries
- `updatedAt` - Recent updates
- `allergies` - Allergy searches
- `pastConditions` - Medical history searches

## Usage in Application

The Patient Service automatically:
1. Creates a basic medical history record when a new patient is created
2. Allows CRUD operations on medical history data
3. Maintains referential integrity with PostgreSQL patient data

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps | grep mongo

# View MongoDB logs
docker logs hms-mongodb

# Connect manually to test
mongosh mongodb://localhost:27017/hms_medical_history_db
```

### Data Verification
```javascript
// Connect to MongoDB
use hms_medical_history_db

// Count documents
db.medicalHistory.countDocuments()

// View sample data
db.medicalHistory.findOne()

// Check indexes
db.medicalHistory.getIndexes()
``` 