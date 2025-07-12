import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/components/types/appointment";
import { ColumnToggle } from "@/components/types/patient";
import { initialAppointments } from "@/assets/data/initialAppointments";
import {
  getAppointmentsByDoctorId,
} from "@/services/appointmentService";
import {
  fromDTO,
} from "@/utils/appointmentMapper";
import { DoctorHeader } from "@/components/ui/DoctorHeader";
import { DoctorSidebar } from "@/components/ui/DoctorSidebar";
import DoctorAppointmentsTable from "@/components/ui/DoctorAppointmentsTable";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import AppointmentsIcon from "@/assets/icons/AppointmentIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";


export default function DoctorAppointmentsPage() {
  // Sidebar & Language
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Appointments Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Sorting & Pagination
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  //hooks
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme } = useTheme();

  // Fetch appointments from backend on mount
  useEffect(() => {
    // If no user or user is not a doctor, don't show any appointments
    if (!user || user.role !== 'doctor') {
      setIsLoading(false);
      setAppointments([]);
      return;
    }

    setIsLoading(true);

    (async () => {
      try {
        // Fetch appointments for the logged-in doctor by their ID
        const doctorAppointments = await getAppointmentsByDoctorId(user.id);
        setAppointments(doctorAppointments.map(fromDTO));
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        });
        // Fallback to initial data on error for demo purposes
        const fallbackAppointments = initialAppointments.filter(apt => apt.doctor === user.name);
        if (fallbackAppointments.length === 0) {
          setAppointments(
            initialAppointments.slice(0, 5).map((apt, index) => ({
              ...apt,
              doctor: user.name,
              id: apt.id + 1000 + index, // prevent key collision
            }))
          );
        } else {
          setAppointments(fallbackAppointments);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user, toast]);

  // Columns
  const getColumns = (t: (key: string) => string): ColumnToggle[] => [
    { id: "name", label: t('appointments.columns.name'), visible: true },
    { id: "date", label: t('appointments.columns.date'), visible: true },
    { id: "time", label: t('appointments.columns.time'), visible: true },
    { id: "injury", label: t('appointments.columns.injury'), visible: true },
    { id: "status", label: t('appointments.columns.status'), visible: true },
    { id: "actions", label: t('appointments.columns.actions'), visible: true },
  ];

  const [columns, setColumns] = useState<ColumnToggle[]>(getColumns(t));

  useEffect(() => {
    setColumns(prevColumns => {
      const newLabels = getColumns(t);
      return prevColumns.map(col => {
        const newLabel = newLabels.find(c => c.id === col.id)?.label;
        return { ...col, label: newLabel || col.label };
      });
    });
  }, [t]);

  
type ColumnConfig = {
  id: string;
  key: keyof Appointment;
  label: string;
  render: (item: Appointment) => React.ReactNode;
};

const columnConfig: ColumnConfig[] = [
     {
      id: "name",
      key: "patientName",
      label: t('appointments.columnConfig.patientName'),
      render: (item: Appointment) => (
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium", theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'bg-primary/20 text-primary')}>
            {item.patientName.charAt(0)}
          </div>
          <TruncatedWithTooltip text={item.patientName} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "date",
      key: "date",
      label: t('appointments.columnConfig.date'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.date} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "time",
      key: "time",
      label: t('appointments.columnConfig.time'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.time} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "injury",
      key: "issue",
      label: t('appointments.columnConfig.injury'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.issue} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "status",
      key:"status",
      label:t('appointments.columnConfig.appointmentStatus'),
      render:(item: Appointment) => (
        <span className={cn(
            'px-2 py-1 rounded-full text-xs font-semibold',
            item.status === 'Completed' && (theme === 'dark' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'),
            item.status === 'Scheduled' && (theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'),
            item.status === 'Cancelled' && (theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'),
        )}>
            {item.status}
        </span>
      ),
    },
];

  const handleSort = (column: string | null) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const [, setLocation] = useLocation();

  const handleViewPatient = (appointment: Appointment) => {
    console.log('handleViewPatient called with:', appointment);
    
    if (!appointment) {
      console.error('No appointment data provided');
      toast({
        title: "Error",
        description: "Unable to view patient profile - no appointment data",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare patient data for the profile page
      const patientData = {
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        email: appointment.email,
        phone: appointment.phone,
        gender: appointment.gender,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        issue: appointment.issue,
        status: appointment.status,
        visitType: appointment.visitType,
      };

      console.log("Navigating to patient profile with data:", patientData);

      // Encode patient data as URL parameter
      const encodedData = encodeURIComponent(JSON.stringify(patientData));
      
      // Navigate to doctor patient profile page
      setLocation(`/doctor/patient-profile?patientData=${encodedData}`);

      toast({
        title: "Opening Patient Profile",
        description: `Loading profile for ${appointment.patientName}`,
        duration: 2000,
        className: cn(theme === 'dark' ? "bg-blue-900 border border-blue-500/50 text-white" : "bg-blue-50 border border-blue-500/50 text-blue-900"),
      });
    } catch (error) {
      console.error("Error navigating to patient profile:", error);
      toast({
        title: "Error",
        description: "Unable to open patient profile",
        variant: "destructive",
      });
    }
  };

  const filteredAppointments = [...appointments].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof Appointment];
    const bValue = b[sortColumn as keyof Appointment];

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getExportData = (appointment: Appointment) => ({
    [t('appointments.export.patientName')]: appointment.patientName,
    [t('appointments.export.doctor')]: appointment.doctor,
    [t('appointments.export.date')]: appointment.date,
    [t('appointments.export.time')]: appointment.time,
    [t('appointments.export.issue')]: appointment.issue,
    [t('appointments.export.status')]: appointment.status,
  });

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
          title={t("doctorAppointments.title")}
          subtitle={t("doctorAppointments.subtitle")}
          icon={<AppointmentsIcon className="h-5 w-5" />}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="h-full">
            <DoctorAppointmentsTable
              isLoading={isLoading}
              data={paginatedAppointments}
              columns={columnConfig}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onViewPatient={handleViewPatient}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalItems={filteredAppointments.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
} 