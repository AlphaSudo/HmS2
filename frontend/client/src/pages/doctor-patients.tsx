import React, { useState, useEffect } from "react";
import { DoctorSidebar } from "@/components/ui/DoctorSidebar";
import { DoctorHeader } from "@/components/ui/DoctorHeader";
import { PatientProfileModal } from "@/components/ui/PatientProfileModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctorPatients } from "@/hooks/useDoctorPatients";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Phone, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function DoctorPatientsPage() {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use user ID as doctor ID since they're the same
  const { patients, loading, error, refetch } = useDoctorPatients(Number(user?.id) || 0);



  const handleViewPatientProfile = (patientId: number) => {
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {t("common.loading", "Loading patients...")}
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-red-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Error Loading Patients</p>
            <p>{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {t("common.retry", "Retry")}
            </button>
          </div>
        </div>
      );
    }

    if (patients.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Users className={cn(
              "h-16 w-16 mx-auto mb-4",
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            )} />
            <p className={cn(
              "text-lg font-semibold mb-2",
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            )}>
              {t("doctorPatients.noPatients", "No patients assigned")}
            </p>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
              {t("doctorPatients.noPatientsDescription", "You don't have any patients assigned to you yet.")}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.userId}
            className={cn(
              "rounded-lg p-6 flex flex-col gap-4 transition-shadow cursor-pointer",
              theme === "dark"
                ? "bg-gray-800/60 border border-teal-500/20 hover:shadow-teal-500/20 hover:shadow-lg"
                : "bg-white border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={`${patient.firstName} ${patient.lastName}`} />
                  <AvatarFallback className="bg-teal-500 text-white">
                    {getInitials(patient.firstName, patient.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-md text-teal-600 dark:text-white">
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-white">
                    {t("doctorPatients.patientId", "Patient Id")}: {patient.userId}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs font-medium text-gray-500 dark:text-white">
                <p>{t("doctorPatients.admitted", "Admitted")}</p>
                <p>{formatDate(patient.admissionDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-800 dark:text-white">
              <MapPin className="w-5 h-5 mt-0.5 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
              <span className="font-semibold text-gray-700 dark:text-white">{patient.address}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-800 dark:text-white">
              <Phone className="w-5 h-5 mt-0.5 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
              <span className="font-semibold text-gray-700 dark:text-white">{patient.mobile}</span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              <span
                className={cn(
                  "text-sm font-semibold px-2 py-0.5 rounded-full",
                  theme === "dark"
                      ? "bg-teal-500/25 text-white"
                      : "bg-teal-100 text-teal-800"
                )}
              >
                {t("doctorPatients.bloodGroup", "Blood Group")}: {patient.bloodGroup}
              </span>
              <button
                onClick={() => handleViewPatientProfile(patient.userId)}
                className={cn(
                  "text-sm font-semibold underline underline-offset-2 hover:text-teal-700 transition-colors",
                  theme === "dark" ? "text-white hover:text-teal-400" : "text-primary"
                )}
              >
                {t("common.readMore", "Read More")}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen flex",
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300"
          : "bg-background text-foreground"
      )}
    >
      <DoctorSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed
            ? isRTL
              ? "mr-16"
              : "ml-16"
            : isRTL
            ? "mr-64"
            : "ml-64"
        }`}
      >
        <DoctorHeader
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={t("doctorPatients.title", "Patients")}
          subtitle={t(
            "doctorPatients.subtitle",
            "Overview of your current patients"
          )}
          icon={
            <Users
              className={cn(
                "w-6 h-6", // Slightly larger for better visibility
                theme === "dark" ? "text-white" : "text-primary"
              )}
              strokeWidth={2.5} // Heavier stroke for contrast
            />
          }
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <PatientProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={selectedPatientId}
      />
    </div>
  );
} 