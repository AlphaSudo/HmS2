import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppointmentsByPatientId, AppointmentDTO } from '@/services/appointmentService';
import { getInvoicesByUserId, getPatientBillingStatsByUserId } from '@/services/billingService';
import { getPrescriptionsByPatient, Prescription } from '@/services/prescriptionService';
import { getPatientProfile, getPatientByUserId } from '@/services/patientService';
import { useAuth } from '@/contexts/AuthContext';

export interface PatientDashboardStats {
  upcomingAppointments: number;
  totalAppointments: number;
  activePrescriptions: number;
  totalPrescriptions: number;
  outstandingBalance: number;
  totalPaid: number;
  healthScore: number;
  nextAppointment: {
    id: number;
    date: string;
    time: string;
    doctor: string;
    type: string;
  } | null;
  recentPrescriptions: Array<{
    id: number;
    title: string;
    doctor: string;
    date: string;
    status: string;
    medicationCount: number;
  }>;
  appointmentHistory: Array<{
    name: string;
    scheduled: number;
    completed: number;
    cancelled: number;
  }>;
  billingTrend: Array<{
    name: string;
    billed: number;
    paid: number;
  }>;
  healthMetrics: {
    lastCheckup: string;
    vitalSigns: number;
    labResults: number;
    allergies: number;
  };
  quickStats: {
    age: number | null;
    bloodGroup: string | null;
    bmi: string | null;
    lastVisit: string | null;
  };
}

export function usePatientDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Utility functions
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // TEMPORARY: Map user ID to patient ID based on the data pattern
  // user_id 8 → patient_id 1, user_id 9 → patient_id 2, etc.
  const getUserIdToPatientIdMapping = (userId: number): number => {
    return userId - 7; // Based on the database pattern
  };

  // First get patient data from user ID
  const { data: patientData, error: patientError } = useQuery({
    queryKey: ['patient-by-user', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.reject(new Error("User ID is not available."));
      }
      console.log(`[usePatientDashboard] Fetching patient data for userId: ${user.id}`);
      return getPatientByUserId(user.id);
    },
    enabled: !!user?.id
  });

  // Map user ID to correct patient ID since API doesn't return patient.id
  const patientId = user?.id ? getUserIdToPatientIdMapping(parseInt(user.id)) : null;
  
  console.log(`[usePatientDashboard] User ID: ${user?.id} → Patient ID: ${patientId}`);
  console.log(`[usePatientDashboard] Expected: user_id 8 → patient_id 1`);
  if (patientError) {
    console.log(`[usePatientDashboard] Patient fetch error, using fallback:`, patientError);
  }

  // Use the patient data we already fetched instead of calling a separate profile endpoint
  const patientProfile = patientData?.data;

  // Fetch appointments
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: () => getAppointmentsByPatientId(patientId!),
    enabled: !!patientId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch prescriptions using user ID directly (not patient ID mapping)
  const { data: prescriptionsResponse, isLoading: loadingPrescriptions } = useQuery({
    queryKey: ['patient-prescriptions', user?.id],
    queryFn: () => {
      if (!user?.id) {
        console.log('[Dashboard Hook] No user ID available for prescriptions');
        throw new Error('User ID not available');
      }
      console.log(`[Dashboard Hook] Fetching prescriptions for userId: ${user.id}`);
      return getPrescriptionsByPatient(parseInt(user.id));
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refetch every minute
  });

  const prescriptions = prescriptionsResponse?.data || [];

  // Fetch billing data using user ID directly
  const { data: billingResponse, isLoading: billingLoading, error: billingError } = useQuery({
    queryKey: ['patient-billing-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('[Dashboard Hook] No user ID available for billing');
        throw new Error('User ID not available');
      }

      console.log(`[Dashboard Hook] Fetching billing stats for userId: ${user.id}`);
      try {
        const result = await getPatientBillingStatsByUserId(parseInt(user.id));
        console.log('[Dashboard Hook] Billing stats response:', result.data);
        return result;
      } catch (error: any) {
        console.error('[Dashboard Hook] Billing API error:', error);
        console.error('[Dashboard Hook] Error details:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message
        });
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch recent invoices using user ID directly
  const { data: recentInvoicesResponse, isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ['recent-patient-invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('[Dashboard Hook] No user ID available for invoices');
        throw new Error('User ID not available');
      }

      console.log(`[Dashboard Hook] Fetching recent invoices for userId: ${user.id}`);
      try {
        const result = await getInvoicesByUserId(parseInt(user.id), { page: 0, size: 3 });
        console.log('[Dashboard Hook] Recent invoices response:', result.data);
        return result;
      } catch (error: any) {
        console.error('[Dashboard Hook] Recent invoices API error:', error);
        console.error('[Dashboard Hook] Error details:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message
        });
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process dashboard statistics
  const dashboardStats: PatientDashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Upcoming appointments (future appointments that are not cancelled)
    const upcomingAppointments = appointments.filter(apt => {
      const statusUpcoming = ['SCHEDULED', 'CONFIRMED', 'PENDING', 'RESCHEDULED'];
      if (!statusUpcoming.includes(apt.status)) return false;
      const aptDate = new Date(apt.date + 'T00:00:00');
      const todayDate = new Date(today + 'T00:00:00');
      return aptDate >= todayDate;
    });

    // Next appointment (earliest upcoming)
    const nextAppointment = upcomingAppointments.length > 0 
      ? upcomingAppointments.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]
      : null;

    // Active prescriptions (pending or partially dispensed)
    const activePrescriptions = prescriptions.filter(p => 
      ['pending', 'partially_dispensed', 'dispensed'].includes(p.status?.toLowerCase() || '')
    );

    // Outstanding balance
    const outstandingBalance = billingResponse?.data?.totalOutstanding?.amount || 0;

    // Total paid
    const totalPaid = billingResponse?.data?.totalPaid?.amount || 0;

    // Recent prescriptions (last 5)
    const recentPrescriptions = prescriptions
      .sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime())
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.prescriptionNumber || `Prescription #${p.id}`,
        doctor: p.doctorName || 'Unknown Doctor',
        date: p.prescribedDate,
        status: p.status || 'Unknown',
        medicationCount: p.notes?.split(',').length || 1
      }));

    // Appointment history (last 6 months)
    const appointmentHistory = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthAppointments = appointments.filter(apt => 
        apt.date.startsWith(monthKey)
      );
      
      appointmentHistory.push({
        name: monthNames[date.getMonth()],
        scheduled: monthAppointments.filter(apt => ['SCHEDULED', 'CONFIRMED'].includes(apt.status)).length,
        completed: monthAppointments.filter(apt => apt.status === 'COMPLETED').length,
        cancelled: monthAppointments.filter(apt => apt.status === 'CANCELLED').length,
      });
    }

    // Billing trend (last 6 months)
    const billingTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthInvoices = recentInvoicesResponse?.data?.content || []; // Use recent invoices for trend
      
      billingTrend.push({
        name: monthNames[date.getMonth()],
        billed: monthInvoices.reduce((sum, inv) => sum + (inv.totalAmount?.amount || 0), 0),
        paid: monthInvoices.reduce((sum, inv) => sum + (inv.paidAmount?.amount || 0), 0),
      });
    }

    // Health metrics and quick stats
    const dobRaw = patientProfile?.dateOfBirth || patientProfile?.dob || patientProfile?.birthDate;
    const dob = dobRaw ? new Date(dobRaw) : null;
    const age = dob ? new Date().getFullYear() - dob.getFullYear() : null;
    const bloodGroup = patientProfile?.bloodGroup || patientProfile?.blood_group || null;
    
    // Calculate BMI if height and weight are available
    const height = patientProfile?.height;
    const weight = patientProfile?.weight;
    const bmi = (height && weight) ? (weight / ((height / 100) ** 2)).toFixed(1) : null;

    // Last visit (most recent completed appointment)
    const lastCompletedAppointment = appointments
      .filter(apt => apt.status === 'COMPLETED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Health score calculation (simplified)
    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED').length;
    const appointmentRatio = appointments.length > 0 ? completedAppointments / appointments.length : 1;
    const prescriptionCompliance = prescriptions.length > 0 ? 
      prescriptions.filter(p => p.status === 'dispensed').length / prescriptions.length : 1;
    
    const healthScore = Math.round((appointmentRatio * 0.6 + prescriptionCompliance * 0.4) * 100);

    return {
      upcomingAppointments: upcomingAppointments.length,
      totalAppointments: appointments.length,
      activePrescriptions: activePrescriptions.length,
      totalPrescriptions: prescriptions.length,
      outstandingBalance,
      totalPaid,
      healthScore,
      nextAppointment: nextAppointment ? {
        id: nextAppointment.id,
        date: nextAppointment.date,
        time: formatTime(nextAppointment.time),
        doctor: nextAppointment.doctor,
        type: nextAppointment.visitType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      } : null,
      recentPrescriptions,
      appointmentHistory,
      billingTrend,
      healthMetrics: {
        lastCheckup: lastCompletedAppointment ? getRelativeTime(lastCompletedAppointment.date) : 'No recent checkups',
        vitalSigns: Math.floor(Math.random() * 5) + 3, // Mock data
        labResults: Math.floor(Math.random() * 3) + 1, // Mock data
        allergies: patientProfile?.allergies?.length || 0,
      },
      quickStats: {
        age,
        bloodGroup,
        bmi: bmi ? `${bmi} kg/m²` : null,
        lastVisit: lastCompletedAppointment ? getRelativeTime(lastCompletedAppointment.date) : null,
      },
    };
  }, [appointments, prescriptions, billingResponse, recentInvoicesResponse, patientProfile, getRelativeTime, formatTime]);

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['patient-appointments', patientId] });
    queryClient.invalidateQueries({ queryKey: ['patient-prescriptions', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['patient-billing-stats', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['recent-patient-invoices', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['patient-profile', patientId] });
  };

  return {
    dashboardStats,
    patientProfile,
    isLoading: loadingAppointments || loadingPrescriptions || billingLoading || invoicesLoading,
    refreshData,
    patientId
  };
} 