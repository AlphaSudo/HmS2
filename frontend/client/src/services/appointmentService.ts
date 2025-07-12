// Appointment scheduling service API helpers
import { api } from "@/lib/api";

// -----------------------------
// Backend DTO type definitions
// -----------------------------

export type AppointmentStatusBackend =
  | "SCHEDULED"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "PENDING"
  | "RESCHEDULED";

export type VisitTypeBackend =
  | "ROUTINE_CHECKUP"
  | "NEW_PATIENT_VISIT"
  | "FOLLOW_UP"
  | "CONSULTATION"
  | "URGENT_CARE";

export interface AppointmentDTO {
  id: number;
  patientName: string;
  doctorId: number;
  doctor: string;
  gender: string;
  date: string; // LocalDate serializes to string (YYYY-MM-DD)
  time: string; // LocalTime serializes to string (HH:mm:ss)
  mobile: string;
  injury: string;
  email: string;
  status: AppointmentStatusBackend;
  visitType: VisitTypeBackend;
  patientId: number;
}

export interface CreateAppointmentDTO {
  patientName: string;
  doctorId: number;
  doctor: string;
  gender: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss or HH:mm
  mobile: string;
  injury: string;
  email: string;
  status: AppointmentStatusBackend;
  visitType: VisitTypeBackend;
  patientId: number;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {}

// -----------------------------
// Error handling
// -----------------------------

export class AppointmentServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'AppointmentServiceError';
  }
}

const handleApiError = (error: any, operation: string): never => {
  const message = error.response?.data?.message || error.message || `Failed to ${operation}`;
  const statusCode = error.response?.status;
  throw new AppointmentServiceError(message, statusCode);
};

// -----------------------------
// REST calls
// -----------------------------

const BASE_URL = "/appointments"; // Routed through API Gateway

export async function getAppointments(): Promise<AppointmentDTO[]> {
  try {
    const { data } = await api.get<AppointmentDTO[]>(BASE_URL);
    return data;
  } catch (error) {
    return handleApiError(error, 'fetch appointments');
  }
}

export async function getAppointmentById(id: number): Promise<AppointmentDTO> {
  try {
    const { data } = await api.get<AppointmentDTO>(`${BASE_URL}/${id}`);
    return data;
  } catch (error) {
    return handleApiError(error, `fetch appointment ${id}`);
  }
}

export async function createAppointment(
  payload: CreateAppointmentDTO,
): Promise<AppointmentDTO> {
  try {
    const { data } = await api.post<AppointmentDTO>(BASE_URL, payload);
    return data;
  } catch (error) {
    return handleApiError(error, 'create appointment');
  }
}

export async function updateAppointment(
  id: number,
  payload: UpdateAppointmentDTO,
): Promise<AppointmentDTO> {
  try {
    const { data } = await api.put<AppointmentDTO>(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error) {
    return handleApiError(error, `update appointment ${id}`);
  }
}

export async function deleteAppointment(id: number): Promise<void> {
  try {
    await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    return handleApiError(error, `delete appointment ${id}`);
  }
}

export async function getAppointmentsByPatientId(patientId: string | number): Promise<AppointmentDTO[]> {
  try {
    const { data } = await api.get<AppointmentDTO[]>(`${BASE_URL}/patient/${patientId}`);
    return data;
  } catch (error) {
    return handleApiError(error, `fetch appointments for patient ${patientId}`);
  }
}

export async function getAppointmentsByDoctorId(doctorId: string | number): Promise<AppointmentDTO[]> {
  try {
    const { data } = await api.get<AppointmentDTO[]>(`${BASE_URL}/doctor/${doctorId}`);
    return data;
  } catch (error) {
    return handleApiError(error, `fetch appointments for doctor ${doctorId}`);
  }
}

// -----------------------------
// Utility functions
// -----------------------------

/**
 * Get appointments for today
 */
export async function getTodaysAppointments(): Promise<AppointmentDTO[]> {
  try {
    const allAppointments = await getAppointments();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return allAppointments.filter(appointment => appointment.date === today);
  } catch (error) {
    return handleApiError(error, 'fetch today\'s appointments');
  }
}

/**
 * Get upcoming appointments (future dates)
 */
export async function getUpcomingAppointments(): Promise<AppointmentDTO[]> {
  try {
    const allAppointments = await getAppointments();
    const today = new Date().toISOString().split('T')[0];
    return allAppointments.filter(appointment => appointment.date >= today);
  } catch (error) {
    return handleApiError(error, 'fetch upcoming appointments');
  }
}

/**
 * Get appointments by status
 */
export async function getAppointmentsByStatus(status: AppointmentStatusBackend): Promise<AppointmentDTO[]> {
  try {
    const allAppointments = await getAppointments();
    return allAppointments.filter(appointment => appointment.status === status);
  } catch (error) {
    return handleApiError(error, `fetch appointments with status ${status}`);
  }
} 