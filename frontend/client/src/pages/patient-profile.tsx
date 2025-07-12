import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { createPatient } from '@/services/patientService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DoctorService } from '@/services/doctorService';
import { Doctor, getSpecializationDisplay } from '@/components/types/doctor';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface Surgery {
  name: string;
  date: string;
  surgeon: string;
  hospital: string;
  notes: string;
}

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  doctorAssigned: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;

  // Medical History
  height: string;
  weight: string;
  allergies: string | string[];
  pastConditions: string | string[];
  surgeries: Surgery[];
  medications: Medication[];

  // Contact Info
  mobile: string;
  email: string;
  address: string;

  // Admission Details
  treatment: string;
  admissionDate: string;
  status: string;
  dischargeDate: string;
}

export default function PatientProfilePage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { user } = useAuth();

  // State for doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Updated form state
  const [formData, setFormData] = useState<FormData>({
    // Personal Info
    firstName: '',
    lastName: '',
    doctorAssigned: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',

    // Medical History
    height: '',
    weight: '',
    allergies: '',
    pastConditions: '',
    surgeries: [],
    medications: [],

    // Contact Info
    mobile: '',
    email: '',
    address: '',

    // Admission Details
    treatment: '',
    admissionDate: '',
    status: '',
    dischargeDate: '',
  });

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const doctorsData = await DoctorService.getAllDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        toast({
          variant: 'destructive',
          title: t('errors.genericError', 'Something went wrong'),
          description: 'Failed to load doctors list',
        });
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [t]);

  // Helper functions for medications
  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: '',
          dosage: '',
          frequency: '',
          startDate: '',
          endDate: '',
          notes: '',
        },
      ],
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedMedications = [...prev.medications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };
      return {
        ...prev,
        medications: updatedMedications,
      };
    });
  };

  // Helper functions for surgeries
  const addSurgery = () => {
    setFormData(prev => ({
      ...prev,
      surgeries: [
        ...prev.surgeries,
        {
          name: '',
          date: '',
          surgeon: '',
          hospital: '',
          notes: '',
        },
      ],
    }));
  };

  const removeSurgery = (index: number) => {
    setFormData(prev => ({
      ...prev,
      surgeries: prev.surgeries.filter((_, i) => i !== index),
    }));
  };

  const handleSurgeryChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedSurgeries = [...prev.surgeries];
      updatedSurgeries[index] = {
        ...updatedSurgeries[index],
        [field]: value,
      };
      return {
        ...prev,
        surgeries: updatedSurgeries,
      };
    });
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const arrayFields = ['allergies', 'pastConditions'];

    if (arrayFields.includes(name)) {
      // Clean up any brackets or braces and split by comma
      const cleanValue = value.replace(/[\[\]{}]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue.split(',').map(item => item.trim()).filter(item => item),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // For admin-created patients, generate a unique userId starting from 10000
      // For self-registration, use the current user's ID
      const isAdminCreating = user?.role === 'admin';
      const generateUniqueUserId = () => {
        // Generate userId starting from 10000 to avoid conflicts with existing users
        return Math.floor(Math.random() * 90000) + 10000; // Random between 10000-99999
      };
      
      const patientUserId = isAdminCreating ? generateUniqueUserId() : user?.id;
      
      // Find the selected doctor to get the doctorId
      const selectedDoctorName = formData.doctorAssigned;
      const selectedDoctor = doctors.find(doctor => 
        `Dr. ${doctor.firstName} ${doctor.lastName}` === selectedDoctorName
      );
      
      if (!selectedDoctor) {
        toast({
          variant: 'destructive',
          title: t('errors.genericError', 'Something went wrong'),
          description: 'Please select a valid doctor',
        });
        return;
      }

      const {
        firstName,
        lastName,
        doctorAssigned,
        dateOfBirth,
        gender,
        maritalStatus,
        bloodGroup,
        height,
        weight,
        mobile,
        email,
        address,
        treatment,
        admissionDate,
        status,
        dischargeDate,
        allergies,
        pastConditions,
        surgeries,
        medications,
      } = formData;

      const sanitize = (val: string) => (val && val.trim() !== '' ? val : undefined);
      
      // Ensure arrays are properly formatted
      const formatArray = (field: string | string[]): string[] => {
        if (Array.isArray(field)) {
          return field.filter(item => item && item.trim() !== '');
        }
        if (typeof field === 'string' && field.trim()) {
          const cleaned = field.replace(/[\[\]{}]/g, '');
          return cleaned.split(',').map(item => item.trim()).filter(item => item);
        }
        return [];
      };

      // Format dates for backend (YYYY-MM-DD format)
      const formatDate = (dateStr: string) => {
        if (!dateStr) return undefined;
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      };

      // Validate mobile number format
      const mobileRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (mobile && !mobileRegex.test(mobile)) {
        toast({
          variant: 'destructive',
          title: 'Invalid Mobile Number',
          description: 'Please enter mobile number in format: 123-456-7890',
        });
        return;
      }

      // Prepare the PatientProfileDTO payload
      const patientPayload = {
        userId: Number(patientUserId), // Always include userId
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: sanitize(email),
        dateOfBirth: formatDate(dateOfBirth),
        maritalStatus: sanitize(maritalStatus),
        gender: sanitize(gender),
        mobile: sanitize(mobile),
        doctorAssigned: sanitize(doctorAssigned),
        doctorId: selectedDoctor.id, // Add the required doctorId
        address: sanitize(address),
        bloodGroup: sanitize(bloodGroup),
        treatment: sanitize(treatment),
        admissionDate: formatDate(admissionDate),
        status: sanitize(status),
        dischargeDate: formatDate(dischargeDate),
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        allergies: formatArray(allergies),
        pastConditions: formatArray(pastConditions),
        surgeries: surgeries.length > 0 ? surgeries.map(s => ({
          surgery: s.name,
          date: s.date ? new Date(s.date).toISOString() : undefined,
          notes: s.notes,
        })) : [],
        medications: medications.length > 0 ? medications.map(m => ({
          medication: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          startDate: m.startDate ? new Date(m.startDate).toISOString() : undefined,
          endDate: m.endDate ? new Date(m.endDate).toISOString() : undefined,
          notes: m.notes,
        })) : [],
      };

      console.log('Sending patient payload:', patientPayload); // Debug log
      console.log('Is admin creating patient:', isAdminCreating); // Debug log
      console.log('Generated userId:', patientUserId); // Debug log

      const createRes = await createPatient(patientPayload);
      const patientId = createRes.data.id;

      toast({
        title: t('success.saved', 'Saved successfully!'),
        description: t('patientProfile.toast.profileCreated', 'Profile created successfully.'),
      });

      window.location.href = `/patient/profile/${patientId}`;
    } catch (error: any) {
      console.error('Failed to submit patient profile', error);
      
      // Handle specific error cases
      const errorMessage = error?.response?.data?.message || error?.message;
      
      if (errorMessage && errorMessage.includes('Mobile number') && errorMessage.includes('already in use')) {
        toast({
          variant: 'destructive',
          title: 'Mobile Number Already Exists',
          description: 'This mobile number is already registered. Please use a different mobile number.',
        });
      } else if (errorMessage && errorMessage.includes('E11000 duplicate key error')) {
        toast({
          variant: 'destructive',
          title: 'Database Conflict',
          description: 'A medical history record already exists. Please contact administrator to clean up orphaned data.',
        });
      } else if (error?.response?.status === 400) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: errorMessage || 'Please check your input and try again.',
        });
      } else if (error?.response?.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Server Error',
          description: 'Internal server error occurred. Please try again or contact administrator.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('errors.genericError', 'Something went wrong'),
          description: errorMessage || t('errors.networkError', 'Network error'),
        });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'} ${
      theme === 'dark' ? 'bg-[#040223]' : 'bg-background'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 ${isRTL ? 'right-20' : 'left-20'} w-32 h-32 rounded-full animate-pulse ${
          theme === 'dark' ? 'bg-gradient-to-br from-purple-500/10 to-transparent' : 'bg-gradient-to-br from-primary/10 to-transparent'
        }`}></div>
        <div className={`absolute top-40 ${isRTL ? 'left-32' : 'right-32'} w-24 h-24 rounded-full animate-bounce delay-1000 ${
          theme === 'dark' ? 'bg-gradient-to-br from-pink-500/10 to-transparent' : 'bg-gradient-to-br from-accent/10 to-transparent'
        }`}></div>
        <div className={`absolute bottom-32 ${isRTL ? 'right-1/3' : 'left-1/3'} w-40 h-40 rounded-full animate-pulse delay-500 ${
          theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-transparent' : 'bg-gradient-to-br from-primary/10 to-transparent'
        }`}></div>
      </div>

      {/* Header */}
      <header className={`backdrop-blur-md shadow-2xl sticky top-0 z-50 ${
        theme === 'dark' ? 'bg-[#05002E]/80 border-b border-purple-500/20' : 'bg-card/80 border-b border-primary/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('auth.landing.brandName')}</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageToggle />
              <Link href="/login">
                <button className={`transition-colors ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                }`}>
                  {t('auth.signup.backToLogin')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Phase Images */}
      {currentStep === 1 && (
        <div className={`fixed top-20 ${isRTL ? 'left-8' : 'right-8'} w-32 h-32 bg-cover bg-center bg-no-repeat z-50 rounded-lg shadow-2xl`} style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80)'
        }}></div>
      )}
      {currentStep === 2 && (
        <div className={`fixed top-20 ${isRTL ? 'left-8' : 'right-8'} w-32 h-32 bg-cover bg-center bg-no-repeat z-50 rounded-lg shadow-2xl`} style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80)'
        }}></div>
      )}
      {currentStep === 3 && (
        <div className={`fixed top-20 ${isRTL ? 'left-8' : 'right-8'} w-32 h-32 bg-cover bg-center bg-no-repeat z-50 rounded-lg shadow-2xl`} style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80)'
        }}></div>
      )}
      {currentStep === 4 && (
        <div className={`fixed top-20 ${isRTL ? 'left-8' : 'right-8'} w-32 h-32 bg-cover bg-center bg-no-repeat z-50 rounded-lg shadow-2xl`} style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80)'
        }}></div>
      )}

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('patientProfile.title')}</h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('patientProfile.subtitle')}</p>
            </div>
            
            {/* Progress Bar */}
            <div className={`w-full rounded-full h-3 mb-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-muted'}`}>
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-primary'
                }`}
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
            <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
              <span className={currentStep >= 1 ? (theme === 'dark' ? 'text-purple-400' : 'text-primary') : ''}>{t('patientProfile.steps.personalInfo')}</span>
              <span className={currentStep >= 2 ? (theme === 'dark' ? 'text-purple-400' : 'text-primary') : ''}>{t('patientProfile.steps.medicalInfo')}</span>
              <span className={currentStep >= 3 ? (theme === 'dark' ? 'text-purple-400' : 'text-primary') : ''}>{t('patientProfile.steps.contactInfo')}</span>
              <span className={currentStep >= 4 ? (theme === 'dark' ? 'text-purple-400' : 'text-primary') : ''}>{t('patientProfile.steps.admissionDetails')}</span>
            </div>
          </div>

          {/* Form Card */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#05002E]/80 border border-purple-900/50 shadow-purple-900/30' 
              : 'bg-card/80 border border-border shadow-primary/30'
          }`}>
            <div className={`absolute inset-0 opacity-50 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10' 
                : 'bg-gradient-to-br from-primary/10 via-transparent to-accent/10'
            }`}></div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('patientProfile.personalInfo.title')}</h3>
                    
                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="doctorAssigned" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        {t('patientProfile.personalInfo.doctorName')} *
                      </label>
                      <select
                        id="doctorAssigned"
                        name="doctorAssigned"
                        required
                        value={formData.doctorAssigned}
                        onChange={handleInputChange}
                        disabled={loadingDoctors}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent custom-select ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        } ${loadingDoctors ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <option value="">
                          {loadingDoctors ? 'Loading doctors...' : t('patientProfile.personalInfo.selectDoctor', 'Select a doctor')}
                        </option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={`Dr. ${doctor.firstName} ${doctor.lastName}`}>
                            Dr. {doctor.firstName} {doctor.lastName} - {getSpecializationDisplay(doctor.specialization)}
                          </option>
                        ))}
                      </select>
                      {loadingDoctors && (
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                          Loading available doctors...
                        </p>
                      )}
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="firstName" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        {t('patientProfile.personalInfo.firstName')} *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.personalInfo.firstNamePlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="lastName" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        {t('patientProfile.personalInfo.lastName')} *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.personalInfo.lastNamePlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="dateOfBirth" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {t('patientProfile.personalInfo.dateOfBirth')} *
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="text"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => (e.target.type = 'text')}
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder={t('patientProfile.personalInfo.dateOfBirthPlaceholder')}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="gender" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        {t('patientProfile.personalInfo.sex')} *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent custom-select ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <option value="">{t('patientProfile.personalInfo.pleaseSelect')}</option>
                        <option value="Male">{t('patientProfile.personalInfo.male')}</option>
                        <option value="Female">{t('patientProfile.personalInfo.female')}</option>
                    
                      </select>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'rtl-grid' : ''}`}>
                      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                        <label htmlFor="maritalStatus" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className={`w-6 h-6 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          {t('patientProfile.personalInfo.maritalStatus')} *
                        </label>
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          required
                          value={formData.maritalStatus}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent custom-select ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          <option value="">{t('patientProfile.personalInfo.pleaseSelect')}</option>
                          <option value="single">{t('patientProfile.personalInfo.single')}</option>
                          <option value="married">{t('patientProfile.personalInfo.married')}</option>
                          <option value="divorced">{t('patientProfile.personalInfo.divorced')}</option>
                          <option value="separated">{t('patientProfile.personalInfo.separated')}</option>
                          <option value="widowed">{t('patientProfile.personalInfo.widowed')}</option>
                        </select>
                      </div>
                      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                        <label htmlFor="bloodGroup" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className={`w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6s-2 4-4 4-4-4-4-4 2-4 4-4 4 4 4 4zm0 12s-2-4-4-4-4 4-4 4 2 4 4 4 4-4 4-4zm8-12s-2 4-4 4-4-4-4-4 2-4 4-4 4 4 4 4zm0 12s-2-4-4-4-4 4-4 4 2 4 4 4 4-4 4-4z"/>
                            </svg>
                          </div>
                          {t('patientProfile.personalInfo.bloodGroup')} *
                        </label>
                        <input
                          id="bloodGroup"
                          name="bloodGroup"
                          type="text"
                          required
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark'
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500'
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          placeholder={t('patientProfile.personalInfo.bloodGroupPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'rtl-grid' : ''}`}>
                      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                        <label htmlFor="height" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className={`w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </div>
                          {t('patientProfile.personalInfo.height')} *
                        </label>
                        <input
                          id="height"
                          name="height"
                          type="number"
                          required
                          min="12"
                          max="96"
                          value={formData.height}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark'
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500'
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          placeholder={t('patientProfile.personalInfo.heightPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                        <label htmlFor="weight" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className={`w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-6-2" />
                            </svg>
                          </div>
                          {t('patientProfile.personalInfo.weight')} *
                        </label>
                        <input
                          id="weight"
                          name="weight"
                          type="number"
                          required
                          min="50"
                          max="500"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark'
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500'
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          placeholder={t('patientProfile.personalInfo.weightPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Medical Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('patientProfile.medicalInfo.title')}</h3>
                    
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label htmlFor="allergies" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                          </svg>
                        </div>
                        {t('patientProfile.medicalInfo.allergies')}
                      </label>
                      <textarea
                        id="allergies"
                        name="allergies"
                        rows={2}
                        value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.medicalInfo.allergiesPlaceholder', 'Enter allergies separated by commas (e.g., Peanuts, Shellfish, Latex)')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label htmlFor="pastConditions" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6M5 20V4a2 2 0 012-2h10a2 2 0 012 2v16" />
                          </svg>
                        </div>
                        {t('patientProfile.medicalInfo.pastConditions')}
                      </label>
                      <textarea
                        id="pastConditions"
                        name="pastConditions"
                        rows={2}
                        value={Array.isArray(formData.pastConditions) ? formData.pastConditions.join(', ') : formData.pastConditions}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.medicalInfo.pastConditionsPlaceholder', 'Enter conditions separated by commas (e.g., Diabetes, Hypertension)')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    {/* Medications Section */}
<div>
  <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
    <div className={`w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h8M12 7v8m4-12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
    {t('patientProfile.medicalInfo.medications')}
  </label>

  {formData.medications.length === 0 && (
    <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
      {t('patientProfile.medicalInfo.noMedications')}
    </div>
  )}

  {formData.medications.map((medication, index) => (
                        <div key={index} className="mb-6 p-4 rounded-lg border-2 border-gray-400 dark:border-purple-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Medication Name */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.medicationName')}
                              </label>
                              <input
                                type="text"
                                value={medication.name}
                                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.medicationNamePlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Dosage */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.dosage')}
                              </label>
                              <input
                                type="text"
                                value={medication.dosage}
                                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.dosagePlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Frequency */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.frequency')}
                              </label>
                              <input
                                type="text"
                                value={medication.frequency}
                                onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.frequencyPlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Start Date */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.startDate')}
                              </label>
                              <input
                                type="text"
                                value={medication.startDate}
                                onFocus={(e) => (e.target.type = 'date')}
                                onBlur={(e) => (e.target.type = 'text')}
                                onChange={(e) => handleMedicationChange(index, 'startDate', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.startDatePlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* End Date */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.endDate')}
                              </label>
                              <input
                                type="text"
                                value={medication.endDate}
                                onFocus={(e) => (e.target.type = 'date')}
                                onBlur={(e) => (e.target.type = 'text')}
                                onChange={(e) => handleMedicationChange(index, 'endDate', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.endDatePlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Notes */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.notes')}
                              </label>
                              <textarea
                                rows={2}
                                value={medication.notes}
                                onChange={(e) => handleMedicationChange(index, 'notes', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.notesPlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className={`text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                            >
                              {t('common.remove')}
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addMedication}
                        className={`mt-2 flex items-center gap-2 py-2 text-blue-500 hover:text-blue-600`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="m12 8 4 4-4 4"/><path d="m8 12h8"/></svg>
                        {t('patientProfile.medicalInfo.addMedication')}
                      </button>
                    </div>

                    {/* Surgeries Section */}
                    <div className="mt-6">
                      <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        {t('patientProfile.medicalInfo.surgeries')}
                      </label>

                      {formData.surgeries.length === 0 && (
                        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('patientProfile.medicalInfo.noSurgeries')}
                        </div>
                      )}

                      {formData.surgeries.map((surgery, index) => (
                        <div key={index} className="mb-6 p-4 rounded-lg border-2 border-gray-400 dark:border-purple-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Surgery Name */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.surgeryName')}
                              </label>
                              <input
                                type="text"
                                value={surgery.name}
                                onChange={(e) => handleSurgeryChange(index, 'name', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.surgeryNamePlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Surgery Date */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.surgeryDate')}
                              </label>
                              <input
                                type="text"
                                value={surgery.date}
                                onFocus={(e) => (e.target.type = 'date')}
                                onBlur={(e) => (e.target.type = 'text')}
                                onChange={(e) => handleSurgeryChange(index, 'date', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.surgeryDatePlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Surgeon */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.surgeon')}
                              </label>
                              <input
                                type="text"
                                value={surgery.surgeon}
                                onChange={(e) => handleSurgeryChange(index, 'surgeon', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.surgeonPlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Hospital */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.hospital')}
                              </label>
                              <input
                                type="text"
                                value={surgery.hospital}
                                onChange={(e) => handleSurgeryChange(index, 'hospital', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.hospitalPlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>

                            {/* Notes */}
                            <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                              <label className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                {t('patientProfile.medicalInfo.notes')}
                              </label>
                              <textarea
                                rows={2}
                                value={surgery.notes}
                                onChange={(e) => handleSurgeryChange(index, 'notes', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                                  theme === 'dark' 
                                    ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                    : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                                }`}
                                placeholder={t('patientProfile.medicalInfo.notesPlaceholder')}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => removeSurgery(index)}
                              className={`text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                            >
                              {t('common.remove')}
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addSurgery}
                        className={`mt-2 flex items-center gap-2 py-2 text-blue-500 hover:text-blue-600`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="m12 8 4 4-4 4"/><path d="m8 12h8"/></svg>
                        {t('patientProfile.medicalInfo.addSurgery')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('patientProfile.contactInfo.title')}</h3>
                    
                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="mobile" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <svg className={`w-5 h-5 text-blue-400 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {t('patientProfile.contactInfo.phoneNumber')} *
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          required
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          placeholder={t('patientProfile.contactInfo.phoneNumberPlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                        {user?.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              // Generate unique mobile number for testing
                              const randomNum = Math.floor(Math.random() * 9000) + 1000;
                              const uniqueMobile = `555-${String(randomNum).slice(0,3)}-${String(randomNum).slice(3)}`;
                              setFormData(prev => ({ ...prev, mobile: uniqueMobile }));
                            }}
                            className={`px-3 py-2 text-xs rounded-lg border-2 transition-all duration-300 ${
                              theme === 'dark'
                                ? 'bg-purple-600 hover:bg-purple-700 border-purple-700 text-white'
                                : 'bg-primary hover:bg-primary/90 border-primary text-primary-foreground'
                            }`}
                            title="Generate unique mobile number for testing"
                          >
                            Auto
                          </button>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        Format: 123-456-7890 {user?.role === 'admin' && '(Click "Auto" to generate unique number)'}
                      </p>
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="email" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <svg className={`w-5 h-5 text-green-400 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {t('patientProfile.contactInfo.email')} *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.contactInfo.emailPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="address" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <svg className={`w-5 h-5 text-purple-400 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {t('patientProfile.contactInfo.streetAddress')} *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={4}
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.contactInfo.streetAddressPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Admission Details */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('patientProfile.admissionDetails.title')}</h3>
                    
                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="treatment" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        {t('patientProfile.admissionDetails.treatment')}
                      </label>
                      <input
                        id="treatment"
                        name="treatment"
                        type="text"
                        value={formData.treatment}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.admissionDetails.treatmentPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                      <label htmlFor="status" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                          </svg>
                        </div>
                        {t('patientProfile.admissionDetails.status')}
                      </label>
                      <input
                        id="status"
                        name="status"
                        type="text"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('patientProfile.admissionDetails.statusPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'rtl-grid' : ''}`}>
                      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                        <label htmlFor="admissionDate" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          {t('patientProfile.admissionDetails.admissionDate')}
                        </label>
                        <input
                          id="admissionDate"
                          name="admissionDate"
                          type="text"
                          onFocus={(e) => (e.target.type = 'date')}
                          onBlur={(e) => (e.target.type = 'text')}
                          value={formData.admissionDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          placeholder={t('patientProfile.admissionDetails.admissionDatePlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
                        <label htmlFor="dischargeDate" className={`flex items-center text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          {t('patientProfile.admissionDetails.dischargeDate')}
                        </label>
                        <input
                          id="dischargeDate"
                          name="dischargeDate"
                          type="text"
                          onFocus={(e) => (e.target.type = 'date')}
                          onBlur={(e) => (e.target.type = 'text')}
                          value={formData.dischargeDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                          placeholder={t('patientProfile.admissionDetails.dischargeDatePlaceholder')}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className={`flex justify-between pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                        theme === 'dark' 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {t('common.previous')}
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      key="next-btn"
                      type="button"
                      onClick={nextStep}
                      className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                        isRTL ? 'mr-auto' : 'ml-auto'
                      } ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white hover:shadow-xl hover:shadow-purple-500/40' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl hover:shadow-primary/40'
                      }`}
                    >
                      {t('common.next')}
                    </button>
                  ) : (
                    <button
                      key="submit-btn"
                      type="submit"
                      className={`py-3 px-8 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                        isRTL ? 'mr-auto' : 'ml-auto'
                      } ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white hover:shadow-xl hover:shadow-purple-500/40' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl hover:shadow-primary/40'
                      }`}
                    >
                      {t('patientProfile.completeEnrollment')}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 ${isRTL ? 'right-1/4' : 'left-1/4'} w-2 h-2 rounded-full animate-ping ${
          theme === 'dark' ? 'bg-purple-400' : 'bg-primary/60'
        }`}></div>
        <div className={`absolute top-3/4 ${isRTL ? 'left-1/4' : 'right-1/4'} w-1 h-1 rounded-full animate-ping delay-1000 ${
          theme === 'dark' ? 'bg-pink-400' : 'bg-accent/60'
        }`}></div>
        <div className={`absolute top-1/2 ${isRTL ? 'right-3/4' : 'left-3/4'} w-1.5 h-1.5 rounded-full animate-ping delay-500 ${
          theme === 'dark' ? 'bg-blue-400' : 'bg-primary/60'
        }`}></div>
      </div>
    </div>
  );
} 