// ================================================================
// HMS Billing Service MongoDB Setup Script
// ================================================================
// This script sets up MongoDB collections and data for the HMS Billing Service
// Run as: mongosh mongodb://localhost:27017/hms_billing_db --file 09-setup-mongodb-billing.js
// ================================================================

// Connect to billing database
use('hms_billing_db');

// ================================================================
// 1. Create Collections with Validation
// ================================================================

// Drop existing collections and views (for clean setup)
db.invoices.drop();

// Drop existing views if they exist
try { db.invoice_financial_summary.drop(); } catch(e) { /* ignore if doesn't exist */ }
try { db.monthly_billing_summary.drop(); } catch(e) { /* ignore if doesn't exist */ }
try { db.patient_billing_summary.drop(); } catch(e) { /* ignore if doesn't exist */ }

// Create invoices collection with validation
db.createCollection("invoices", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["patientId", "doctorId", "invoiceNumber", "invoiceDate", "billingItems", "totalAmount", "status"],
            properties: {
                patientId: { bsonType: "long" },
                doctorId: { bsonType: "long" },
                appointmentId: { bsonType: "long" },
                invoiceNumber: { bsonType: "string" },
                invoiceDate: { bsonType: "date" },
                dueDate: { bsonType: "date" },
                billingItems: {
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "object",
                        required: ["itemCode", "description", "quantity", "unitPrice", "totalPrice", "category"],
                        properties: {
                            itemCode: { bsonType: "string" },
                            description: { bsonType: "string" },
                            quantity: { bsonType: "int", minimum: 1 },
                            unitPrice: {
                                bsonType: "object",
                                required: ["amount", "currency"],
                                properties: {
                                    amount: { bsonType: ["decimal", "double", "string"] },
                                    currency: { bsonType: "string" }
                                }
                            },
                            totalPrice: {
                                bsonType: "object",
                                required: ["amount", "currency"],
                                properties: {
                                    amount: { bsonType: ["decimal", "double", "string"] },
                                    currency: { bsonType: "string" }
                                }
                            },
                            category: { bsonType: "string" }
                        }
                    }
                },
                subtotal: {
                    bsonType: "object",
                    properties: {
                        amount: { bsonType: ["decimal", "double", "string"] },
                        currency: { bsonType: "string" }
                    }
                },
                taxAmount: {
                    bsonType: "object",
                    properties: {
                        amount: { bsonType: ["decimal", "double", "string"] },
                        currency: { bsonType: "string" }
                    }
                },
                discountAmount: {
                    bsonType: "object",
                    properties: {
                        amount: { bsonType: ["decimal", "double", "string"] },
                        currency: { bsonType: "string" }
                    }
                },
                totalAmount: {
                    bsonType: "object",
                    required: ["amount", "currency"],
                    properties: {
                        amount: { bsonType: ["decimal", "double", "string"] },
                        currency: { bsonType: "string" }
                    }
                },
                paidAmount: {
                    bsonType: "object",
                    properties: {
                        amount: { bsonType: ["decimal", "double", "string"] },
                        currency: { bsonType: "string" }
                    }
                },
                outstandingAmount: {
                    bsonType: "object",
                    properties: {
                        amount: { bsonType: ["decimal", "double", "string"] },
                        currency: { bsonType: "string" }
                    }
                },
                status: {
                    bsonType: "string",
                    enum: ["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"]
                }
            }
        }
    }
});

// ================================================================
// 2. Create Indexes for Performance
// ================================================================

// Primary indexes
db.invoices.createIndex({ "invoiceNumber": 1 }, { unique: true });
db.invoices.createIndex({ "patientId": 1 });
db.invoices.createIndex({ "doctorId": 1 });
db.invoices.createIndex({ "appointmentId": 1 });

// Status and date indexes
db.invoices.createIndex({ "status": 1 });
db.invoices.createIndex({ "invoiceDate": 1 });
db.invoices.createIndex({ "dueDate": 1 });
db.invoices.createIndex({ "createdAt": 1 });

// Compound indexes for common queries
db.invoices.createIndex({ "patientId": 1, "status": 1 });
db.invoices.createIndex({ "doctorId": 1, "status": 1 });
db.invoices.createIndex({ "status": 1, "dueDate": 1 });
db.invoices.createIndex({ "patientId": 1, "invoiceDate": -1 });

// Financial indexes
db.invoices.createIndex({ "totalAmount.amount": 1 });
db.invoices.createIndex({ "outstandingAmount.amount": 1 });

// ================================================================
// 3. Insert Sample Data
// ================================================================

// Sample invoices
const sampleInvoices = [
    {
        patientId: NumberLong("1"),
        doctorId: NumberLong("1"),
        appointmentId: NumberLong("1"),
        invoiceNumber: "INV-2024-000001",
        invoiceDate: new Date("2024-01-15"),
        dueDate: new Date("2024-02-14"),
        billingItems: [
            {
                itemCode: "CONS_GEN",
                description: "General Consultation",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("150.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("150.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            }
        ],
        subtotal: {
            amount: NumberDecimal("150.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("12.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("162.00"),
            currency: "USD"
        },
        paidAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("162.00"),
            currency: "USD"
        },
        status: "SENT",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Insert sample data
db.invoices.insertMany(sampleInvoices);

// ================================================================
// 4. Create Aggregation Pipeline Views
// ================================================================

// Financial summary view
db.createView("invoice_financial_summary", "invoices", [
    {
        $group: {
            _id: "$status",
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount.amount" },
            totalPaid: { $sum: "$paidAmount.amount" },
            totalOutstanding: { $sum: "$outstandingAmount.amount" },
            averageInvoiceValue: { $avg: "$totalAmount.amount" }
        }
    },
    {
        $sort: { _id: 1 }
    }
]);

// Monthly billing summary view
db.createView("monthly_billing_summary", "invoices", [
    {
        $group: {
            _id: {
                year: { $year: "$invoiceDate" },
                month: { $month: "$invoiceDate" }
            },
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount.amount" },
            totalPaid: { $sum: "$paidAmount.amount" },
            averageInvoiceValue: { $avg: "$totalAmount.amount" }
        }
    },
    {
        $sort: { "_id.year": -1, "_id.month": -1 }
    }
]);

// Patient billing summary view
db.createView("patient_billing_summary", "invoices", [
    {
        $group: {
            _id: "$patientId",
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount.amount" },
            totalPaid: { $sum: "$paidAmount.amount" },
            totalOutstanding: { $sum: "$outstandingAmount.amount" },
            lastInvoiceDate: { $max: "$invoiceDate" }
        }
    },
    {
        $sort: { totalOutstanding: -1 }
    }
]);

// ================================================================
// Display Setup Completion
// ================================================================

print("=".repeat(60));
print("HMS Billing Service MongoDB Setup Completed Successfully!");
print("=".repeat(60));

// Show collection information
print("\nCollections created:");
db.listCollections().forEach(function(collection) {
    if (collection.name !== "invoice_financial_summary" && 
        collection.name !== "monthly_billing_summary" && 
        collection.name !== "patient_billing_summary") {
        print("- " + collection.name);
    }
});

print("\nViews created:");
print("- invoice_financial_summary");
print("- monthly_billing_summary");
print("- patient_billing_summary");

print("\nIndexes created on invoices collection:");
db.invoices.getIndexes().forEach(function(index) {
    print("- " + JSON.stringify(index.key));
});

print("\nSample data inserted:");
print("- " + db.invoices.countDocuments() + " invoices");

print("\nFinancial Summary:");
db.invoice_financial_summary.find().forEach(function(doc) {
    print("Status: " + doc._id + 
          ", Count: " + doc.totalInvoices + 
          ", Total: $" + doc.totalAmount.toString() +
          ", Outstanding: $" + doc.totalOutstanding.toString());
}); 