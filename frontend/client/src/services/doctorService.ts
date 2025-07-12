import { api } from '@/lib/api';
import { Doctor, UpdateDoctorRequest, Specialization, Gender, DoctorStatus } from '@/components/types/doctor';

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  licenseNumber: string;
  specialization: Specialization;
  experienceYears: number;
  qualification: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  hireDate: string; // ISO date string
  status: DoctorStatus;
  consultationFee: number;
  bio?: string;
}

/**
 * Doctor Service
 * Handles all API calls related to doctor management
 */
export class DoctorService {
  private static readonly BASE_URL = '/doctors';

  /**
   * Get doctor information by user ID
   * @param userId - The user ID to fetch doctor data for
   * @returns Promise<Doctor>
   */
  static async getDoctorByUserId(userId: number): Promise<Doctor> {
    try {
      const response = await api.get(`${this.BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching doctor by user ID:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch doctor information'
      );
    }
  }

  /**
   * Get doctor information by doctor ID
   * @param doctorId - The doctor ID to fetch data for
   * @returns Promise<Doctor>
   */
  static async getDoctorById(doctorId: number): Promise<Doctor> {
    try {
      const response = await api.get(`${this.BASE_URL}/${doctorId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching doctor by ID:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch doctor information'
      );
    }
  }

  /**
   * Update doctor information
   * @param doctorId - The doctor ID to update
   * @param updateData - The data to update
   * @returns Promise<Doctor>
   */
  static async updateDoctor(doctorId: number, updateData: UpdateDoctorRequest): Promise<Doctor> {
    try {
      const response = await api.put(`${this.BASE_URL}/${doctorId}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating doctor:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to update doctor information'
      );
    }
  }

  /**
   * Get all doctors (admin only)
   * @returns Promise<Doctor[]>
   */
  static async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await api.get(`${DoctorService.BASE_URL}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all doctors:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch doctors list'
      );
    }
  }

  /**
   * Create a new doctor (admin only)
   * @param createData - The data for creating a new doctor
   * @returns Promise<Doctor>
   */
  static async createDoctor(createData: CreateDoctorRequest): Promise<Doctor> {
    try {
      const response = await api.post(this.BASE_URL, createData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating doctor:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to create doctor'
      );
    }
  }

  /**
   * Delete a doctor (admin only)
   * @param doctorId - The doctor ID to delete
   * @returns Promise<void>
   */
  static async deleteDoctor(doctorId: number): Promise<void> {
    try {
      await api.delete(`${this.BASE_URL}/${doctorId}`);
    } catch (error: any) {
      console.error('Error deleting doctor:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete doctor'
      );
    }
  }
}

export default DoctorService; 