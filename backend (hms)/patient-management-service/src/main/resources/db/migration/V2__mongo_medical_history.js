// ========================================
// HMS Patient Service MongoDB Setup
// ========================================
// Run this script with: mongosh "mongodb://localhost:27017/hms_medical_history_db" --file V2__mongo_medical_history.js

// Switch to medical history database
db = db.getSiblingDB('hms_medical_history_db');

// Drop existing collection if it exists (for clean setup)
db.medicalHistory.drop();

// Create the medical history collection with a validation schema that matches the Java models
db.createCollection("medicalHistory", {
    /* validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["patient_id", "created_at", "updated_at"],
            properties: {
                _id: { bsonType: "objectId" },
                patient_id: {
                    bsonType: ["long", "int"],
                    description: "must be a long or int and is required - references patient ID from PostgreSQL"
                },                
                height: { bsonType: "double" },
                weight: { bsonType: "double" },
                allergies: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                },
                past_conditions: {
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
                created_at: { bsonType: "date" },
                updated_at: { bsonType: "date" }
            }
        }
    } */
});

// Create indexes for better query performance
db.medicalHistory.createIndex({ "patient_id": 1 }, { unique: true, sparse: true });
db.medicalHistory.createIndex({ "created_at": 1 });
db.medicalHistory.createIndex({ "updated_at": 1 });
db.medicalHistory.createIndex({ "allergies": 1 });
db.medicalHistory.createIndex({ "past_conditions": 1 });

// Insert sample medical history data matching the patient IDs from PostgreSQL
db.medicalHistory.insertMany([
    {
        patient_id: NumberLong("1"),
        allergies: ["Penicillin", "Shellfish"],
        height: 165.5,
        weight: 68.2,
        past_conditions: ["Asthma", "Hypertension"],
        surgeries: [
            { surgery: "Appendectomy", date: new Date("2015-06-20T00:00:00Z"), notes: "Routine procedure" }
        ],
        medications: [
            { medication: "Lisinopril", dosage: "10mg", frequency: "Once a day", startDate: new Date("2022-03-15"), notes: "For blood pressure" },
            { medication: "Albuterol Inhaler", dosage: "As needed", frequency: "As needed", startDate: new Date("2020-01-01"), notes: "For asthma" }
        ],
        created_at: new Date("2023-01-20T14:30:00Z"),
        updated_at: new Date("2023-01-20T14:30:00Z")
    },
    {
        patient_id: NumberLong("2"),
        allergies: ["Aspirin"],
        height: 175.0,
        weight: 85.0,
        past_conditions: ["Type 2 Diabetes"],
        surgeries: [],
        medications: [
            { medication: "Metformin", dosage: "500mg", frequency: "Twice a day", startDate: new Date("2021-06-01"), notes: "For diabetes management" }
        ],
        created_at: new Date("2023-02-15T08:00:00Z"),
        updated_at: new Date("2023-02-15T08:00:00Z")
    },
    {
        patient_id: NumberLong("3"),
        allergies: [],
        height: 155.0,
        weight: 62.5,
        past_conditions: ["Migraines"],
        surgeries: [
            { surgery: "Tonsillectomy", date: new Date("2005-08-10T00:00:00Z"), notes: "Childhood procedure" }
        ],
        medications: [
            { medication: "Sumatriptan", dosage: "50mg", frequency: "As needed", startDate: new Date("2019-11-20"), notes: "For migraines" }
        ],
        created_at: new Date("2023-03-15T16:00:00Z"),
        updated_at: new Date("2023-03-15T16:00:00Z")
    },
    {
        patient_id: NumberLong("4"),
        allergies: ["Iodine"],
        height: 170.0,
        weight: 75.0,
        past_conditions: [],
        surgeries: [],
        medications: [],
        created_at: new Date("2023-04-01T09:00:00Z"),
        updated_at: new Date("2023-04-01T09:00:00Z")
    },
    {
        patient_id: NumberLong("5"),
        allergies: ["Latex", "Nickel"],
        height: 160.0,
        weight: 55.0,
        past_conditions: ["Eczema"],
        surgeries: [],
        medications: [
            { medication: "Topical Steroids", dosage: "As needed", frequency: "As needed", startDate: new Date("2022-07-15"), notes: "For flare-ups" }
        ],
        created_at: new Date("2023-05-15T10:00:00Z"),
        updated_at: new Date("2023-05-15T10:00:00Z")
    },
    {
        patient_id: NumberLong("6"),
        allergies: [],
        height: 180.0,
        weight: 92.0,
        past_conditions: ["High Cholesterol"],
        surgeries: [],
        medications: [
            { medication: "Atorvastatin", dosage: "20mg", frequency: "Once a day", startDate: new Date("2022-09-01"), notes: "For cholesterol" }
        ],
        created_at: new Date("2023-06-20T14:00:00Z"),
        updated_at: new Date("2023-06-20T14:00:00Z")
    },
    {
        patient_id: NumberLong("7"),
        allergies: ["Codeine"],
        height: 162.0,
        weight: 58.0,
        past_conditions: ["Anemia"],
        surgeries: [],
        medications: [
            { medication: "Iron supplement", dosage: "325mg", frequency: "Once a day", startDate: new Date("2023-01-10"), notes: "For anemia" }
        ],
        created_at: new Date("2023-07-12T09:00:00Z"),
        updated_at: new Date("2023-07-12T09:00:00Z")
    },
    {
        patient_id: NumberLong("8"),
        allergies: ["Sulfa drugs"],
        height: 178.0,
        weight: 88.5,
        past_conditions: ["Gout"],
        surgeries: [],
        medications: [
            { medication: "Allopurinol", dosage: "300mg", frequency: "Once a day", startDate: new Date("2021-12-01"), notes: "For gout" }
        ],
        created_at: new Date("2023-08-01T15:00:00Z"),
        updated_at: new Date("2023-08-01T15:00:00Z")
    }
]);

// Verify the data was inserted correctly
print("=== Medical History Database Setup Complete ===");
print("Database: " + db.getName());
print("Collection: medicalHistory");
print("Total documents inserted: " + db.medicalHistory.count());

// Show sample of inserted data
print("\n=== Sample Medical History Records ===");
db.medicalHistory.find().limit(2).forEach(printjson);

// Show indexes
print("\n=== Created Indexes ===");
db.medicalHistory.getIndexes().forEach(function(index) {
    print("Index: " + JSON.stringify(index.key) + " (unique: " + (index.unique || false) + ")");
});

print("\n=== Setup Complete! ===");
print("You can now start the patient-management-service.");
print("The service will connect to this MongoDB database for medical history data."); 