import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/components/types/appointment";
import { ColumnToggle } from "@/components/types/patient";
import GenericTableCard from "@/components/ui/GenericTableCard";
import {
  GenericFormModal,
  FieldConfig,
} from "@/components/ui/GenericFormModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { initialAppointments } from "@/assets/data/initialAppointments";
import {
  getAppointments,
  createAppointment,
  updateAppointment as updateAppointmentApi,
  deleteAppointment as deleteAppointmentApi,
} from "@/services/appointmentService";
import {
  fromDTO,
  toCreateDTO,
  toUpdateDTO,
} from "@/utils/appointmentMapper";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import AppointmentsIcon from "@/assets/icons/AppointmentIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useLocation as useRouterLocation } from "wouter";
import DoctorService from "@/services/doctorService";


export default function AppointmentsPage() {
  // Sidebar & Language
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useLanguage();
  const { t } = useTranslation();
  // Location for URL params
  const [location] = useRouterLocation();
  // Appointments Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([],);
  // Sorting & Pagination
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  // Form Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  // Doctors Data
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
    //hooks
  const { toast } = useToast();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const [currentAppointment, setCurrentAppointment] =useState<Appointment | null>(null);
  // Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null,);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Data Source Tracking
  const [dataSource, setDataSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [apiError, setApiError] = useState<string | null>(null);

  // Data fetching function - prioritize API data over sample data
  const fetchAppointments = useCallback(async (showToast = true) => {
    setIsLoading(true);
    setDataSource('loading');
    setApiError(null);
    
    try {
      const data = await getAppointments();
      const apiAppointments = data.map(fromDTO);
      
      // Prioritize API data - only use fallback if API returns empty
      if (apiAppointments && apiAppointments.length > 0) {
        setAppointments(apiAppointments);
        setDataSource('api');
        console.log(`✅ Loaded ${apiAppointments.length} appointments from API`);
        
        if (showToast) {
          toast({
            title: t('appointments.toast.apiSuccess.title', 'Data Loaded'),
            description: t('appointments.toast.apiSuccess.description', `Successfully loaded ${apiAppointments.length} appointments from server.`),
            className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
          });
        }
      } else {
        // Use sample data as fallback only if API returns empty
        setAppointments(initialAppointments);
        setDataSource('fallback');
        console.log("⚠️ API returned empty data, using sample appointments as fallback");
        
        if (showToast) {
          toast({
            title: t('appointments.toast.fallbackData.title', 'Using Sample Data'),
            description: t('appointments.toast.fallbackData.description', 'API returned no appointments, showing sample data for demonstration.'),
            className: cn(theme === 'dark' ? "bg-[#FBA427]/20 border border-[#FBA427]/50 text-white" : "bg-amber-50 border border-amber-200 text-amber-800"),
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      setApiError(errorMessage);
      console.error("❌ Failed to fetch appointments from API:", error);
      
      // Use sample data as fallback when API fails
      setAppointments(initialAppointments);
      setDataSource('fallback');
      
      if (showToast) {
        toast({
          title: t('appointments.toast.apiError.title', 'API Connection Failed'),
          description: t('appointments.toast.apiError.description', `Could not connect to appointment service: ${errorMessage}. Showing sample data for demonstration.`),
          variant: "destructive",
          className: cn("border", theme === 'dark' ? "bg-[#450A0A] border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, theme, t]);

  // Fetch doctors for dropdown
  const fetchDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    try {
      const doctorsData = await DoctorService.getAllDoctors();
      setDoctors(doctorsData);
      console.log('✅ Loaded doctors for dropdown:', doctorsData.length);
    } catch (error: any) {
      console.error('❌ Failed to fetch doctors:', error);
      setDoctors([]); // Fallback to empty array
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  // Handle patient data from URL parameters
  useEffect(() => {
    // Use window.location.search instead of Wouter's location for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const patientDataParam = urlParams.get('patientData');
    
    console.log('🔍 Checking URL for patient data...', {
      url: window.location.href,
      search: window.location.search,
      patientDataParam: !!patientDataParam
    });
    
    if (patientDataParam) {
      try {
        const patientData = JSON.parse(decodeURIComponent(patientDataParam));
        console.log('📋 Pre-filling appointment form with patient data:', patientData);
        
        // Pre-fill form data and open form
        setFormData(patientData);
        setIsEditMode(false);
        setIsFormOpen(true);
        
        // Clear the URL parameter after processing to prevent re-triggering
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Show success message with a slight delay to ensure form is open
        setTimeout(() => {
          toast({
            title: "Patient Info Loaded",
            description: `Pre-filled appointment form for ${patientData.patientName}`,
            className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
          });
        }, 500);
      } catch (error) {
        console.error('❌ Failed to parse patient data from URL:', error);
        toast({
          title: "Error Loading Patient Data",
          description: "Failed to parse patient information from URL",
          variant: "destructive"
        });
      }
    }
  }, []); // Remove dependencies to run only once on mount

  // Fetch appointments from backend on mount
  useEffect(() => {
    fetchAppointments(false); // Don't show toast on initial load
  }, [fetchAppointments]);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Columns
  const getColumns = (t: (key: string) => string): ColumnToggle[] => [
    { id: "checkbox", label: t('appointments.columns.select'), visible: true },
    { id: "name", label: t('appointments.columns.name'), visible: true },
    { id: "doctor", label: t('appointments.columns.doctor'), visible: true },
    { id: "gender", label: t('appointments.columns.gender'), visible: true },
    { id: "date", label: t('appointments.columns.date'), visible: true },
    { id: "time", label: t('appointments.columns.time'), visible: true },
    { id: "mobile", label: t('appointments.columns.mobile'), visible: true },
    { id: "injury", label: t('appointments.columns.injury'), visible: true },
    { id: "email", label: t('appointments.columns.email'), visible: true },
    { id: "status", label: t('appointments.columns.status'), visible: true },
    { id: "visitType", label: t('appointments.columns.visitType'), visible: true },
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

  

const columnConfig = [
     {
      id: "name",
      key: "name",
      label: t('appointments.columnConfig.patientName'),
      render: (item: Appointment) => (
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium", theme === 'dark' ? 'bg-[#0C4A6E]' : 'bg-primary/20 text-primary')}>
            {item.patientName.charAt(0)}
          </div>
          <TruncatedWithTooltip text={item.patientName} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "doctor",
      key: "doctor",
      label: t('appointments.columnConfig.doctor'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.doctor}  maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "gender",
      key:"gender",
      label:t('appointments.columnConfig.gender'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.gender} maxWidth="max-w-[120px]" />
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
      id: "mobile",
      key: "mobile",
      label: t('appointments.columnConfig.mobile'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.phone} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "injury",
      key: "injury",
      label: t('appointments.columnConfig.injury'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.issue} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "email",
      key: "email",
      label: t('appointments.columnConfig.email'),
      render: (item: Appointment) => (
        <TruncatedWithTooltip text={item.email} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "status",
      key:"status",
      label:t('appointments.columnConfig.appointmentStatus'),
      render:(item: Appointment) => (
        <TruncatedWithTooltip text={item.status} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id:"visitType",
      key:"visitType",
      label:t('appointments.columnConfig.visitType'),
      render:(item: Appointment) => (
        <TruncatedWithTooltip text={item.visitType} maxWidth="max-w-[120px]" />
      ),
    },
];

const formFields: FieldConfig[] = useMemo(() => [
  {
    id: "patientName",
    label: t('appointments.formFields.patientName'),
    type: "text",
    required: true,
  },
  {
    id: "email",
    label: t('appointments.formFields.email'),
    type: "email",
    required: true,
  },
  {
    id:"gender",
    label: t('appointments.formFields.gender'),
    type:"select",
    required:true,
    options: [
      {value:"", label: t('appointments.formFields.selectGender'),disabled:true},
      {value:"male", label: t('appointments.formFields.male')},
      {value:"female", label: t('appointments.formFields.female')},
    ],
  },
  { id: "date", label: t('appointments.formFields.admissionDate'), type: "date", required: true },
  { id: "time", label: t('appointments.formFields.time'), type: "text", required: true },
  {
      id: "phone",
      label: t('appointments.formFields.mobile'),
      type: "tel",
      required: true,
    },
  {
    id: "doctor",
    label: t('appointments.formFields.doctor'),
    type: "select",
    required: true,
    options: doctorsLoading 
      ? [{ value: "", label: "Loading doctors...", disabled: true }]
      : [
          { value: "", label: t('appointments.formFields.selectDoctor', 'Select a Doctor'), disabled: true },
          ...doctors.map(doctor => ({
            value: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization || 'General'}`,
            doctorId: doctor.id
          }))
        ]
  },
  {
    id: "doctorId",
    label: t('appointments.formFields.doctorId', 'Doctor ID'),
    type: "number",
    required: true,
  },
  {
    id: "issue",
    label: t('appointments.formFields.injuryCondition'),
    type: "textarea",
    required: true,
  },
  {
    id: "status",
    label: t('appointments.formFields.appointmentStatus'),
    type: "select",
    required: true,
    options: [
      { value: "", label: t('appointments.formFields.selectStatus'), disabled: true },
      { value: "Scheduled", label: t('appointments.formFields.scheduled') },
      { value: "Completed", label: t('appointments.formFields.completed') },
      { value: "Cancelled", label: t('appointments.formFields.cancelled') },
      { value: "Confirmed", label: t('appointments.formFields.confirmed', 'Confirmed') },
      { value: "Pending", label: t('appointments.formFields.pending', 'Pending') },
      { value: "Rescheduled", label: t('appointments.formFields.rescheduled', 'Rescheduled') },
    ],
  },
  {
    id: "visitType",
    label: t('appointments.formFields.visitType'),
    type: "select",
    required: true,
    options: [
      { value: "", label: t('appointments.formFields.selectVisitType'), disabled: true },
      { value: "New Patient", label: t('appointments.formFields.newPatient') },
      { value: "Follow-Up", label: t('appointments.formFields.followUp') },
      { value: "Routine Checkup", label: t('appointments.formFields.routineCheckup', 'Routine Checkup') },
      { value: "Consultation", label: t('appointments.formFields.consultation', 'Consultation') },
      { value: "Urgent Care", label: t('appointments.formFields.urgentCare', 'Urgent Care') },
    ],
  },
  { id: "patientId", label: t('appointments.formFields.patientId', 'Patient ID'), type: "number", required: true },
], [t, doctors, doctorsLoading]);


useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target as Node)
      ) {
        setShowColumnSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormSubmit = async (data: Partial<Appointment>) => {
    // Validate phone number
    const phoneRegex = /^(?:\+[1-9]\d{10}|\d{3}-\d{3}-\d{4})$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      toast({
        title: t('appointments.toast.invalidPhone.title'),
        description: t('appointments.toast.invalidPhone.description'),
        variant: "destructive",
        className: cn("border", theme === 'dark' ? "bg-[#450A0A] border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"),
      });
      return;
    }

    try {
      // Find the selected doctor to get the doctorId
      let finalDoctorId = data.doctorId;
      if (data.doctor && !finalDoctorId) {
        const selectedDoctor = doctors.find(doc => 
          `Dr. ${doc.firstName} ${doc.lastName}` === data.doctor
        );
        finalDoctorId = selectedDoctor?.id || 1;
      }

      if (isEditMode && data.id) {
        const appointmentData = {
          ...data,
          doctorId: Number(finalDoctorId),
        };
        const dto = toUpdateDTO(appointmentData);
        await updateAppointmentApi(data.id, dto);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchAppointments(false);
        } else {
          // If using fallback data, update locally
          setAppointments(
            appointments.map((app) =>
              app.id === data.id ? { ...app, ...appointmentData } : app,
            ),
          );
        }
        
        toast({
          title: t('appointments.toast.appointmentUpdated.title'),
          description: t('appointments.toast.appointmentUpdated.description', { patientName: data.patientName }),
          className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
        });
      } else {
        // Create new appointment with proper data validation
        const appointmentData = {
          ...data,
          patientId: Number(data.patientId),
          doctorId: Number(finalDoctorId) || 1, // Default to doctor ID 1 if not provided
        };
        const createDto = toCreateDTO(appointmentData);
        const created = await createAppointment(createDto);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchAppointments(false);
        } else {
          // If using fallback data, add locally
          const newAppointment = fromDTO(created);
          setAppointments([...appointments, newAppointment]);
        }
        
        toast({
          title: t('appointments.toast.appointmentAdded.title'),
          description: t('appointments.toast.appointmentAdded.description', { patientName: data.patientName }),
          className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while saving the appointment.",
        variant: "destructive",
      });
    }
    setIsFormOpen(false);
  };
  const handleConfirmDelete = async () => {
    if (appointmentToDelete) {
      try {
        const appointmentToRemove = appointments.find(
          (s) => s.id === appointmentToDelete,
        );
        
        await deleteAppointmentApi(appointmentToDelete);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchAppointments(false);
        } else {
          // If using fallback data, update locally
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const updatedAppointments = appointments.filter(
            (app) => app.id !== appointmentToDelete,
          );
          const updatedCurrentPageItems = updatedAppointments.slice(start, end);
          const isCurrentPageEmpty = updatedCurrentPageItems.length === 0;

          setAppointments(updatedAppointments);
          if (isCurrentPageEmpty && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        }
        
        toast({
          title: t('appointments.toast.appointmentDeleted.title'),
          description: t('appointments.toast.appointmentDeleted.description', { patientName: appointmentToRemove?.patientName || t('appointments.entityName') }),
          variant: "destructive",
          className: cn("border", theme === 'dark' ? "bg-[#450A0A] border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"),
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while deleting the appointment.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const getExportData = (appointment: Appointment) => ({
    [t('appointments.export.name')]: appointment.patientName,
    [t('appointments.export.doctor')]: appointment.doctor,
    [t('appointments.export.gender')]: appointment.gender,
    [t('appointments.export.date')]: appointment.date,
    [t('appointments.export.time')]: appointment.time,
    [t('appointments.export.phone')]: appointment.phone,
    [t('appointments.export.issue')]: appointment.issue,
    [t('appointments.export.email')]: appointment.email,
    [t('appointments.export.status')]: appointment.status,
    [t('appointments.export.visitType')]: appointment.visitType,
  });

  return (
    <div className={cn("flex h-screen overflow-hidden", theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground')}>

    <Sidebar isOpen={sidebarOpen} />
      <div className={cn("flex-1 flex flex-col overflow-y-auto", theme === 'dark' ? 'bg-[#040223] gradient-bg-background' : 'bg-background')}>
        <Header
          title={t('appointments.title')}
          icon={<AppointmentsIcon className="h-8 w-8" />}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
       <div className="flex-1 px-8 py-8 pt-24 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className={cn("text-2xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>{t('appointments.viewAppointments')}</h1>
              
              {/* Data Source Indicator & Refresh Button */}
              <div className="flex items-center gap-3">
                {/* Data Source Badge */}
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2",
                  dataSource === 'api' 
                    ? (theme === 'dark' ? "bg-green-900/30 text-green-400 border border-green-700/50" : "bg-green-100 text-green-800 border border-green-200")
                    : dataSource === 'fallback'
                    ? (theme === 'dark' ? "bg-amber-900/30 text-amber-400 border border-amber-700/50" : "bg-amber-100 text-amber-800 border border-amber-200")
                    : (theme === 'dark' ? "bg-blue-900/30 text-blue-400 border border-blue-700/50" : "bg-blue-100 text-blue-800 border border-blue-200")
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    dataSource === 'api' ? "bg-green-500" : dataSource === 'fallback' ? "bg-amber-500" : "bg-blue-500"
                  )} />
                  {dataSource === 'api' && t('appointments.dataSource.api', 'Live Data')}
                  {dataSource === 'fallback' && t('appointments.dataSource.fallback', 'Sample Data')}
                  {dataSource === 'loading' && t('appointments.dataSource.loading', 'Loading...')}
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={() => fetchAppointments(true)}
                  disabled={isLoading}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                    "flex items-center gap-1",
                    theme === 'dark' 
                      ? "bg-[#5D0A72]/20 text-[#5D0A72] border border-[#5D0A72]/30 hover:bg-[#5D0A72]/30" 
                      : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",
                    isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"
                  )}
                >
                  <svg className={cn("w-3 h-3", isLoading && "animate-spin")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('appointments.refresh', 'Refresh')}
                </button>
              </div>
            </div>
            
            {/* API Error Warning */}
            {apiError && dataSource === 'fallback' && (
              <div className={cn(
                "mt-3 p-3 rounded-md border-l-4",
                theme === 'dark' 
                  ? "bg-red-900/20 border-red-500 text-red-400" 
                  : "bg-red-50 border-red-500 text-red-700"
              )}>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">
                      {t('appointments.apiError.title', 'API Connection Issue')}
                    </p>
                    <p className="text-xs mt-1">
                      {t('appointments.apiError.description', 'Unable to connect to the appointment service. Showing sample data for demonstration purposes.')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Appointments Table Card */}
           <GenericTableCard
            items={appointments}
            setItems={setAppointments}
            selectedItems={selectedAppointments}
            setSelectedItems={setSelectedAppointments}
            columns={columns}
            setColumns={setColumns}
            showColumnSelector={showColumnSelector}
            setShowColumnSelector={setShowColumnSelector}
            columnSelectorRef={columnSelectorRef}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            onAddClick={() => {
              setFormData({});
              setIsEditMode(false);
              setIsFormOpen(true);
            }}
            onEditClick={(appointment) => {
              setFormData(appointment);
              setIsEditMode(true);
              setIsFormOpen(true);
            }}
            onDeleteClick={(id) => {
              setAppointmentToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            initialItems={initialAppointments}
            columnConfig={columnConfig}
            getExportData={getExportData}
            exportFileName={t('appointments.exportFileName')}
            entityName={t('appointments.entityName')}
          />
          <GenericFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            title={t('appointments.formTitle')}
            fields={formFields}
            />

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onCancel={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </div>
    </div>
    
  );
}