// ================================================================
// HMS Billing Service MongoDB Setup Script (No Validation)
// ================================================================
// This script sets up MongoDB collections and data for the HMS Billing Service
// WITHOUT schema validation for easier testing
// ================================================================

// Connect to billing database
use('hms_billing_db');

// ================================================================
// 1. Create Collections (No Validation)
// ================================================================

// Drop existing collections and views (for clean setup)
db.invoices.drop();

// Drop existing views if they exist
try { db.invoice_financial_summary.drop(); } catch(e) { /* ignore if doesn't exist */ }
try { db.monthly_billing_summary.drop(); } catch(e) { /* ignore if doesn't exist */ }
try { db.patient_billing_summary.drop(); } catch(e) { /* ignore if doesn't exist */ }

// Create invoices collection WITHOUT validation
db.createCollection("invoices");

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
db.invoices.createIndex({ "paidAmount.amount": 1 });
db.invoices.createIndex({ "discountAmount.amount": 1 });

// Insurance and payment indexes
db.invoices.createIndex({ "insurance.insuranceCompany": 1 });
db.invoices.createIndex({ "insurance.policyNumber": 1 });
db.invoices.createIndex({ "payments.paymentMethod": 1 });
db.invoices.createIndex({ "payments.status": 1 });

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
        discountAmount: {
            amount: NumberDecimal("5.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("157.00"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Blue Cross Blue Shield",
            policyNumber: "BC123456789",
            coveragePercentage: NumberDecimal("80.00"),
            copayAmount: {
                amount: NumberDecimal("20.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("500.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("10000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("125.60"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("31.40"),
            currency: "USD"
        },
        payments: [
            {
                paymentId: "PAY-2024-000001",
                amount: {
                    amount: NumberDecimal("31.40"),
                    currency: "USD"
                },
                paymentMethod: "CREDIT_CARD",
                transactionId: "TXN-CC-123456",
                paymentDate: new Date("2024-01-16"),
                status: "COMPLETED"
            }
        ],
        paidAmount: {
            amount: NumberDecimal("31.40"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        status: "PAID",
        notes: "Payment received via credit card. Insurance claim processed successfully.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        patientId: NumberLong("2"),
        doctorId: NumberLong("2"),
        appointmentId: NumberLong("2"),
        invoiceNumber: "INV-2024-000002",
        invoiceDate: new Date("2024-01-20"),
        dueDate: new Date("2024-02-19"),
        billingItems: [
            {
                itemCode: "CONS_SPEC",
                description: "Specialist Consultation",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("250.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("250.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            },
            {
                itemCode: "LAB_BLOOD",
                description: "Blood Test Panel",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("120.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("120.00"),
                    currency: "USD"
                },
                category: "LAB_TEST"
            }
        ],
        subtotal: {
            amount: NumberDecimal("370.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("29.60"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("399.60"),
            currency: "USD"
        },
        insurance: null,
        insuranceCoverage: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("399.60"),
            currency: "USD"
        },
        payments: [],
        paidAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("399.60"),
            currency: "USD"
        },
        status: "SENT",
        notes: "Invoice sent to patient. No insurance coverage.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        patientId: NumberLong("3"),
        doctorId: NumberLong("1"),
        appointmentId: NumberLong("3"),
        invoiceNumber: "INV-2024-000003",
        invoiceDate: new Date("2024-01-10"),
        dueDate: new Date("2024-02-09"),
        billingItems: [
            {
                itemCode: "PROC_MINOR",
                description: "Minor Surgical Procedure",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("500.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("500.00"),
                    currency: "USD"
                },
                category: "PROCEDURE"
            }
        ],
        subtotal: {
            amount: NumberDecimal("500.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("40.00"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("25.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("515.00"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Aetna",
            policyNumber: "AET987654321",
            coveragePercentage: NumberDecimal("70.00"),
            copayAmount: {
                amount: NumberDecimal("50.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("1000.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("5000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("360.50"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("154.50"),
            currency: "USD"
        },
        payments: [
            {
                paymentId: "PAY-2024-000002",
                amount: {
                    amount: NumberDecimal("100.00"),
                    currency: "USD"
                },
                paymentMethod: "CASH",
                transactionId: "TXN-CASH-001",
                paymentDate: new Date("2024-01-12"),
                status: "COMPLETED"
            }
        ],
        paidAmount: {
            amount: NumberDecimal("100.00"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("54.50"),
            currency: "USD"
        },
        status: "OVERDUE",
        notes: "Partial payment received. Insurance claim pending review.",
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

// ================================================================
// Display Setup Completion
// ================================================================

print("=".repeat(60));
print("HMS Billing Service MongoDB Setup Completed (No Validation)!");
print("=".repeat(60));

print("\nCollections created:");
print("- invoices (no validation)");

print("\nIndexes created on invoices collection:");
db.invoices.getIndexes().forEach(function(index) {
    print("- " + JSON.stringify(index.key));
});

print("\nSample data inserted:");
print("- " + db.invoices.countDocuments() + " invoices");

print("\nReady for testing!"); 