import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { PatientHeader } from "@/components/ui/PatientHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { FileText, User, Calendar, Ruler, GaugeCircle, Phone, Mail, MapPin, Home, Pill, HeartPulse, Users } from "lucide-react";
import { getPatientById, getPatientByUserId } from "@/services/patientService"; // Assuming this function is added to patientService

interface ProfileData {
  firstName?: string;
  lastName?: string;
  doctorName?: string;
  dateOfBirth?: string;
  sex?: string;
  height?: number;
  weight?: number;
  maritalStatus?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
  pastConditions?: string[];
  surgeries?: any[]; // Replace with proper types if available
  medications?: any[]; // Replace with proper types if available
  // Omitting emergency contact fields for now
}

export default function PatientMedicalProfile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState<ProfileData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          // This service function needs to be created to call the new backend endpoint
          const response = await getPatientByUserId(user.id);
          const profileData = {
            ...response.data,
            doctorName: response.data.doctorAssigned,
            sex: response.data.gender,
            contactNumber: response.data.mobile,
            streetAddress: response.data.address,
          };
          setData(profileData);
        } catch (error) {
          console.error("Failed to fetch patient profile:", error);
          // Handle error (e.g., show a toast notification)
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  const renderField = (label: string, key: string) => {
    const value = data[key as keyof ProfileData];
    let displayValue: string | JSX.Element = "-";

    if (Array.isArray(value)) {
      if (value.length > 0) {
        // Handle arrays of objects (e.g., medications, surgeries)
        if (key === 'medications' || key === 'surgeries') {
          displayValue = (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="text-sm">
                  {renderObjectAsList(item)}
                </div>
              ))}
            </div>
          );
        } else {
          displayValue = value.join(", ");
        }
      } else {
        displayValue = "-";
      }
    } else if (typeof value === 'object' && value !== null) {
      // Handle single objects (if needed)
      displayValue = renderObjectAsList(value);
    } else if (value) {
      displayValue = String(value);
    }
    
    return (
      <div className="flex items-start gap-3">
        {/* Icon circle */}
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shadow-md', getIconBg(key))}>
          {getFieldIcon(key)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={cn("text-xs font-medium uppercase tracking-wider", theme==='dark' ? 'text-gray-400' : 'text-muted-foreground')}>{label}</span>
          <div className={cn("text-sm font-semibold", theme==='dark' ? 'text-white' : 'text-foreground')}>{displayValue}</div>
        </div>
      </div>
    );
  };
  
  // Helper function to render an object as a list of key-value pairs
  const renderObjectAsList = (obj: Record<string, any>) => {
    return (
      <ul className="list-disc list-inside space-y-1">
        {Object.entries(obj).map(([key, val]) => (
          <li key={key}>
            <span className="font-medium">{key}:</span>{" "}
            <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Icon mapping
  const getFieldIcon = (key: string) => {
    const iconProps = { className: 'w-4 h-4 text-white' };
    switch (key) {
      case 'doctorName':
      case 'firstName':
      case 'lastName':
        return <User {...iconProps} />;
      case 'dateOfBirth':
        return <Calendar {...iconProps} />;
      case 'sex':
        return <HeartPulse {...iconProps} />;
      case 'height':
        return <Ruler {...iconProps} />;
      case 'weight':
        return <GaugeCircle {...iconProps} />;
      case 'contactNumber':
      case 'emergencyContactNumber':
        return <Phone {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      case 'streetAddress':
      case 'address':
      case 'streetAddress2':
        return <Home {...iconProps} />;
      case 'city':
      case 'state':
      case 'zipCode':
        return <MapPin {...iconProps} />;
      case 'takingMedications':
      case 'medicationsList':
      case 'medications':
        return <Pill {...iconProps} />;
      case 'emergencyContactFirstName':
      case 'emergencyContactLastName':
      case 'emergencyRelationship':
        return <Users {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const getIconBg = (key: string) => {
    switch (key) {
      case 'doctorName':
      case 'firstName':
      case 'lastName':
        return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'dateOfBirth':
        return 'bg-gradient-to-br from-purple-500 to-indigo-700';
      case 'sex':
        return 'bg-gradient-to-br from-pink-500 to-rose-600';
      case 'height':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'weight':
        return 'bg-gradient-to-br from-orange-500 to-orange-700';
      case 'contactNumber':
      case 'emergencyContactNumber':
        return 'bg-gradient-to-br from-blue-400 to-cyan-600';
      case 'email':
        return 'bg-gradient-to-br from-green-500 to-emerald-700';
      case 'streetAddress':
      case 'address':
      case 'streetAddress2':
        return 'bg-gradient-to-br from-purple-400 to-fuchsia-600';
      case 'city':
      case 'state':
      case 'zipCode':
        return 'bg-gradient-to-br from-teal-500 to-teal-700';
      case 'takingMedications':
      case 'medicationsList':
      case 'medications':
        return 'bg-gradient-to-br from-pink-400 to-pink-600';
      case 'emergencyContactFirstName':
      case 'emergencyContactLastName':
      case 'emergencyRelationship':
        return 'bg-gradient-to-br from-red-500 to-red-700';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  // Section configuration for cleaner grouping
  const sections = [
    {
      title: t('patientMedicalProfile.sections.personal', 'Personal Information'),
      fields: [
        ['doctorName', t('patientMedicalProfile.labels.doctorName', 'Doctor Name')],
        ['firstName', t('patientMedicalProfile.labels.firstName', 'First Name')],
        ['lastName', t('patientMedicalProfile.labels.lastName', 'Last Name')],
        ['dateOfBirth', t('patientMedicalProfile.labels.dateOfBirth', 'Date of Birth')],
        ['sex', t('patientMedicalProfile.labels.sex', 'Sex')],
      ],
    },
    {
      title: t('patientMedicalProfile.sections.body', 'Body Metrics'),
      fields: [
        ['height', t('patientMedicalProfile.labels.height', 'Height') + ' (cm)'],
        ['weight', t('patientMedicalProfile.labels.weight', 'Weight') + ' (kg)'],
        ['maritalStatus', t('patientMedicalProfile.labels.maritalStatus', 'Marital Status')],
      ],
    },
    {
      title: t('patientMedicalProfile.sections.contact', 'Contact Information'),
      fields: [
        ['contactNumber', t('patientMedicalProfile.labels.contactNumber', 'Contact Number')],
        ['email', t('patientMedicalProfile.labels.email', 'Email')],
        ['address', t('patientMedicalProfile.labels.address', 'Address')],
        ['bloodGroup', t('patientMedicalProfile.labels.bloodGroup', 'Blood Group')],
      ],
    },
    {
      title: t('patientMedicalProfile.sections.allergies', 'Allergies & Past Conditions'),
      fields: [
          ['allergies', t('patientMedicalProfile.labels.allergies', 'Allergies')],
          ['pastConditions', t('patientMedicalProfile.labels.pastConditions', 'Past Conditions')],
      ],
    },
    {
      title: t('patientMedicalProfile.sections.medications', 'Medications'),
      fields: [
        ['medications', t('patientMedicalProfile.labels.medications', 'Medications')],
      ],
    },
    {
      title: t('patientMedicalProfile.sections.surgeries', 'Surgeries'),
      fields: [
        ['surgeries', t('patientMedicalProfile.labels.surgeries', 'Surgeries')],
      ],
    },
  ];

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-[#05002E] to-[#12072e] text-white' : 'bg-background text-foreground')}>
      <PatientSidebar isOpen={true} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
        <PatientHeader
          title={t('patientMedicalProfile.title', 'Medical Profile')}
          subtitle={t('patientMedicalProfile.subtitle', 'Personal and medical details overview')}
          icon={<FileText className="w-5 h-5 text-white" />}
        />
        <main className="flex-1 p-8 overflow-auto flex justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6]/40 to-[#06B6D4]/40 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 animate-spin text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Loading your medical profile...</h3>
              <p className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-muted-foreground')}>
                Please wait while we fetch your medical information.
              </p>
            </div>
          ) : (
          <div className={cn('w-full max-w-4xl', theme==='dark' ? 'bg-white/5 backdrop-blur-sm border-white/10' : 'bg-card border shadow-sm')}>
            {/* Card header */}
            <div className="flex flex-col items-center gap-4 px-8 pt-8">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6]/40 to-[#06B6D4]/40 flex items-center justify-center text-4xl font-bold text-white capitalize">
                {`${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`}
              </div>
              {/* Name & role */}
              <div className="text-center">
                <h2 className={cn('text-2xl font-semibold', theme==='dark' ? 'text-white' : 'text-foreground')}>
                  {`${data.firstName || ''} ${data.lastName || ''}`.trim() || t('patientMedicalProfile.labels.fullName','Unnamed')}
                </h2>
                <p className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-muted-foreground')}>
                  {t('patientMedicalProfile.labels.doctorName','Doctor')}: {data.doctorName || '-'}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className={cn('my-8', theme==='dark' ? 'border-white/10' : 'border-border')} />

            {/* Sections */}
            <div className="px-8 pb-12">
              {sections.map((section) => (
                <div key={section.title} className={cn('mb-8 last:mb-0')}>
                  <h3 className={cn('text-lg font-semibold mb-4', theme==='dark' ? 'text-white' : 'text-foreground')}>{section.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map(([key, label]) => (
                      <div key={key}>
                        {renderField(label as string, key as string)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
} 