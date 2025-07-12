import { Appointment } from "@/components/types/appointment";
import {
  AppointmentDTO,
  AppointmentStatusBackend,
  VisitTypeBackend,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "@/services/appointmentService";

// -----------------------------
// Enum mapping helpers
// -----------------------------

const statusFrontendToBackend: Record<Appointment["status"], AppointmentStatusBackend> = {
  Scheduled: "SCHEDULED",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
  Confirmed: "CONFIRMED",
  Pending: "PENDING",
  Rescheduled: "RESCHEDULED",
};

const statusBackendToFrontend: Record<AppointmentStatusBackend, Appointment["status"]> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  RESCHEDULED: "Rescheduled",
};

const visitTypeFrontendToBackend: Record<Appointment["visitType"], VisitTypeBackend> = {
  "New Patient": "NEW_PATIENT_VISIT",
  "Follow-Up": "FOLLOW_UP",
  "Routine Checkup": "ROUTINE_CHECKUP",
  "Consultation": "CONSULTATION",
  "Urgent Care": "URGENT_CARE",
};

const visitTypeBackendToFrontend: Record<VisitTypeBackend, Appointment["visitType"]> = {
  NEW_PATIENT_VISIT: "New Patient",
  FOLLOW_UP: "Follow-Up",
  ROUTINE_CHECKUP: "Routine Checkup",
  CONSULTATION: "Consultation",
  URGENT_CARE: "Urgent Care",
};

// -----------------------------
// Helper functions
// -----------------------------

const formatTimeForBackend = (time: string): string => {
  // If time doesn't include seconds, add them
  if (time.length === 5 && time.includes(':')) {
    return `${time}:00`;
  }
  return time;
};

const formatTimeForFrontend = (time: string): string => {
  // Remove seconds for frontend display if present
  if (time.length === 8 && time.includes(':')) {
    return time.substring(0, 5);
  }
  return time;
};

// -----------------------------
// Mapper functions
// -----------------------------

export function toCreateDTO(app: Partial<Appointment>): CreateAppointmentDTO {
  if (!app.patientName || !app.doctor || !app.gender || !app.date || 
      !app.time || !app.phone || !app.issue || !app.email || 
      !app.status || !app.visitType || !app.patientId) {
    throw new Error("Missing required fields for appointment creation");
  }

  return {
    patientName: app.patientName,
    doctorId: app.doctorId || 1, // Default to doctor ID 1 if not provided
    doctor: app.doctor,
    gender: app.gender.toUpperCase(),
    date: app.date,
    time: formatTimeForBackend(app.time),
    mobile: app.phone,
    injury: app.issue,
    email: app.email,
    status: statusFrontendToBackend[app.status],
    visitType: visitTypeFrontendToBackend[app.visitType],
    patientId: app.patientId,
  };
}

export function toUpdateDTO(app: Partial<Appointment>): UpdateAppointmentDTO {
  const dto: UpdateAppointmentDTO = {};
  
  if (app.patientName !== undefined) dto.patientName = app.patientName;
  if (app.doctorId !== undefined) dto.doctorId = app.doctorId;
  if (app.doctor !== undefined) dto.doctor = app.doctor;
  if (app.gender !== undefined) dto.gender = app.gender.toUpperCase();
  if (app.date !== undefined) dto.date = app.date;
  if (app.time !== undefined) dto.time = formatTimeForBackend(app.time);
  if (app.phone !== undefined) dto.mobile = app.phone;
  if (app.issue !== undefined) dto.injury = app.issue;
  if (app.email !== undefined) dto.email = app.email;
  if (app.status !== undefined) dto.status = statusFrontendToBackend[app.status];
  if (app.visitType !== undefined) dto.visitType = visitTypeFrontendToBackend[app.visitType];
  if (app.patientId !== undefined) dto.patientId = app.patientId;
  
  return dto;
}

export function fromDTO(dto: AppointmentDTO): Appointment {
  return {
    id: dto.id,
    patientName: dto.patientName,
    doctorId: dto.doctorId,
    doctor: dto.doctor,
    gender: dto.gender.toLowerCase() as Appointment["gender"],
    date: dto.date,
    time: formatTimeForFrontend(dto.time),
    phone: dto.mobile,
    issue: dto.injury,
    email: dto.email,
    status: statusBackendToFrontend[dto.status],
    visitType: visitTypeBackendToFrontend[dto.visitType],
    patientId: dto.patientId,
  };
} 