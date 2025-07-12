import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppointmentsByDoctorId, AppointmentDTO } from '@/services/appointmentService';
import { getPatientsByDoctor } from '@/services/patientService';
import { DoctorService } from '@/services/doctorService';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  todayAppointments: number;
  weeklyAppointments: number;
  totalPatients: number;
  newPatients: number;
  avgConsultationTime: string;
  weeklyPerformance: Array<{ name: string; Patients: number; Consultations: number }>;
  recentPatients: Array<{
    id: number;
    name: string;
    status: string;
    lastVisit: string;
    avatar?: string;
    gender: string;
  }>;
  todaySchedule: Array<{
    id: number;
    time: string;
    patient: string;
    type: string;
    status: string;
  }>;
  monthlyStats: {
    completed: number;
    cancelled: number;
    pending: number;
    rescheduled: number;
  };
}

export function useDoctorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [doctorId, setDoctorId] = useState<number | null>(null);

  // Get doctor info first
  const { data: doctorInfo } = useQuery({
    queryKey: ['doctor', user?.id],
    queryFn: () => user?.id ? DoctorService.getDoctorByUserId(Number(user.id)) : null,
    enabled: !!user?.id,
  });

  // Set doctor ID when doctor info is loaded
  useEffect(() => {
    if (doctorInfo?.id) {
      setDoctorId(doctorInfo.id);
    }
  }, [doctorInfo]);

  // Get appointments for the doctor
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ['doctor-appointments', doctorId],
    queryFn: () => getAppointmentsByDoctorId(doctorId!),
    enabled: !!doctorId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Get patients for the doctor
  const { data: patientsResponse, isLoading: loadingPatients } = useQuery({
    queryKey: ['doctor-patients', doctorId],
    queryFn: () => getPatientsByDoctor(doctorId!),
    enabled: !!doctorId,
    refetchInterval: 60000, // Refetch every minute
  });

  const patients = patientsResponse?.data || [];

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

  // Process dashboard statistics
  const dashboardStats: DashboardStats = useMemo(() => {
    if (!appointments.length) {
      return {
        todayAppointments: 0,
        weeklyAppointments: 0,
        totalPatients: patients.length,
        newPatients: 0,
        avgConsultationTime: '0m',
        weeklyPerformance: [],
        recentPatients: [],
        todaySchedule: [],
        monthlyStats: { completed: 0, cancelled: 0, pending: 0, rescheduled: 0 }
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Today's appointments
    const todayAppointments = appointments.filter(apt => apt.date === today);
    
    // Weekly appointments
    const weeklyAppointments = appointments.filter(apt => apt.date >= oneWeekAgo);
    
    // New patients (patients added in last 30 days)
    const newPatients = patients.filter(p => 
      new Date(p.admissionDate).toISOString().split('T')[0] >= oneMonthAgo
    );

    // Weekly performance data
    const weeklyPerformance = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(apt => apt.date === dateStr);
      
      weeklyPerformance.push({
        name: dayNames[date.getDay()],
        Patients: dayAppointments.filter(apt => apt.status === 'COMPLETED').length,
        Consultations: dayAppointments.length
      });
    }

    // Recent patients (last 10 patients seen)
    const recentPatients = patients
      .sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
      .slice(0, 5)
      .map(patient => ({
        id: patient.userId,
        name: `${patient.firstName} ${patient.lastName}`,
        status: patient.status || 'Active',
        lastVisit: getRelativeTime(patient.admissionDate),
        gender: patient.gender,
      }));

    // Today's schedule
    const todaySchedule = todayAppointments
      .sort((a, b) => a.time.localeCompare(b.time))
      .map(apt => ({
        id: apt.id,
        time: formatTime(apt.time),
        patient: apt.patientName,
        type: apt.visitType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        status: apt.status
      }));

    // Monthly statistics
    const monthlyAppointments = appointments.filter(apt => apt.date >= oneMonthAgo);
    const monthlyStats = {
      completed: monthlyAppointments.filter(apt => apt.status === 'COMPLETED').length,
      cancelled: monthlyAppointments.filter(apt => apt.status === 'CANCELLED').length,
      pending: monthlyAppointments.filter(apt => apt.status === 'PENDING' || apt.status === 'SCHEDULED').length,
      rescheduled: monthlyAppointments.filter(apt => apt.status === 'RESCHEDULED').length,
    };

    // Calculate average consultation time (mock for now, would need consultation duration data)
    const avgConsultationTime = monthlyAppointments.length > 0 ? '15m' : '0m';

    return {
      todayAppointments: todayAppointments.length,
      weeklyAppointments: weeklyAppointments.length,
      totalPatients: patients.length,
      newPatients: newPatients.length,
      avgConsultationTime,
      weeklyPerformance,
      recentPatients,
      todaySchedule,
      monthlyStats
    };
  }, [appointments, patients, getRelativeTime, formatTime]);

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['doctor-appointments', doctorId] });
    queryClient.invalidateQueries({ queryKey: ['doctor-patients', doctorId] });
  };

  return {
    dashboardStats,
    doctorInfo,
    isLoading: loadingAppointments || loadingPatients,
    refreshData,
    doctorId
  };
} 