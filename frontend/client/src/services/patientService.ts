import { api } from '@/lib/api';
import { Patient } from '@/components/types/patient';

export const getAllPatients = () => api.get<Patient[]>('/patients');
export const getPatientById = (id: number) => api.get<Patient>(`/patients/${id}`);
export const createPatient = (patient: Partial<Patient>) => api.post<Patient>('/patients', patient);
export const updatePatient = (id: number, patient: Partial<Patient>) => {
  return api.put(`/patients/${id}`, patient);
};
export const getPatientByUserId = (userId: string) => {
  return api.get(`/patients/user/${userId}`);
};
export const deletePatient = (id: number) => {
  return api.delete(`/patients/${id}`);
};

export const getPatientProfile = (id: number) => {
  return api.get(`/patients/${id}/profile`);
};

export const updateMedicalHistory = (patientId: number, historyData: any) => {
  return api.put(`/patients/${patientId}/history`, historyData);
};

export const getMedicalHistory = (patientId: number) => api.get(`/patients/${patientId}/history`);

export const getMedicalHistoryByUserId = (userId: number) => api.get(`/patients/user/${userId}`);

// Simple endpoint - just pass doctor ID
// Admin: can use any doctor ID
// Doctor: can only use their own doctor ID (backend validates)
export const getPatientsByDoctor = (doctorId: number) => 
  api.get<Patient[]>(`/patients/doctor/${doctorId}`);

export const getPatientDetails = (patientId: number) => 
  api.get(`/patients/${patientId}/details`); 