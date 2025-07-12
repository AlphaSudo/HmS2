export enum Specialization {
  GENERAL_PRACTICE = 'GENERAL_PRACTICE',
  CARDIOLOGY = 'CARDIOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  PEDIATRICS = 'PEDIATRICS',
  DERMATOLOGY = 'DERMATOLOGY',
  GYNECOLOGY = 'GYNECOLOGY',
  EMERGENCY_MEDICINE = 'EMERGENCY_MEDICINE',
  RADIOLOGY = 'RADIOLOGY',
  PSYCHIATRY = 'PSYCHIATRY',
  SURGERY = 'SURGERY',
  ONCOLOGY = 'ONCOLOGY',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  PULMONOLOGY = 'PULMONOLOGY'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export enum DoctorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED',
  PROBATION = 'PROBATION'
}

export interface Doctor {
  id: number;
  userId?: number; // For API compatibility
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  licenseNumber: string;
  specialization: Specialization;
  experienceYears: number;
  qualification: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  hireDate: string; // ISO date string
  status: DoctorStatus;
  consultationFee: number;
  bio?: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface UpdateDoctorRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  licenseNumber?: string;
  specialization?: Specialization;
  experienceYears?: number;
  qualification?: string;
  dateOfBirth?: string; // ISO date string
  gender?: Gender;
  hireDate?: string; // ISO date string
  status?: DoctorStatus;
  consultationFee?: number;
  bio?: string;
}

export interface ColumnToggle {
  id: string;
  label: string;
  visible: boolean;
}

// Helper functions for display
export const getSpecializationDisplay = (specialization: Specialization): string => {
  return specialization.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const getGenderDisplay = (gender: Gender): string => {
  return gender.charAt(0) + gender.slice(1).toLowerCase();
};

export const getStatusDisplay = (status: DoctorStatus): string => {
  return status.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};