import { useState, useEffect } from 'react';
import { getPatientsByDoctor } from '@/services/patientService';
import { Patient } from '@/components/types/patient';

interface UseDoctorPatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to get patients for a specific doctor
 * @param doctorId - Doctor ID to get patients for
 *                   Admin: can use any doctor ID
 *                   Doctor: can only use their own doctor ID (backend validates)
 */
export const useDoctorPatients = (doctorId: number): UseDoctorPatientsResult => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPatientsByDoctor(doctorId);
      setPatients(response.data);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
  };
}; 