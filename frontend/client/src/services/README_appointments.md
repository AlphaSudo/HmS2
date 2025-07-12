# Appointment Service Documentation

## Overview

The appointment service provides full CRUD operations for managing appointments, plus additional endpoints for filtering by patient and doctor. The frontend is fully aligned with the backend REST API.

## Backend-Frontend Alignment

### ✅ **Fully Aligned Features:**

1. **CRUD Operations**
   - ✅ Create appointment
   - ✅ Read appointment(s)
   - ✅ Update appointment  
   - ✅ Delete appointment

2. **Special Endpoints**
   - ✅ Get appointments by patient ID
   - ✅ Get appointments by doctor ID

3. **Data Mapping**
   - ✅ Field name mapping (mobile ↔ phone, injury ↔ issue)
   - ✅ Enum value mapping (status and visit types)
   - ✅ Time format handling (HH:mm ↔ HH:mm:ss)

4. **Error Handling**
   - ✅ Comprehensive error messages
   - ✅ HTTP status code handling
   - ✅ Custom error types

## API Endpoints

### Base URL
```
/appointments (routed through API Gateway to appointment-scheduling-service)
```

### 1. Get All Appointments
```typescript
// GET /appointments
const appointments = await getAppointments();
```

### 2. Get Appointment by ID
```typescript
// GET /appointments/{id}
const appointment = await getAppointmentById(123);
```

### 3. Create Appointment
```typescript
// POST /appointments
const newAppointment = await createAppointment({
  patientName: "John Doe",
  doctorId: 1,
  doctor: "Dr. Smith",
  gender: "MALE",
  date: "2024-01-15",
  time: "10:30:00",
  mobile: "123-456-7890",
  injury: "Regular checkup",
  email: "john@example.com",
  status: "SCHEDULED",
  visitType: "NEW_PATIENT_VISIT",
  patientId: 456
});
```

### 4. Update Appointment
```typescript
// PUT /appointments/{id}
const updatedAppointment = await updateAppointment(123, {
  status: "CONFIRMED",
  time: "11:00:00"
});
```

### 5. Delete Appointment
```typescript
// DELETE /appointments/{id}
await deleteAppointment(123);
```

### 6. Get Appointments by Patient
```typescript
// GET /appointments/patient/{patientId}
const patientAppointments = await getAppointmentsByPatientId(456);
```

### 7. Get Appointments by Doctor
```typescript
// GET /appointments/doctor/{doctorId}
const doctorAppointments = await getAppointmentsByDoctorId(1);
```

## Utility Functions

### Get Today's Appointments
```typescript
const todaysAppointments = await getTodaysAppointments();
```

### Get Upcoming Appointments
```typescript
const upcomingAppointments = await getUpcomingAppointments();
```

### Get Appointments by Status
```typescript
const scheduledAppointments = await getAppointmentsByStatus("SCHEDULED");
```

## Data Types

### Frontend Types
```typescript
interface Appointment {
  id: number;
  patientName: string;
  doctorId: number;
  doctor: string;
  gender: "male" | "female" | "MALE" | "FEMALE" | "OTHER";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  phone: string;
  issue: string;
  email: string;
  status: "Completed" | "Scheduled" | "Cancelled" | "Confirmed" | "Pending" | "Rescheduled";
  visitType: "New Patient" | "Follow-Up" | "Routine Checkup" | "Consultation" | "Urgent Care";
  patientId: number;
}
```

### Backend Types
```typescript
interface AppointmentDTO {
  id: number;
  patientName: string;
  doctorId: number;
  doctor: string;
  gender: string;
  date: string; // YYYY-MM-DD (LocalDate)
  time: string; // HH:mm:ss (LocalTime)
  mobile: string;
  injury: string;
  email: string;
  status: AppointmentStatusBackend;
  visitType: VisitTypeBackend;
  patientId: number;
}
```

### Status Enums
```typescript
// Backend
type AppointmentStatusBackend = 
  | "SCHEDULED" | "CONFIRMED" | "CANCELLED" 
  | "COMPLETED" | "PENDING" | "RESCHEDULED";

// Frontend
type AppointmentStatus = 
  | "Scheduled" | "Confirmed" | "Cancelled" 
  | "Completed" | "Pending" | "Rescheduled";
```

### Visit Type Enums
```typescript
// Backend
type VisitTypeBackend = 
  | "ROUTINE_CHECKUP" | "NEW_PATIENT_VISIT" | "FOLLOW_UP" 
  | "CONSULTATION" | "URGENT_CARE";

// Frontend  
type VisitType = 
  | "Routine Checkup" | "New Patient" | "Follow-Up" 
  | "Consultation" | "Urgent Care";
```

## Data Mapping

The `appointmentMapper.ts` utility handles automatic conversion between frontend and backend formats:

### Frontend → Backend (toCreateDTO, toUpdateDTO)
- `phone` → `mobile`
- `issue` → `injury`
- `"HH:mm"` → `"HH:mm:ss"` (time format)
- User-friendly enums → Backend enums

### Backend → Frontend (fromDTO)
- `mobile` → `phone`
- `injury` → `issue`
- `"HH:mm:ss"` → `"HH:mm"` (time format)
- Backend enums → User-friendly enums

## Error Handling

### Custom Error Type
```typescript
class AppointmentServiceError extends Error {
  constructor(message: string, public statusCode?: number);
}
```

### Usage with Try-Catch
```typescript
try {
  const appointment = await createAppointment(appointmentData);
  // Handle success
} catch (error) {
  if (error instanceof AppointmentServiceError) {
    console.error(`Appointment error: ${error.message} (Status: ${error.statusCode})`);
  }
  // Handle error
}
```

## Integration with Admin Page

The `appointments.tsx` page is fully integrated with the service:

1. **Form Fields**: Include all required fields including `doctorId`
2. **Status Options**: All backend status values are supported
3. **Visit Types**: All backend visit types are supported  
4. **Data Validation**: Phone number validation and required field checks
5. **Error Handling**: User-friendly error messages with toasts

## Authentication & Authorization

All endpoints require proper authentication tokens. The API client automatically includes JWT tokens from localStorage.

### Required Roles:
- **GET /appointments**: ADMIN or DOCTOR
- **GET /appointments/{id}**: ADMIN, DOCTOR, or PATIENT  
- **GET /appointments/patient/{id}**: ADMIN, DOCTOR, or PATIENT
- **GET /appointments/doctor/{id}**: ADMIN or DOCTOR (with ID validation)
- **POST /appointments**: ADMIN or PATIENT
- **PUT /appointments/{id}**: ADMIN or PATIENT
- **DELETE /appointments/{id}**: ADMIN only

## Testing the Integration

### 1. Start the Backend Services
```bash
# Start the appointment-scheduling-service
cd "backend (hms)/appointment-scheduling-service"
./mvnw spring-boot:run
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Test the Endpoints
1. Navigate to `/appointments` in the admin interface
2. Try creating a new appointment with all fields
3. Test editing an existing appointment
4. Test filtering by patient/doctor (if implemented in UI)
5. Test deletion (admin only)

## Example Usage in Components

```typescript
import { 
  getAppointments, 
  getAppointmentsByPatientId,
  createAppointment,
  AppointmentServiceError 
} from '@/services/appointmentService';
import { fromDTO, toCreateDTO } from '@/utils/appointmentMapper';

// In a React component
const fetchPatientAppointments = async (patientId: number) => {
  try {
    const dtos = await getAppointmentsByPatientId(patientId);
    const appointments = dtos.map(fromDTO);
    setAppointments(appointments);
  } catch (error) {
    if (error instanceof AppointmentServiceError) {
      toast.error(`Failed to load appointments: ${error.message}`);
    }
  }
};
```

This service provides a complete, type-safe, and error-handled interface for all appointment operations between the frontend and backend. 