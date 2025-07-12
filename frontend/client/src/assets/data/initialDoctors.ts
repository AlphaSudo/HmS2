// Mock data structure for UI compatibility
interface DoctorUI {
  id: number;
  name: string;
  department: string;
  specialization: string;
  availability: string;
  mobile: string;
  degree: string;
  experience: number;
  consultationFee: number;
  email: string;
}

export const initialDoctors = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@hospital.com",
    mobile: "555-0101",
    specialization: "CARDIOLOGY",
    experience: 15,
    degree: "MD, FACC",
    availability: "Available",
    consultationFee: 250
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    mobile: "555-0102",
    specialization: "PEDIATRICS",
    experience: 8,
    degree: "MD, FAAP",
    availability: "Available",
    consultationFee: 180
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    email: "michael.brown@hospital.com",
    mobile: "555-0103",
    specialization: "NEUROLOGY",
    experience: 12,
    degree: "MD, PhD",
    availability: "Available",
    consultationFee: 300
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    email: "emily.davis@hospital.com",
    mobile: "555-0104",
    specialization: "DERMATOLOGY",
    experience: 6,
    degree: "MD, FAAD",
    availability: "Available",
    consultationFee: 200
  },
  {
    id: 5,
    name: "Dr. Robert Wilson",
    email: "robert.wilson@hospital.com",
    mobile: "555-0105",
    specialization: "ORTHOPEDICS",
    experience: 20,
    degree: "MD, FAAOS",
    availability: "Available",
    consultationFee: 350
  }
];