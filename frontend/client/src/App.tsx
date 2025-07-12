import { Switch, Route } from "wouter";
import { Suspense } from "react";
import { queryClient } from "./services/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import PatientProfilePage from "@/pages/patient-profile";
import PatientAppointmentsPage from "@/pages/patient-appointments";
import PatientPrescriptionsPage from "@/pages/patient-prescriptions";
import PatientBillingPage from "@/pages/patient-billing";
import PatientDashboard from "@/pages/patient-dashboard";
import Dashboard from "@/pages/dashboard";
import AppointmentsPage from "@/pages/appointments";
import DoctorsPage from "@/pages/doctors";
import NotFound from "@/pages/not-found";
import PatientsPage from "@/pages/patients";

import StrokeAssessmentPage from "@/pages/stroke-assessment";
import PatientMedicalProfile from "@/pages/patient-medical-profile";
import LiverDiseasePredictionPage from "@/pages/liver-disease-prediction";
import DiabetesPredictionPage from "@/pages/diabetes-prediction";
import DoctorDashboard from "@/pages/doctor-dashboard";
import DoctorAppointmentsPage from "@/pages/doctor-appointments";
import DoctorPatientsPage from "@/pages/doctor-patients";
import DoctorProfilePage from "@/pages/doctor-profile";
import DoctorCalendarPage from "@/pages/doctor-calendar";
import DoctorTasksPage from "@/pages/doctor-tasks";
import DoctorPrescriptionsPage from "@/pages/doctor-prescriptions";
import DoctorPatientProfile from "@/pages/doctor-patient-profile";
import PrescriptionsPage from "@/pages/prescriptions";
import BillingPage from "@/pages/billing";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute allowedRoles={['admin']}>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/appointments">
        <ProtectedRoute allowedRoles={['admin']}>
          <AppointmentsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/doctors">
        <ProtectedRoute allowedRoles={['admin']}>
          <DoctorsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/patients">
        <ProtectedRoute allowedRoles={['admin']}>
          <PatientsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/prescriptions">
        <ProtectedRoute allowedRoles={['admin']}>
          <PrescriptionsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/billing">
        <ProtectedRoute allowedRoles={['admin']}>
          <BillingPage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/patient-profile">
        <ProtectedRoute allowedRoles={['admin']}>
          <PatientProfilePage />
        </ProtectedRoute>
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/appointments">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorAppointmentsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/patients">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorPatientsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/prescriptions">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorPrescriptionsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/profile">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorProfilePage />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/calendar">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorCalendarPage />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/tasks">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorTasksPage />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor/patient-profile">
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorPatientProfile />
        </ProtectedRoute>
      </Route>

      {/* User Profile Route */}
      <Route path="/user/:userId">
        <ProtectedRoute allowedRoles={['admin', 'doctor']}>
          <DoctorPatientProfile />
        </ProtectedRoute>
      </Route>

      {/* Patient Routes */}
      <Route path="/patient/dashboard">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/appointments">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientAppointmentsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/prescriptions">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientPrescriptionsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/billing">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientBillingPage />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/stroke-assessment">
        <ProtectedRoute allowedRoles={['patient']}>
          <StrokeAssessmentPage />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/liver-disease-prediction">
        <ProtectedRoute allowedRoles={['patient']}>
          <LiverDiseasePredictionPage />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/diabetes-prediction">
        <ProtectedRoute allowedRoles={['patient']}>
          <DiabetesPredictionPage />
        </ProtectedRoute>
      </Route>
      <Route path="/patient/profile/:patientId">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientMedicalProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-profile">
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientProfilePage />
        </ProtectedRoute>
      </Route>

      {/* Legacy Routes for backward compatibility */}
      <Route path="/hms" component={() => <ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" component={() => <ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
      <Route path="/appointments" component={() => <ProtectedRoute allowedRoles={['admin']}><AppointmentsPage /></ProtectedRoute>} />

      <Route path="/patient-appointments" component={() => <ProtectedRoute allowedRoles={['patient']}><PatientAppointmentsPage /></ProtectedRoute>} />
      <Route path="/patient-prescriptions" component={() => <ProtectedRoute allowedRoles={['patient']}><PatientPrescriptionsPage /></ProtectedRoute>} />
      <Route path="/patient-billing" component={() => <ProtectedRoute allowedRoles={['patient']}><PatientBillingPage /></ProtectedRoute>} />
      <Route path="/stroke-assessment" component={() => <ProtectedRoute allowedRoles={['patient']}><StrokeAssessmentPage /></ProtectedRoute>} />

      <Route component={NotFound} />
    </Switch>
  );
}

const AppToaster = () => {
  const { theme } = useTheme();
  return <SonnerToaster position="top-right" richColors theme={theme === 'dark' ? 'dark' : 'light'} />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>}>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AppToaster />
              <Router />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
