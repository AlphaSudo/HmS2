export interface Patient {
  id?: number; // Keep for backward compatibility
  userId: number; // This is the actual field from the API
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  treatment: string;
  gender: string;
  mobile: string;
  admissionDate: string;
  doctorAssigned: string;
  doctorId: number;
  address: string;
  bloodGroup: string;
  dischargeDate?: string;
  status: string;
}

export interface Surgery {
  surgery: string;
  date: string; // Assuming date is a string in ISO format
  notes: string;
}

export interface Medication {
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string; // Assuming date is a string in ISO format
  endDate?: string;
  notes: string;
}

export interface MedicalHistory {
  id: string;
  patientId: number;
  height?: number;
  weight?: number;

  allergies: string[];
  pastConditions: string[];
  surgeries: Surgery[];
  medications: Medication[];
  createdAt: string;
  updatedAt: string;
}

export interface ColumnToggle {
  id: string;
  label: string;
  visible: boolean;
}