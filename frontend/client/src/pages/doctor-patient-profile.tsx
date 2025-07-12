import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DoctorSidebar } from "@/components/ui/DoctorSidebar";
import { DoctorHeader } from "@/components/ui/DoctorHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  User, 
  Calendar, 
  Ruler, 
  GaugeCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Pill, 
  HeartPulse, 
  Users,
  ArrowLeft,
  Activity,
  Stethoscope,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getMedicalHistory } from "@/services/patientService";
import { MedicalHistory } from "@/components/types/patient";

interface PatientProfileData {
  // From appointment data
  patientId?: number;
  patientName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  issue?: string;
  status?: string;
  visitType?: string;
  
  // Extended patient data (would come from patient service)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: number;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  maritalStatus?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string[];
  pastConditions?: string[];
  medications?: any[];
  surgeries?: any[];
  doctorAssigned?: string;
  admissionDate?: string;
  lastVisit?: string;
  nextAppointment?: string;
  treatment?: string;
  dischargeDate?: string;
}

export default function DoctorPatientProfile() {
  const [, setLocation] = useLocation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [patientData, setPatientData] = useState<PatientProfileData>({});
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromAdmin, setIsFromAdmin] = useState(false);

  useEffect(() => {
    // Get patient data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const patientDataParam = urlParams.get('patientData');
    
    if (patientDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(patientDataParam));
        setPatientData(data);
        
        // Check if coming from admin interface
        const isAdmin = user?.role === 'admin';
        setIsFromAdmin(isAdmin);
        
        // Try to fetch medical history if we have a patient ID
        const fetchMedicalHistory = async () => {
          try {
            if (data.patientId) {
              const response = await getMedicalHistory(data.patientId);
              setMedicalHistory(response.data);
              
              // Merge medical history data with patient data
              setPatientData(prev => ({
                ...prev,
                height: response.data.height,
                weight: response.data.weight,
                allergies: response.data.allergies,
                pastConditions: response.data.pastConditions,
                medications: response.data.medications,
                surgeries: response.data.surgeries,
              }));
            }
          } catch (error) {
            console.error('Failed to fetch medical history:', error);
            // If medical history fails, just continue with mock data for demo
            setTimeout(() => {
              setPatientData(prev => ({
                ...prev,
                // Mock additional data that would come from patient service
                age: 32,
                height: 170,
                weight: 68,
                emergencyContact: 'Jane Doe (Sister)',
                emergencyPhone: '+1-555-0199',
                allergies: ['Penicillin', 'Peanuts'],
                pastConditions: ['Hypertension', 'Diabetes Type 2'],
                medications: [
                  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
                  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
                ],
                surgeries: [
                  { name: 'Appendectomy', date: '2020-03-15', surgeon: 'Dr. Smith' }
                ],
                lastVisit: '2024-01-10',
                nextAppointment: '2024-02-15'
              }));
            }, 1000);
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchMedicalHistory();
        
      } catch (error) {
        console.error('Error parsing patient data:', error);
        toast({
          title: "Error",
          description: "Unable to load patient profile data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      toast({
        title: "No Patient Data",
        description: "No patient information available",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, user]);

  const renderField = (label: string, value: any, icon: React.ReactNode, bgClass: string) => {
    let displayValue: string | JSX.Element = "-";

    if (Array.isArray(value)) {
      if (value.length > 0) {
        if (typeof value[0] === 'object') {
          displayValue = (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className={cn("text-sm p-2 rounded", theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')}>
                  {Object.entries(item).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key}:</span>
                      <span>{String(val)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        } else {
          displayValue = value.join(", ");
        }
      }
    } else if (value) {
      displayValue = String(value);
    }
    
    return (
      <div className={cn("flex items-start gap-3 p-4 rounded-lg border", theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shadow-md', bgClass)}>
          {icon}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className={cn("text-sm font-medium uppercase tracking-wider", theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground')}>
            {label}
          </span>
          <div className={cn("text-base font-semibold", theme === 'dark' ? 'text-white' : 'text-foreground')}>
            {displayValue}
          </div>
        </div>
      </div>
    );
  };

  const handleGoBack = () => {
    if (isFromAdmin) {
      setLocation('/admin/patients');
    } else {
      setLocation('/doctor/appointments');
    }
  };

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex", theme === "dark" ? "bg-gray-900 text-white" : "bg-background text-foreground")}>
        <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
          <DoctorHeader
            title="Patient Profile"
            subtitle="Loading patient information..."
            icon={<User className="h-5 w-5" />}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className={cn("animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4", theme === 'dark' ? 'border-blue-400' : 'border-blue-600')}></div>
              <p className="text-lg">Loading patient profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex", theme === "dark" ? "bg-gray-900 text-white" : "bg-background text-foreground")}>
      <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
        <DoctorHeader
          title={`Patient: ${patientData.patientName || 'Unknown'}`}
          subtitle="Medical Profile & Information"
          icon={<User className="h-5 w-5" />}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {isFromAdmin ? 'Back to Patients' : 'Back to Appointments'}
              </Button>
            </div>

            {/* Patient Header Card */}
            <div className={cn("mb-8 p-6 rounded-xl shadow-lg", theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white')}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{patientData.patientName}</h1>
                  <div className="flex gap-6 mt-2 text-sm opacity-90">
                    <span>ID: {patientData.patientId}</span>
                    <span>Age: {patientData.age || 'N/A'}</span>
                    <span>Gender: {patientData.gender}</span>
                    <span>Blood Group: {patientData.bloodGroup || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Appointment Info - only show if coming from doctor appointments */}
            {!isFromAdmin && patientData.appointmentDate && (
              <div className="mb-8">
                <h2 className={cn("text-2xl font-bold mb-4 flex items-center gap-2", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                  <Calendar className={cn("h-6 w-6", theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                  Current Appointment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderField("Date", patientData.appointmentDate, <Calendar className="h-5 w-5 text-white" />, "bg-gradient-to-br from-blue-500 to-blue-700")}
                  {renderField("Time", patientData.appointmentTime, <Clock className="h-5 w-5 text-white" />, "bg-gradient-to-br from-purple-500 to-purple-700")}
                  {renderField("Issue/Complaint", patientData.issue, <AlertTriangle className="h-5 w-5 text-white" />, "bg-gradient-to-br from-orange-500 to-red-600")}
                  {renderField("Status", patientData.status, <Activity className="h-5 w-5 text-white" />, "bg-gradient-to-br from-green-500 to-emerald-700")}
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <h2 className={cn("text-2xl font-bold mb-4 flex items-center gap-2", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                <User className={cn("h-6 w-6", theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderField("Email", patientData.email, <Mail className="h-5 w-5 text-white" />, "bg-gradient-to-br from-green-500 to-emerald-700")}
                {renderField("Phone", patientData.phone, <Phone className="h-5 w-5 text-white" />, "bg-gradient-to-br from-blue-400 to-cyan-600")}
                {renderField("Address", patientData.address, <Home className="h-5 w-5 text-white" />, "bg-gradient-to-br from-purple-400 to-fuchsia-600")}
                {renderField("Marital Status", patientData.maritalStatus, <Users className="h-5 w-5 text-white" />, "bg-gradient-to-br from-pink-500 to-rose-600")}
                {renderField("Emergency Contact", patientData.emergencyContact, <Users className="h-5 w-5 text-white" />, "bg-gradient-to-br from-red-500 to-red-700")}
                {renderField("Emergency Phone", patientData.emergencyPhone, <Phone className="h-5 w-5 text-white" />, "bg-gradient-to-br from-red-400 to-red-600")}
              </div>
            </div>

            {/* Medical Information */}
            <div className="mb-8">
              <h2 className={cn("text-2xl font-bold mb-4 flex items-center gap-2", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                <Stethoscope className={cn("h-6 w-6", theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderField("Height", patientData.height ? `${patientData.height} cm` : null, <Ruler className="h-5 w-5 text-white" />, "bg-gradient-to-br from-yellow-400 to-yellow-600")}
                {renderField("Weight", patientData.weight ? `${patientData.weight} kg` : null, <GaugeCircle className="h-5 w-5 text-white" />, "bg-gradient-to-br from-orange-500 to-orange-700")}
                {renderField("Allergies", patientData.allergies, <AlertTriangle className="h-5 w-5 text-white" />, "bg-gradient-to-br from-red-500 to-red-700")}
                {renderField("Past Conditions", patientData.pastConditions, <HeartPulse className="h-5 w-5 text-white" />, "bg-gradient-to-br from-pink-500 to-rose-600")}
              </div>
            </div>

            {/* Medications & Treatments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className={cn("text-2xl font-bold mb-4 flex items-center gap-2", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                  <Pill className={cn("h-6 w-6", theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                  Current Medications
                </h2>
                {renderField("Medications", patientData.medications, <Pill className="h-5 w-5 text-white" />, "bg-gradient-to-br from-pink-400 to-pink-600")}
              </div>
              
              <div>
                <h2 className={cn("text-2xl font-bold mb-4 flex items-center gap-2", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                  <FileText className={cn("h-6 w-6", theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                  Surgery History
                </h2>
                {renderField("Past Surgeries", patientData.surgeries, <FileText className="h-5 w-5 text-white" />, "bg-gradient-to-br from-indigo-500 to-indigo-700")}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 