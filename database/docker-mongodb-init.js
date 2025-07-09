// ========================================
// HMS MongoDB Docker Initialization
// ========================================
// This script runs automatically when MongoDB container starts
// It sets up the medical history database for the patient service

// Switch to medical history database
db = db.getSiblingDB('hms_medical_history_db');

// Create the medical history collection with validation schema
db.createCollection("medicalHistory", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["patientId", "createdAt", "updatedAt"],
            properties: {
                _id: {
                    bsonType: "objectId"
                },
                patientId: {
                    bsonType: "long",
                    description: "Patient ID from PostgreSQL"
                },
                allergies: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                },
                pastConditions: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                },
                surgeries: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["surgery", "date"],
                        properties: {
                            surgery: { bsonType: "string" },
                            date: { bsonType: "date" },
                            notes: { bsonType: "string" }
                        }
                    }
                },
                medications: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["medication", "dosage"],
                        properties: {
                            medication: { bsonType: "string" },
                            dosage: { bsonType: "string" },
                            frequency: { bsonType: "string" },
                            startDate: { bsonType: "date" },
                            endDate: { bsonType: "date" },
                            notes: { bsonType: "string" }
                        }
                    }
                },
                createdAt: { bsonType: "date" },
                updatedAt: { bsonType: "date" }
            }
        }
    }
});

// Create indexes
db.medicalHistory.createIndex({ "patientId": 1 }, { unique: true });
db.medicalHistory.createIndex({ "createdAt": 1 });
db.medicalHistory.createIndex({ "updatedAt": 1 });

print("MongoDB initialization complete for HMS Patient Service");
print("Database: hms_medical_history_db");
print("Collection: medicalHistory (with validation schema and indexes)"); 