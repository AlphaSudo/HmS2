import { api } from '@/lib/api';

export interface Prescription {
  id: number;
  prescriptionNumber: string;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  prescribedDate: string;
  dispensedDate?: string;
  status: string;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Demo data for quick login users (development/demo mode)
const demoData: Prescription[] = [
  {
    id: 1,
    prescriptionNumber: "RX-DEMO-001",
    patientId: 1,
    patientName: "Patient Demo",
    doctorId: 1,
    doctorName: "Dr. Sarah Wilson",
    prescribedDate: "2024-01-15",
    dispensedDate: "2024-01-16",
    status: "dispensed",
    totalAmount: 45.50,
    notes: "Diabetes management medication - Take with food",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z"
  },
  {
    id: 2,
    prescriptionNumber: "RX-DEMO-002", 
    patientId: 1,
    patientName: "Patient Demo",
    doctorId: 2,
    doctorName: "Dr. Michael Johnson",
    prescribedDate: "2024-01-20",
    status: "pending",
    totalAmount: 28.75,
    notes: "Blood pressure medication - Monitor BP daily",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z"
  },
  {
    id: 3,
    prescriptionNumber: "RX-DEMO-003",
    patientId: 1,
    patientName: "Patient Demo", 
    doctorId: 1,
    doctorName: "Dr. Sarah Wilson",
    prescribedDate: "2024-01-10",
    status: "cancelled",
    totalAmount: 15.25,
    notes: "Cancelled due to patient allergy concern",
    createdAt: "2024-01-10T11:20:00Z",
    updatedAt: "2024-01-11T08:45:00Z"
  },
  {
    id: 4,
    prescriptionNumber: "RX-DEMO-004",
    patientId: 1,
    patientName: "Patient Demo",
    doctorId: 3,
    doctorName: "Dr. Emily Chen",
    prescribedDate: "2024-01-25",
    status: "partially_dispensed",
    totalAmount: 67.20,
    notes: "Pain management - Partial fill pending insurance approval",
    createdAt: "2024-01-25T16:45:00Z",
    updatedAt: "2024-01-26T10:30:00Z"
  }
];

export interface CreatePrescriptionRequest {
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  prescribedDate: string;
  notes?: string;
  status?: string;
  totalAmount?: number;
  dispensedDate?: string;
}

const BASE_URL = '/pharmacy/prescriptions';

/**
 * Checks if the current user is in demo mode (quick login)
 */
const isDemoUser = (): boolean => {
  try {
    const token = localStorage.getItem('hms_token');
    const userStr = localStorage.getItem('hms_user');
    
    if (token === 'demo-token') return true;
    
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id?.toString().startsWith('demo-');
    }
    
    return false;
  } catch (error) {
    console.error('Error checking demo user status:', error);
    return false;
  }
};

export const getAllPrescriptions = () => {
  // For demo users (quick login), return sample data with more varied data
  if (isDemoUser()) {
    console.log('Demo mode detected - returning all sample prescription data');
    const expandedDemoData: Prescription[] = [
      ...demoData,
      {
        id: 5,
        prescriptionNumber: "RX-DEMO-005",
        patientId: 2,
        patientName: "John Smith",
        doctorId: 1,
        doctorName: "Dr. Sarah Wilson",
        prescribedDate: "2024-01-28",
        status: "pending",
        totalAmount: 32.80,
        notes: "Antibiotic treatment for respiratory infection",
        createdAt: "2024-01-28T14:20:00Z",
        updatedAt: "2024-01-28T14:20:00Z"
      },
      {
        id: 6,
        prescriptionNumber: "RX-DEMO-006",
        patientId: 3,
        patientName: "Emily Johnson",
        doctorId: 2,
        doctorName: "Dr. Michael Johnson",
        prescribedDate: "2024-01-22",
        dispensedDate: "2024-01-23",
        status: "dispensed",
        totalAmount: 78.25,
        notes: "Cholesterol management medication",
        createdAt: "2024-01-22T11:15:00Z",
        updatedAt: "2024-01-23T16:30:00Z"
      }
    ];
    return Promise.resolve({ 
      data: expandedDemoData 
    });
  }
  
  // For real authenticated users, make API call to backend
  console.log('Real user mode - fetching all prescriptions');
  return api.get<Prescription[]>(BASE_URL);
};

export const getPrescriptionsByPatient = (patientId: number) => {
  // For demo users (quick login), return sample data
  if (isDemoUser()) {
    console.log('Demo mode detected - returning sample prescription data');
    return Promise.resolve({ 
      data: demoData 
    });
  }
  
  // For real authenticated users, make API call to backend
  console.log(`Real user mode - fetching prescriptions for patient ${patientId}`);
  return api.get<Prescription[]>(`${BASE_URL}/patient/${patientId}`);
};

export const getPrescriptionsByDoctor = (doctorId: number) => {
  // For demo users (quick login), return sample data
  if (isDemoUser()) {
    console.log('Demo mode detected - returning sample prescription data for doctor');
    return Promise.resolve({ 
      data: demoData 
    });
  }
  
  // For real authenticated users, make API call to backend
  console.log(`Real user mode - fetching prescriptions for doctor ${doctorId}`);
  return api.get<Prescription[]>(`${BASE_URL}/doctor/${doctorId}`);
};

export const createPrescription = (prescriptionData: CreatePrescriptionRequest) => {
  // For demo users, simulate creating a prescription
  if (isDemoUser()) {
    console.log('Demo mode - simulating prescription creation');
    const newPrescription: Prescription = {
      id: Date.now(), // Simple ID generation for demo
      prescriptionNumber: `RX-DEMO-${String(Date.now()).slice(-3)}`,
      ...prescriptionData,
      status: prescriptionData.status || 'pending', // Ensure status is always defined
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ 
      data: newPrescription 
    });
  }
  
  // For real authenticated users, make API call to backend
  console.log('Real user mode - creating prescription');
  return api.post<Prescription>(BASE_URL, prescriptionData);
};

export const updatePrescription = (id: number, prescriptionData: CreatePrescriptionRequest) => {
  // For demo users, simulate updating a prescription
  if (isDemoUser()) {
    console.log('Demo mode - simulating prescription update');
    const updatedPrescription: Prescription = {
      id,
      prescriptionNumber: `RX-DEMO-${String(id).slice(-3)}`,
      ...prescriptionData,
      status: prescriptionData.status || 'pending', // Ensure status is always defined
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ 
      data: updatedPrescription 
    });
  }
  
  // For real authenticated users, make API call to backend
  console.log(`Real user mode - updating prescription ${id}`);
  return api.put<Prescription>(`${BASE_URL}/${id}`, prescriptionData);
};

export const deletePrescription = (id: number) => {
  // For demo users, simulate deleting a prescription
  if (isDemoUser()) {
    console.log('Demo mode - simulating prescription deletion');
    return Promise.resolve({ data: null });
  }
  
  // For real authenticated users, make API call to backend
  console.log(`Real user mode - deleting prescription ${id}`);
  return api.delete(`${BASE_URL}/${id}`);
}; 