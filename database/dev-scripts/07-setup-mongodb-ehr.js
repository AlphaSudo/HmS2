// ================================================================
// EHR Reports Service - MongoDB Sample Data Script
// ================================================================
// This script sets up sample EHR reports data in MongoDB
// Run with: mongosh hms_ehr_db --file 07-setup-mongodb-ehr.js
// ================================================================

// Switch to the EHR database
use('hms_ehr_db');

// Drop existing collection if it exists (for clean setup)
db.ehr_reports.drop();

// Create comprehensive sample EHR reports
db.ehr_reports.insertMany([
    {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "patientId": NumberLong(1),
        "doctorId": NumberLong(1),
        "appointmentId": NumberLong(1),
        "reportDate": new Date("2024-01-15T10:30:00Z"),
        "reportType": "ROUTINE_CHECKUP",
        "clinicalSummary": "Patient presented for annual physical examination. Overall health status is good with minor recommendations for lifestyle improvements.",
        "diagnoses": [
            {
                "code": "Z00.00",
                "description": "Encounter for general adult medical examination without abnormal findings",
                "isPrimary": true
            }
        ],
        "medications": [
            {
                "name": "Multivitamin",
                "dosage": "1 tablet",
                "frequency": "Daily",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "99213",
                "description": "Office visit for established patient"
            }
        ],
        "vitals": {
            "heightCm": 175.0,
            "weightKg": 70.5,
            "bloodPressureSystolic": 120,
            "bloodPressureDiastolic": 80,
            "temperatureCelsius": 36.5,
            "heartRate": 72,
            "respiratoryRate": 16
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439012"),
        "patientId": NumberLong(2),
        "doctorId": NumberLong(2),
        "appointmentId": NumberLong(2),
        "reportDate": new Date("2024-01-16T14:15:00Z"),
        "reportType": "FOLLOW_UP",
        "clinicalSummary": "Follow-up visit for hypertension management. Blood pressure remains elevated despite medication compliance. Adjusting medication dosage.",
        "diagnoses": [
            {
                "code": "I10",
                "description": "Essential hypertension",
                "isPrimary": true
            },
            {
                "code": "E78.5",
                "description": "Hyperlipidemia, unspecified",
                "isPrimary": false
            }
        ],
        "medications": [
            {
                "name": "Lisinopril",
                "dosage": "10mg",
                "frequency": "Once daily",
                "route": "Oral"
            },
            {
                "name": "Atorvastatin",
                "dosage": "20mg",
                "frequency": "Once daily at bedtime",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "99214",
                "description": "Office visit for established patient with moderate complexity"
            }
        ],
        "vitals": {
            "heightCm": 168.0,
            "weightKg": 85.2,
            "bloodPressureSystolic": 145,
            "bloodPressureDiastolic": 92,
            "temperatureCelsius": 36.8,
            "heartRate": 78,
            "respiratoryRate": 18
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439013"),
        "patientId": NumberLong(3),
        "doctorId": NumberLong(1),
        "appointmentId": NumberLong(3),
        "reportDate": new Date("2024-01-17T09:00:00Z"),
        "reportType": "URGENT_CARE",
        "clinicalSummary": "Patient presented with acute chest pain. EKG performed, no acute changes noted. Likely musculoskeletal pain. Discharged with pain management and follow-up instructions.",
        "diagnoses": [
            {
                "code": "R06.02",
                "description": "Shortness of breath",
                "isPrimary": true
            },
            {
                "code": "R50.9",
                "description": "Fever, unspecified",
                "isPrimary": false
            }
        ],
        "medications": [
            {
                "name": "Ibuprofen",
                "dosage": "400mg",
                "frequency": "Every 6 hours as needed",
                "route": "Oral"
            },
            {
                "name": "Acetaminophen",
                "dosage": "500mg",
                "frequency": "Every 4-6 hours as needed",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "93000",
                "description": "Electrocardiogram, routine ECG with at least 12 leads"
            },
            {
                "code": "99283",
                "description": "Emergency department visit for moderate complexity"
            }
        ],
        "vitals": {
            "heightCm": 180.0,
            "weightKg": 75.0,
            "bloodPressureSystolic": 135,
            "bloodPressureDiastolic": 85,
            "temperatureCelsius": 37.2,
            "heartRate": 88,
            "respiratoryRate": 20
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439014"),
        "patientId": NumberLong(1),
        "doctorId": NumberLong(3),
        "appointmentId": NumberLong(4),
        "reportDate": new Date("2024-01-18T11:30:00Z"),
        "reportType": "CONSULTATION",
        "clinicalSummary": "Dermatology consultation for recurring skin rash. Diagnosed with contact dermatitis. Prescribed topical steroid and recommended avoidance of triggers.",
        "diagnoses": [
            {
                "code": "L23.9",
                "description": "Allergic contact dermatitis, unspecified cause",
                "isPrimary": true
            }
        ],
        "medications": [
            {
                "name": "Hydrocortisone cream",
                "dosage": "1%",
                "frequency": "Apply twice daily",
                "route": "Topical"
            },
            {
                "name": "Cetirizine",
                "dosage": "10mg",
                "frequency": "Once daily",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "99242",
                "description": "Office consultation for a new or established patient"
            }
        ],
        "vitals": {
            "heightCm": 175.0,
            "weightKg": 71.0,
            "bloodPressureSystolic": 118,
            "bloodPressureDiastolic": 78,
            "temperatureCelsius": 36.6,
            "heartRate": 70,
            "respiratoryRate": 16
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439015"),
        "patientId": NumberLong(4),
        "doctorId": NumberLong(2),
        "appointmentId": NumberLong(5),
        "reportDate": new Date("2024-01-19T15:45:00Z"),
        "reportType": "NEW_PATIENT_VISIT",
        "clinicalSummary": "New patient visit for 45-year-old female with complaints of fatigue and joint pain. Initial workup ordered including blood tests. Preliminary assessment suggests possible autoimmune condition.",
        "diagnoses": [
            {
                "code": "R53.83",
                "description": "Other fatigue",
                "isPrimary": true
            },
            {
                "code": "M25.50",
                "description": "Pain in unspecified joint",
                "isPrimary": false
            }
        ],
        "medications": [
            {
                "name": "Naproxen",
                "dosage": "220mg",
                "frequency": "Twice daily with food",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "99204",
                "description": "Office visit for new patient with moderate complexity"
            },
            {
                "code": "80053",
                "description": "Comprehensive metabolic panel"
            }
        ],
        "vitals": {
            "heightCm": 162.0,
            "weightKg": 58.5,
            "bloodPressureSystolic": 125,
            "bloodPressureDiastolic": 82,
            "temperatureCelsius": 36.4,
            "heartRate": 75,
            "respiratoryRate": 17
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439016"),
        "patientId": NumberLong(5),
        "doctorId": NumberLong(1),
        "appointmentId": NumberLong(6),
        "reportDate": new Date("2024-01-20T08:30:00Z"),
        "reportType": "ROUTINE_CHECKUP",
        "clinicalSummary": "Pediatric routine checkup for 8-year-old child. Growth and development on track. Immunizations up to date. Excellent overall health.",
        "diagnoses": [
            {
                "code": "Z00.129",
                "description": "Encounter for routine child health examination without abnormal findings",
                "isPrimary": true
            }
        ],
        "medications": [
            {
                "name": "Children's Multivitamin",
                "dosage": "1 chewable tablet",
                "frequency": "Daily",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "99212",
                "description": "Office visit for established patient"
            }
        ],
        "vitals": {
            "heightCm": 127.0,
            "weightKg": 25.5,
            "bloodPressureSystolic": 95,
            "bloodPressureDiastolic": 60,
            "temperatureCelsius": 36.3,
            "heartRate": 90,
            "respiratoryRate": 20
        }
    }
]);

// Create indexes for better query performance
db.ehr_reports.createIndex({ "patientId": 1 });
db.ehr_reports.createIndex({ "doctorId": 1 });
db.ehr_reports.createIndex({ "appointmentId": 1 });
db.ehr_reports.createIndex({ "reportDate": 1 });
db.ehr_reports.createIndex({ "reportType": 1 });
db.ehr_reports.createIndex({ "patientId": 1, "reportDate": -1 });
db.ehr_reports.createIndex({ "doctorId": 1, "reportDate": -1 });

// Display summary information
print("\n=== EHR Reports MongoDB Setup Complete ===");
print("Total EHR reports inserted: " + db.ehr_reports.countDocuments());

print("\nReports by type:");
db.ehr_reports.aggregate([
    { $group: { _id: "$reportType", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]).forEach(printjson);

print("\nReports by doctor:");
db.ehr_reports.aggregate([
    { $group: { _id: "$doctorId", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]).forEach(printjson);

print("\nReports by patient:");
db.ehr_reports.aggregate([
    { $group: { _id: "$patientId", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]).forEach(printjson);

print("\nSample report data:");
db.ehr_reports.findOne({}, { 
    patientId: 1, 
    doctorId: 1, 
    reportType: 1, 
    reportDate: 1,
    clinicalSummary: 1
});

print("\n=== Setup Complete ==="); 