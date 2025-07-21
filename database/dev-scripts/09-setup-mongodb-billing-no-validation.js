// ================================================================
// HMS Billing Service MongoDB Setup Script (No Validation)
// ================================================================
// This script sets up MongoDB collections and data for the HMS Billing Service
// WITHOUT schema validation for easier testing
// ================================================================

// Connect to billing database
db = db.getSiblingDB('hms_billing_db');

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

// Sample invoices with consistent patient and doctor IDs
const sampleInvoices = [
    {
        patientId: NumberLong("1"), // John Doe (auth user_id 8)
        doctorId: NumberLong("2"), // Dr. John Smith
        appointmentId: NumberLong("1"),
        invoiceNumber: "INV-2024-000001",
        invoiceDate: new Date("2024-01-15"),
        dueDate: new Date("2024-02-14"),
        billingItems: [
            {
                itemCode: "CONS_GEN",
                description: "General Consultation - Cardiac Surgery Follow-up",
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
            }
        ],
        subtotal: {
            amount: NumberDecimal("250.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("20.00"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("5.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("265.00"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Blue Cross Blue Shield",
            policyNumber: "BCBS-JD-20240001",
            coveragePercentage: NumberDecimal("80.00"),
            copayAmount: {
                amount: NumberDecimal("25.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("500.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("100000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("192.00"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("73.00"),
            currency: "USD"
        },
        payments: [
            {
                paymentId: "PAY-2024-000001",
                amount: {
                    amount: NumberDecimal("73.00"),
                    currency: "USD"
                },
                paymentMethod: "CREDIT_CARD",
                transactionId: "TXN-CC-123456",
                paymentDate: new Date("2024-01-16"),
                status: "COMPLETED"
            }
        ],
        paidAmount: {
            amount: NumberDecimal("73.00"),
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
        patientId: NumberLong("2"), // Jane Smith (auth user_id 9)
        doctorId: NumberLong("3"), // Dr. Sarah Johnson
        appointmentId: NumberLong("2"),
        invoiceNumber: "INV-2024-000002",
        invoiceDate: new Date("2024-01-20"),
        dueDate: new Date("2024-02-19"),
        billingItems: [
            {
                itemCode: "CONS_SPEC",
                description: "Specialist Consultation - Pediatrics",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("180.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("180.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            },
            {
                itemCode: "LAB_BLOOD",
                description: "Blood Test Panel",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("45.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("45.00"),
                    currency: "USD"
                },
                category: "LAB_TEST"
            }
        ],
        subtotal: {
            amount: NumberDecimal("225.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("18.00"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("243.00"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Aetna Health Insurance",
            policyNumber: "AETNA-JS-20240002",
            coveragePercentage: NumberDecimal("75.00"),
            copayAmount: {
                amount: NumberDecimal("30.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("750.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("150000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("182.25"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("60.75"),
            currency: "USD"
        },
        payments: [],
        paidAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("60.75"),
            currency: "USD"
        },
        status: "SENT",
        notes: "Invoice sent to patient. Insurance pre-authorized.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        patientId: NumberLong("3"), // Mike Wilson (auth user_id 10)
        doctorId: NumberLong("4"), // Dr. Michael Brown
        appointmentId: NumberLong("3"),
        invoiceNumber: "INV-2024-000003",
        invoiceDate: new Date("2024-01-10"),
        dueDate: new Date("2024-02-09"),
        billingItems: [
            {
                itemCode: "CONS_SPEC",
                description: "Specialist Consultation - Neurology",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("300.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("300.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            },
            {
                itemCode: "PROC_CT",
                description: "CT Scan",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("800.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("800.00"),
                    currency: "USD"
                },
                category: "PROCEDURE"
            }
        ],
        subtotal: {
            amount: NumberDecimal("1100.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("88.00"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("25.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("1163.00"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "UnitedHealth Group",
            policyNumber: "UHG-MW-20240003",
            coveragePercentage: NumberDecimal("85.00"),
            copayAmount: {
                amount: NumberDecimal("20.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("400.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("200000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("988.55"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("174.45"),
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
            amount: NumberDecimal("74.45"),
            currency: "USD"
        },
        status: "PARTIALLY_PAID",
        notes: "Partial payment received. Insurance claim pending review.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        patientId: NumberLong("4"), // Sarah Johnson (auth user_id 11)
        doctorId: NumberLong("5"), // Dr. Emily Davis
        appointmentId: NumberLong("4"),
        invoiceNumber: "INV-2024-000004",
        invoiceDate: new Date("2024-01-18"),
        dueDate: new Date("2024-02-17"),
        billingItems: [
            {
                itemCode: "CONS_SPEC",
                description: "Specialist Consultation - Dermatology",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("200.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("200.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            }
        ],
        subtotal: {
            amount: NumberDecimal("200.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("16.00"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("216.00"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Cigna Corporation",
            policyNumber: "CIGNA-SJ-20240004",
            coveragePercentage: NumberDecimal("70.00"),
            copayAmount: {
                amount: NumberDecimal("35.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("800.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("120000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("151.20"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("64.80"),
            currency: "USD"
        },
        payments: [],
        paidAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("64.80"),
            currency: "USD"
        },
        status: "OVERDUE",
        notes: "Invoice overdue. Patient contacted for payment reminder.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        patientId: NumberLong("5"), // David Brown (auth user_id 12)
        doctorId: NumberLong("6"), // Dr. Robert Wilson
        appointmentId: NumberLong("5"),
        invoiceNumber: "INV-2024-000005",
        invoiceDate: new Date("2024-01-19"),
        dueDate: new Date("2024-02-18"),
        billingItems: [
            {
                itemCode: "CONS_SPEC",
                description: "Specialist Consultation - Orthopedics",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("350.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("350.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            },
            {
                itemCode: "PROC_XRAY",
                description: "X-Ray Imaging",
                quantity: 2,
                unitPrice: {
                    amount: NumberDecimal("120.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("240.00"),
                    currency: "USD"
                },
                category: "PROCEDURE"
            }
        ],
        subtotal: {
            amount: NumberDecimal("590.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("47.20"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("10.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("627.20"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Humana Inc.",
            policyNumber: "HUMANA-DB-20240005",
            coveragePercentage: NumberDecimal("80.00"),
            copayAmount: {
                amount: NumberDecimal("25.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("600.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("175000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("501.76"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("125.44"),
            currency: "USD"
        },
        payments: [],
        paidAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("125.44"),
            currency: "USD"
        },
        status: "SENT",
        notes: "Invoice sent. Insurance pre-authorization in progress.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        patientId: NumberLong("6"), // Emily Davis (auth user_id 13)
        doctorId: NumberLong("7"), // Dr. Jessica Garcia
        appointmentId: NumberLong("6"),
        invoiceNumber: "INV-2024-000006",
        invoiceDate: new Date("2024-01-20"),
        dueDate: new Date("2024-02-19"),
        billingItems: [
            {
                itemCode: "CONS_SPEC",
                description: "Specialist Consultation - Gynecology",
                quantity: 1,
                unitPrice: {
                    amount: NumberDecimal("220.00"),
                    currency: "USD"
                },
                totalPrice: {
                    amount: NumberDecimal("220.00"),
                    currency: "USD"
                },
                category: "CONSULTATION"
            }
        ],
        subtotal: {
            amount: NumberDecimal("220.00"),
            currency: "USD"
        },
        taxAmount: {
            amount: NumberDecimal("17.60"),
            currency: "USD"
        },
        discountAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        totalAmount: {
            amount: NumberDecimal("237.60"),
            currency: "USD"
        },
        insurance: {
            insuranceCompany: "Kaiser Permanente",
            policyNumber: "KAISER-ED-20240006",
            coveragePercentage: NumberDecimal("90.00"),
            copayAmount: {
                amount: NumberDecimal("15.00"),
                currency: "USD"
            },
            deductible: {
                amount: NumberDecimal("300.00"),
                currency: "USD"
            },
            maxCoverage: {
                amount: NumberDecimal("250000.00"),
                currency: "USD"
            }
        },
        insuranceCoverage: {
            amount: NumberDecimal("213.84"),
            currency: "USD"
        },
        patientResponsibility: {
            amount: NumberDecimal("23.76"),
            currency: "USD"
        },
        payments: [
            {
                paymentId: "PAY-2024-000003",
                amount: {
                    amount: NumberDecimal("23.76"),
                    currency: "USD"
                },
                paymentMethod: "DEBIT_CARD",
                transactionId: "TXN-DC-789012",
                paymentDate: new Date("2024-01-21"),
                status: "COMPLETED"
            }
        ],
        paidAmount: {
            amount: NumberDecimal("23.76"),
            currency: "USD"
        },
        outstandingAmount: {
            amount: NumberDecimal("0.00"),
            currency: "USD"
        },
        status: "PAID",
        notes: "Payment received via debit card. Insurance processed efficiently.",
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
print("- " + db.invoices.count() + " invoices");

print("\nReady for testing!"); 