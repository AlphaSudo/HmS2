// Define appointment data types
export interface Appointment {
  id: number;
  patientName: string;
  doctorId: number; // Added missing doctorId field
  doctor: string;
  gender: "male" | "female" | "MALE" | "FEMALE" | "OTHER";
  date: string;
  time: string;
  phone: string;
  issue: string;
  email: string;
  status: "Completed" | "Scheduled" | "Cancelled" | "Confirmed" | "Pending" | "Rescheduled";
  visitType: "New Patient" | "Follow-Up" | "Routine Checkup" | "Consultation" | "Urgent Care";
  patientId: number; // Made required since backend requires it
}

// Column interface for visibility toggle
export interface ColumnToggle {
  id: string;
  label: string;
  visible: boolean;
}
