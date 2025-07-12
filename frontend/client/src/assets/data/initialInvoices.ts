import { Invoice, Money, BillingItem } from '@/services/billingService';

// Helper function to create Money objects
const money = (amount: number, currency = 'USD'): Money => ({ amount, currency });

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-001',
    patientId: 1,
    doctorId: 1,
    appointmentId: 1,
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-01-15T10:00:00Z',
    dueDate: '2024-02-14T23:59:59Z',
    billingItems: [
      {
        itemCode: 'CONSULT-001',
        description: 'General Consultation',
        quantity: 1,
        unitPrice: money(150.00),
        totalPrice: money(150.00),
        category: 'CONSULTATION'
      },
      {
        itemCode: 'LAB-001',
        description: 'Blood Test - Complete Panel',
        quantity: 1,
        unitPrice: money(75.00),
        totalPrice: money(75.00),
        category: 'LAB_TEST'
      }
    ],
    subtotal: money(225.00),
    taxAmount: money(18.00),
    discountAmount: money(0.00),
    totalAmount: money(243.00),
    insuranceCoverage: money(194.40),
    patientResponsibility: money(48.60),
    payments: [
      {
        paymentId: 'pay-001',
        amount: money(48.60),
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-20240116-001',
        paymentDate: '2024-01-16T14:30:00Z',
        status: 'COMPLETED'
      }
    ],
    paidAmount: money(48.60),
    outstandingAmount: money(0.00),
    status: 'PAID',
    notes: 'Routine checkup with blood work. Insurance covered 80%.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    doctorName: 'Dr. Sarah Wilson'
  },
  {
    id: 'inv-002',
    patientId: 2,
    doctorId: 2,
    appointmentId: 2,
    invoiceNumber: 'INV-2024-002',
    invoiceDate: '2024-01-20T09:15:00Z',
    dueDate: '2024-02-19T23:59:59Z',
    billingItems: [
      {
        itemCode: 'PROC-001',
        description: 'Minor Surgery - Mole Removal',
        quantity: 1,
        unitPrice: money(350.00),
        totalPrice: money(350.00),
        category: 'PROCEDURE'
      },
      {
        itemCode: 'MED-001',
        description: 'Antibiotics - Prescription',
        quantity: 1,
        unitPrice: money(25.00),
        totalPrice: money(25.00),
        category: 'MEDICATION'
      }
    ],
    subtotal: money(375.00),
    taxAmount: money(30.00),
    discountAmount: money(37.50),
    totalAmount: money(367.50),
    insuranceCoverage: money(220.50),
    patientResponsibility: money(147.00),
    payments: [],
    paidAmount: money(0.00),
    outstandingAmount: money(147.00),
    status: 'SENT',
    notes: '10% senior citizen discount applied. Patient has 60% insurance coverage.',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    doctorName: 'Dr. Michael Johnson'
  },
  {
    id: 'inv-003',
    patientId: 3,
    doctorId: 1,
    appointmentId: 3,
    invoiceNumber: 'INV-2024-003',
    invoiceDate: '2024-01-25T16:45:00Z',
    dueDate: '2024-02-24T23:59:59Z',
    billingItems: [
      {
        itemCode: 'CONSULT-002',
        description: 'Specialist Consultation - Cardiology',
        quantity: 1,
        unitPrice: money(250.00),
        totalPrice: money(250.00),
        category: 'CONSULTATION'
      },
      {
        itemCode: 'LAB-002',
        description: 'ECG Test',
        quantity: 1,
        unitPrice: money(100.00),
        totalPrice: money(100.00),
        category: 'LAB_TEST'
      },
      {
        itemCode: 'LAB-003',
        description: 'Echocardiogram',
        quantity: 1,
        unitPrice: money(200.00),
        totalPrice: money(200.00),
        category: 'LAB_TEST'
      }
    ],
    subtotal: money(550.00),
    taxAmount: money(44.00),
    discountAmount: money(0.00),
    totalAmount: money(594.00),
    insuranceCoverage: money(475.20),
    patientResponsibility: money(118.80),
    payments: [
      {
        paymentId: 'pay-002',
        amount: money(50.00),
        paymentMethod: 'Cash',
        transactionId: 'TXN-20240126-001',
        paymentDate: '2024-01-26T10:20:00Z',
        status: 'COMPLETED'
      }
    ],
    paidAmount: money(50.00),
    outstandingAmount: money(68.80),
    status: 'OVERDUE',
    notes: 'Cardiac evaluation due to chest pain complaints. Insurance covers 80%. Payment plan available.',
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-26T10:20:00Z',
    doctorName: 'Dr. Sarah Wilson'
  },
  {
    id: 'inv-004',
    patientId: 4,
    doctorId: 3,
    appointmentId: 4,
    invoiceNumber: 'INV-2024-004',
    invoiceDate: '2024-01-28T14:20:00Z',
    dueDate: '2024-02-27T23:59:59Z',
    billingItems: [
      {
        itemCode: 'CONSULT-003',
        description: 'Emergency Room Visit',
        quantity: 1,
        unitPrice: money(400.00),
        totalPrice: money(400.00),
        category: 'CONSULTATION'
      },
      {
        itemCode: 'LAB-004',
        description: 'X-Ray - Chest',
        quantity: 1,
        unitPrice: money(120.00),
        totalPrice: money(120.00),
        category: 'LAB_TEST'
      },
      {
        itemCode: 'MED-002',
        description: 'Pain Medication - Injectable',
        quantity: 2,
        unitPrice: money(35.00),
        totalPrice: money(70.00),
        category: 'MEDICATION'
      }
    ],
    subtotal: money(590.00),
    taxAmount: money(47.20),
    discountAmount: money(0.00),
    totalAmount: money(637.20),
    insuranceCoverage: money(0.00),
    patientResponsibility: money(637.20),
    payments: [],
    paidAmount: money(0.00),
    outstandingAmount: money(637.20),
    status: 'DRAFT',
    notes: 'Emergency visit for acute bronchitis. No insurance coverage. Payment assistance programs available.',
    createdAt: '2024-01-28T14:20:00Z',
    updatedAt: '2024-01-28T14:20:00Z',
    doctorName: 'Dr. Emily Chen'
  },
  {
    id: 'inv-005',
    patientId: 5,
    doctorId: 2,
    appointmentId: 5,
    invoiceNumber: 'INV-2024-005',
    invoiceDate: '2024-02-01T13:45:00Z',
    dueDate: '2024-03-02T23:59:59Z',
    billingItems: [
      {
        itemCode: 'CONSULT-001',
        description: 'Follow-up Consultation',
        quantity: 1,
        unitPrice: money(120.00),
        totalPrice: money(120.00),
        category: 'CONSULTATION'
      },
      {
        itemCode: 'MED-003',
        description: 'Diabetes Medication Refill',
        quantity: 1,
        unitPrice: money(85.00),
        totalPrice: money(85.00),
        category: 'MEDICATION'
      }
    ],
    subtotal: money(205.00),
    taxAmount: money(16.40),
    discountAmount: money(20.50),
    totalAmount: money(200.90),
    insuranceCoverage: money(160.72),
    patientResponsibility: money(40.18),
    payments: [],
    paidAmount: money(0.00),
    outstandingAmount: money(40.18),
    status: 'SENT',
    notes: '10% loyalty discount applied. Patient has good insurance coverage (80%).',
    createdAt: '2024-02-01T13:45:00Z',
    updatedAt: '2024-02-01T13:45:00Z',
    doctorName: 'Dr. Michael Johnson'
  },
  {
    id: 'inv-006',
    patientId: 6,
    doctorId: 4,
    appointmentId: 6,
    invoiceNumber: 'INV-2024-006',
    invoiceDate: '2024-02-03T16:00:00Z',
    dueDate: '2024-03-05T23:59:59Z',
    billingItems: [
      {
        itemCode: 'PROC-002',
        description: 'Physical Therapy Session',
        quantity: 3,
        unitPrice: money(80.00),
        totalPrice: money(240.00),
        category: 'PROCEDURE'
      },
      {
        itemCode: 'CONSULT-004',
        description: 'Physiotherapist Consultation',
        quantity: 1,
        unitPrice: money(100.00),
        totalPrice: money(100.00),
        category: 'CONSULTATION'
      }
    ],
    subtotal: money(340.00),
    taxAmount: money(27.20),
    discountAmount: money(0.00),
    totalAmount: money(367.20),
    insuranceCoverage: money(293.76),
    patientResponsibility: money(73.44),
    payments: [
      {
        paymentId: 'pay-003',
        amount: money(73.44),
        paymentMethod: 'Debit Card',
        transactionId: 'TXN-20240204-001',
        paymentDate: '2024-02-04T11:15:00Z',
        status: 'COMPLETED'
      }
    ],
    paidAmount: money(73.44),
    outstandingAmount: money(0.00),
    status: 'PAID',
    notes: 'Physical therapy for post-surgical rehabilitation. 3-session package. 80% insurance coverage.',
    createdAt: '2024-02-03T16:00:00Z',
    updatedAt: '2024-02-04T11:15:00Z',
    doctorName: 'Dr. James Rodriguez'
  }
]; 