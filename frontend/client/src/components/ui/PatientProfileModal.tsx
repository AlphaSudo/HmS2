import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getPatientByUserId } from '@/services/patientService';
import { Patient } from '@/components/types/patient';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Heart, 
  AlertTriangle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number | null;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  patientId,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientData();
    }
  }, [isOpen, patientId]);

  const fetchPatientData = async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError(null);
    try {
      const patientResponse = await getPatientByUserId(patientId.toString());
      setPatient(patientResponse.data);
    } catch (err) {
      setError('Failed to load patient details');
      console.error('Error fetching patient details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className={cn(
        "relative w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden transform transition-all",
        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
      )}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={cn(
            "text-xl font-semibold",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            {t("patientDetails.title", "Patient Details")}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                <p className={theme === "dark" ? "text-gray-200" : "text-gray-600"}>
                  {t("common.loading", "Loading...")}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center text-red-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {patient && (
            <div className="space-y-6">
              {/* Patient Basic Info */}
              <div className={cn(
                "rounded-lg p-6",
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
              )}>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={`${patient.firstName} ${patient.lastName}`} />
                    <AvatarFallback className="bg-teal-500 text-white text-lg">
                      {getInitials(patient.firstName, patient.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-xl font-semibold mb-2",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-teal-600" />
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          {patient.gender}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          {formatDate(patient.dateOfBirth)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-teal-600" />
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          {patient.mobile}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-teal-600" />
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border">
                          {patient.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className={cn("my-4", theme === "dark" ? "border-gray-600" : "border-gray-200")} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {patient.address}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium mb-1",
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    )}>
                      Assigned Doctor
                    </p>
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {patient.doctorAssigned}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium mb-1",
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    )}>
                      Status
                    </p>
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {patient.status}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium mb-1",
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    )}>
                      Treatment
                    </p>
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {patient.treatment}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium mb-1",
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    )}>
                      Admission Date
                    </p>
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {formatDate(patient.admissionDate)}
                    </span>
                  </div>
                  {patient.dischargeDate && (
                    <div>
                      <p className={cn(
                        "font-medium mb-1",
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      )}>
                        Discharge Date
                      </p>
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                        {formatDate(patient.dischargeDate)}
                      </span>
                    </div>
                  )}
                  {patient.email && (
                    <div>
                      <p className={cn(
                        "font-medium mb-1",
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      )}>
                        Email
                      </p>
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                        {patient.email}
                      </span>
                    </div>
                  )}
                  {patient.maritalStatus && (
                    <div>
                      <p className={cn(
                        "font-medium mb-1",
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      )}>
                        Marital Status
                      </p>
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                        {patient.maritalStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-opacity-50 border-t flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}; 