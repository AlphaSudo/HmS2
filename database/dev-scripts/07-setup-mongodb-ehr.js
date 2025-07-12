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
        "patientId": NumberLong(1), // John Doe
        "doctorId": NumberLong(2), // Dr. John Smith
        "appointmentId": NumberLong(1),
        "reportDate": new Date("2024-01-15T10:30:00Z"),
        "reportType": "ROUTINE_CHECKUP",
        "clinicalSummary": "Patient presented for annual physical examination after cardiac surgery. Overall health status is good with minor recommendations for lifestyle improvements.",
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
        "patientId": NumberLong(2), // Jane Smith
        "doctorId": NumberLong(3), // Dr. Sarah Johnson
        "appointmentId": NumberLong(2),
        "reportDate": new Date("2024-01-16T14:15:00Z"),
        "reportType": "FOLLOW_UP",
        "clinicalSummary": "Follow-up visit for stroke recovery. Patient showing good progress with physical therapy. Adjusting medication dosage for optimal recovery.",
        "diagnoses": [
            {
                "code": "I63.9",
                "description": "Cerebral infarction, unspecified",
                "isPrimary": true
            },
            {
                "code": "Z51.89",
                "description": "Encounter for other specified aftercare",
                "isPrimary": false
            }
        ],
        "medications": [
            {
                "name": "Aspirin",
                "dosage": "81mg",
                "frequency": "Once daily",
                "route": "Oral"
            },
            {
                "name": "Clopidogrel",
                "dosage": "75mg",
                "frequency": "Once daily",
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
        "patientId": NumberLong(3), // Mike Wilson
        "doctorId": NumberLong(4), // Dr. Michael Brown
        "appointmentId": NumberLong(3),
        "reportDate": new Date("2024-01-17T09:00:00Z"),
        "reportType": "URGENT_CARE",
        "clinicalSummary": "Patient presented with neurological symptoms. Comprehensive neurological examination performed. Adjusting treatment plan based on latest findings.",
        "diagnoses": [
            {
                "code": "G93.1",
                "description": "Anoxic brain damage, not elsewhere classified",
                "isPrimary": true
            },
            {
                "code": "R25.1",
                "description": "Tremor, unspecified",
                "isPrimary": false
            }
        ],
        "medications": [
            {
                "name": "Levetiracetam",
                "dosage": "500mg",
                "frequency": "Twice daily",
                "route": "Oral"
            },
            {
                "name": "Gabapentin",
                "dosage": "300mg",
                "frequency": "Three times daily",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "95816",
                "description": "Electroencephalogram (EEG)"
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
        "patientId": NumberLong(4), // Sarah Johnson
        "doctorId": NumberLong(5), // Dr. Emily Davis
        "appointmentId": NumberLong(4),
        "reportDate": new Date("2024-01-18T11:30:00Z"),
        "reportType": "CONSULTATION",
        "clinicalSummary": "Dermatology consultation for recurring skin condition. Diagnosed with chronic eczema. Prescribed topical treatments and recommended lifestyle modifications.",
        "diagnoses": [
            {
                "code": "L30.9",
                "description": "Dermatitis, unspecified",
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
            "heightCm": 162.0,
            "weightKg": 58.5,
            "bloodPressureSystolic": 118,
            "bloodPressureDiastolic": 78,
            "temperatureCelsius": 36.6,
            "heartRate": 70,
            "respiratoryRate": 16
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439015"),
        "patientId": NumberLong(5), // David Brown
        "doctorId": NumberLong(6), // Dr. Robert Wilson
        "appointmentId": NumberLong(5),
        "reportDate": new Date("2024-01-19T15:45:00Z"),
        "reportType": "NEW_PATIENT_VISIT",
        "clinicalSummary": "New patient orthopedic consultation for joint pain and mobility issues. Initial assessment suggests inflammatory joint condition. Comprehensive treatment plan initiated.",
        "diagnoses": [
            {
                "code": "M25.50",
                "description": "Pain in unspecified joint",
                "isPrimary": true
            },
            {
                "code": "M79.3",
                "description": "Panniculitis, unspecified",
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
                "code": "73060",
                "description": "Radiologic examination, knee"
            }
        ],
        "vitals": {
            "heightCm": 175.0,
            "weightKg": 72.0,
            "bloodPressureSystolic": 125,
            "bloodPressureDiastolic": 82,
            "temperatureCelsius": 36.4,
            "heartRate": 75,
            "respiratoryRate": 17
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439016"),
        "patientId": NumberLong(6), // Emily Davis
        "doctorId": NumberLong(7), // Dr. Jessica Garcia
        "appointmentId": NumberLong(6),
        "reportDate": new Date("2024-01-20T08:30:00Z"),
        "reportType": "ROUTINE_CHECKUP",
        "clinicalSummary": "Routine gynecological checkup with anxiety therapy support. Patient showing improvement with current treatment plan. Continuing therapeutic approach.",
        "diagnoses": [
            {
                "code": "Z01.411",
                "description": "Encounter for gynecological examination (general) (routine) with abnormal findings",
                "isPrimary": true
            },
            {
                "code": "F41.9",
                "description": "Anxiety disorder, unspecified",
                "isPrimary": false
            }
        ],
        "medications": [
            {
                "name": "Sertraline",
                "dosage": "50mg",
                "frequency": "Once daily",
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
            "heightCm": 165.0,
            "weightKg": 58.0,
            "bloodPressureSystolic": 115,
            "bloodPressureDiastolic": 75,
            "temperatureCelsius": 36.3,
            "heartRate": 85,
            "respiratoryRate": 18
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439017"),
        "patientId": NumberLong(7), // Robert Clark
        "doctorId": NumberLong(2), // Dr. John Smith
        "appointmentId": NumberLong(7),
        "reportDate": new Date("2024-01-21T14:00:00Z"),
        "reportType": "FOLLOW_UP",
        "clinicalSummary": "Post-treatment cardiac follow-up. Patient recovering well from previous ulcer treatment. Monitoring cardiac function and medication compliance.",
        "diagnoses": [
            {
                "code": "Z51.10",
                "description": "Encounter for antineoplastic chemotherapy",
                "isPrimary": true
            }
        ],
        "medications": [
            {
                "name": "Omeprazole",
                "dosage": "20mg",
                "frequency": "Once daily",
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
            "heightCm": 178.0,
            "weightKg": 82.0,
            "bloodPressureSystolic": 128,
            "bloodPressureDiastolic": 84,
            "temperatureCelsius": 36.7,
            "heartRate": 76,
            "respiratoryRate": 16
        }
    },
    {
        "_id": ObjectId("507f1f77bcf86cd799439018"),
        "patientId": NumberLong(8), // Lisa Martinez
        "doctorId": NumberLong(3), // Dr. Sarah Johnson
        "appointmentId": NumberLong(8),
        "reportDate": new Date("2024-01-22T10:15:00Z"),
        "reportType": "CONSULTATION",
        "clinicalSummary": "Oncology consultation for chemotherapy treatment monitoring. Patient tolerating treatment well with minimal side effects. Continuing current protocol.",
        "diagnoses": [
            {
                "code": "C78.00",
                "description": "Secondary malignant neoplasm of unspecified lung",
                "isPrimary": true
            }
        ],
        "medications": [
            {
                "name": "Ondansetron",
                "dosage": "8mg",
                "frequency": "As needed for nausea",
                "route": "Oral"
            }
        ],
        "procedures": [
            {
                "code": "99215",
                "description": "Office visit for established patient with high complexity"
            }
        ],
        "vitals": {
            "heightCm": 162.0,
            "weightKg": 56.0,
            "bloodPressureSystolic": 110,
            "bloodPressureDiastolic": 70,
            "temperatureCelsius": 36.2,
            "heartRate": 88,
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