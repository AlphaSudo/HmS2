import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { ColumnToggle } from "@/components/types/patient";
import GenericTableCard from "@/components/ui/GenericTableCard";
import {
  GenericFormModal,
  FieldConfig,
} from "@/components/ui/GenericFormModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { initialPrescriptions } from "@/assets/data/initialPrescriptions";
import {
  getAllPrescriptions,
  createPrescription,
  updatePrescription as updatePrescriptionApi,
  deletePrescription as deletePrescriptionApi,
  Prescription,
  CreatePrescriptionRequest,
} from "@/services/prescriptionService";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import PrescriptionIcon from "@/assets/icons/PrescriptionIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import DoctorService from "@/services/doctorService";
import { Pill, Calendar, User, FileText, DollarSign } from "lucide-react";

export default function PrescriptionsPage() {
  // Sidebar & Language
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useLanguage();
  const { t } = useTranslation();
  
  // Prescriptions Data
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>([]);
  
  // Sorting & Pagination
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Form Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Prescription>>({});
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  
  // Doctors Data
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  
  // Hooks
  const { toast } = useToast();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  
  // Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<number | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  
  // Data Source Tracking
  const [dataSource, setDataSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [apiError, setApiError] = useState<string | null>(null);

  // Data fetching function - prioritize API data over sample data
  const fetchPrescriptions = useCallback(async (showToast = true) => {
    setIsLoading(true);
    setDataSource('loading');
    setApiError(null);
    
    try {
      const data = await getAllPrescriptions();
      const apiPrescriptions = data.data;
      
      // Prioritize API data - only use fallback if API returns empty
      if (apiPrescriptions && apiPrescriptions.length > 0) {
        setPrescriptions(apiPrescriptions);
        setDataSource('api');
        console.log(`✅ Loaded ${apiPrescriptions.length} prescriptions from API`);
        
        if (showToast) {
          toast({
            title: t('prescriptions.toast.apiSuccess.title', 'Data Loaded'),
            description: t('prescriptions.toast.apiSuccess.description', `Successfully loaded ${apiPrescriptions.length} prescriptions from server.`),
            className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
          });
        }
      } else {
        // Use sample data as fallback only if API returns empty
        setPrescriptions(initialPrescriptions);
        setDataSource('fallback');
        console.log("⚠️ API returned empty data, using sample prescriptions as fallback");
        
        if (showToast) {
          toast({
            title: t('prescriptions.toast.fallbackData.title', 'Using Sample Data'),
            description: t('prescriptions.toast.fallbackData.description', 'API returned no prescriptions, showing sample data for demonstration.'),
            className: cn(theme === 'dark' ? "bg-[#FBA427]/20 border border-[#FBA427]/50 text-white" : "bg-amber-50 border border-amber-200 text-amber-800"),
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      setApiError(errorMessage);
      console.error("❌ Failed to fetch prescriptions from API:", error);
      
      // Use sample data as fallback when API fails
      setPrescriptions(initialPrescriptions);
      setDataSource('fallback');
      
      if (showToast) {
        toast({
          title: t('prescriptions.toast.apiError.title', 'API Connection Failed'),
          description: t('prescriptions.toast.apiError.description', `Could not connect to prescription service: ${errorMessage}. Showing sample data for demonstration.`),
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

  // Fetch prescriptions from backend on mount
  useEffect(() => {
    fetchPrescriptions(false); // Don't show toast on initial load
  }, [fetchPrescriptions]);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Columns
  const getColumns = (t: (key: string) => string): ColumnToggle[] => [
    { id: "checkbox", label: t('prescriptions.columns.select'), visible: true },
    { id: "prescriptionNumber", label: t('prescriptions.columns.prescriptionNumber'), visible: true },
    { id: "patientName", label: t('prescriptions.columns.patientName'), visible: true },
    { id: "doctorName", label: t('prescriptions.columns.doctorName'), visible: true },
    { id: "prescribedDate", label: t('prescriptions.columns.prescribedDate'), visible: true },
    { id: "status", label: t('prescriptions.columns.status'), visible: true },
    { id: "totalAmount", label: t('prescriptions.columns.totalAmount'), visible: true },
    { id: "dispensedDate", label: t('prescriptions.columns.dispensedDate'), visible: false },
    { id: "notes", label: t('prescriptions.columns.notes'), visible: true },
    { id: "actions", label: t('prescriptions.columns.actions'), visible: true },
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
      id: "prescriptionNumber",
      key: "prescriptionNumber",
      label: t('prescriptions.columnConfig.prescriptionNumber'),
      render: (item: Prescription) => (
        <div className="flex items-center gap-2">
          <Pill className={cn('w-4 h-4', theme === 'dark' ? 'text-[#8B5CF6]' : 'text-primary')} />
          <TruncatedWithTooltip text={item.prescriptionNumber} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "patientName",
      key: "patientName",
      label: t('prescriptions.columnConfig.patientName'),
      render: (item: Prescription) => (
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium", theme === 'dark' ? 'bg-[#0C4A6E]' : 'bg-primary/20 text-primary')}>
            {item.patientName.charAt(0)}
          </div>
          <TruncatedWithTooltip text={item.patientName} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "doctorName",
      key: "doctorName",
      label: t('prescriptions.columnConfig.doctorName'),
      render: (item: Prescription) => (
        <div className="flex items-center gap-2">
          <User className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip text={item.doctorName} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "prescribedDate",
      key: "prescribedDate",
      label: t('prescriptions.columnConfig.prescribedDate'),
      render: (item: Prescription) => (
        <div className="flex items-center gap-2">
          <Calendar className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip text={item.prescribedDate} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "status",
      key: "status",
      label: t('prescriptions.columnConfig.status'),
      render: (item: Prescription) => {
        const getStatusColor = (status: string) => {
          const isDark = theme === 'dark';
          switch (status.toLowerCase()) {
            case 'pending':
              return isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'dispensed':
              return isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled':
              return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
            case 'partially_dispensed':
              return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
            default:
              return isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200';
          }
        };
        
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
          </span>
        );
      },
    },
    {
      id: "totalAmount",
      key: "totalAmount",
      label: t('prescriptions.columnConfig.totalAmount'),
      render: (item: Prescription) => (
        <div className="flex items-center gap-2">
          <DollarSign className={cn('w-4 h-4', theme === 'dark' ? 'text-green-400' : 'text-green-600')} />
          <span className={cn('font-medium', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
            {item.totalAmount ? `$${item.totalAmount.toFixed(2)}` : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      id: "dispensedDate",
      key: "dispensedDate",
      label: t('prescriptions.columnConfig.dispensedDate'),
      render: (item: Prescription) => (
        <TruncatedWithTooltip text={item.dispensedDate || 'Not dispensed'} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "notes",
      key: "notes",
      label: t('prescriptions.columnConfig.notes'),
      render: (item: Prescription) => (
        <div className="flex items-center gap-2">
          <FileText className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip text={item.notes || 'No notes'} maxWidth="max-w-[150px]" />
        </div>
      ),
    },
  ];

  const formFields: FieldConfig[] = useMemo(() => [
    {
      id: "prescriptionNumber",
      label: t('prescriptions.formFields.prescriptionNumber'),
      type: "text",
      required: false,
      disabled: true, // Auto-generated by backend
    },
    {
      id: "patientId",
      label: t('prescriptions.formFields.patientId'),
      type: "number",
      required: true,
    },
    {
      id: "patientName",
      label: t('prescriptions.formFields.patientName'),
      type: "text",
      required: true,
    },
    {
      id: "doctorId",
      label: t('prescriptions.formFields.doctorId'),
      type: "number",
      required: true,
    },
    {
      id: "doctorName",
      label: t('prescriptions.formFields.doctorName'),
      type: "select",
      required: true,
      options: doctorsLoading 
        ? [{ value: "", label: "Loading doctors...", disabled: true }]
        : [
            { value: "", label: t('prescriptions.formFields.selectDoctor', 'Select a Doctor'), disabled: true },
            ...doctors.map(doctor => ({
              value: `Dr. ${doctor.firstName} ${doctor.lastName}`,
              label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization || 'General'}`,
              doctorId: doctor.id
            }))
          ]
    },
    {
      id: "prescribedDate",
      label: t('prescriptions.formFields.prescribedDate'),
      type: "date",
      required: true,
    },
    {
      id: "dispensedDate",
      label: t('prescriptions.formFields.dispensedDate'),
      type: "date",
      required: false,
    },
    {
      id: "status",
      label: t('prescriptions.formFields.status'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('prescriptions.formFields.selectStatus'), disabled: true },
        { value: "pending", label: t('prescriptions.formFields.pending') },
        { value: "dispensed", label: t('prescriptions.formFields.dispensed') },
        { value: "partially_dispensed", label: t('prescriptions.formFields.partiallyDispensed') },
        { value: "cancelled", label: t('prescriptions.formFields.cancelled') },
      ],
    },
    {
      id: "totalAmount",
      label: t('prescriptions.formFields.totalAmount'),
      type: "number",
      required: false,
      step: "0.01",
    },
    {
      id: "notes",
      label: t('prescriptions.formFields.notes'),
      type: "textarea",
      required: false,
    },
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

  const handleFormSubmit = async (data: Partial<Prescription>) => {
    try {
      // Find the selected doctor to get the doctorId
      let finalDoctorId = data.doctorId;
      if (data.doctorName && !finalDoctorId) {
        const selectedDoctor = doctors.find(doc => 
          `Dr. ${doc.firstName} ${doc.lastName}` === data.doctorName
        );
        finalDoctorId = selectedDoctor?.id || 1;
      }

      if (isEditMode && data.id) {
        const prescriptionData: CreatePrescriptionRequest = {
          patientId: Number(data.patientId),
          patientName: data.patientName!,
          doctorId: Number(finalDoctorId),
          doctorName: data.doctorName!,
          prescribedDate: data.prescribedDate!,
          dispensedDate: data.dispensedDate,
          status: data.status,
          totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
          notes: data.notes,
        };
        
        await updatePrescriptionApi(data.id, prescriptionData);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchPrescriptions(false);
        } else {
          // If using fallback data, update locally
          setPrescriptions(
            prescriptions.map((prescription) =>
              prescription.id === data.id ? { ...prescription, ...data } : prescription,
            ),
          );
        }
        
        toast({
          title: t('prescriptions.toast.prescriptionUpdated.title'),
          description: t('prescriptions.toast.prescriptionUpdated.description', { patientName: data.patientName }),
          className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
        });
      } else {
        // Create new prescription
        const prescriptionData: CreatePrescriptionRequest = {
          patientId: Number(data.patientId),
          patientName: data.patientName!,
          doctorId: Number(finalDoctorId) || 1,
          doctorName: data.doctorName!,
          prescribedDate: data.prescribedDate!,
          dispensedDate: data.dispensedDate,
          status: data.status || 'pending',
          totalAmount: data.totalAmount ? Number(data.totalAmount) : undefined,
          notes: data.notes,
        };
        
        const created = await createPrescription(prescriptionData);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchPrescriptions(false);
        } else {
          // If using fallback data, add locally
          setPrescriptions([...prescriptions, created.data]);
        }
        
        toast({
          title: t('prescriptions.toast.prescriptionAdded.title'),
          description: t('prescriptions.toast.prescriptionAdded.description', { patientName: data.patientName }),
          className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while saving the prescription.",
        variant: "destructive",
      });
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (prescriptionToDelete) {
      try {
        const prescriptionToRemove = prescriptions.find(
          (s) => s.id === prescriptionToDelete,
        );
        
        await deletePrescriptionApi(prescriptionToDelete);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchPrescriptions(false);
        } else {
          // If using fallback data, update locally
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const updatedPrescriptions = prescriptions.filter(
            (prescription) => prescription.id !== prescriptionToDelete,
          );
          const updatedCurrentPageItems = updatedPrescriptions.slice(start, end);
          const isCurrentPageEmpty = updatedCurrentPageItems.length === 0;

          setPrescriptions(updatedPrescriptions);
          if (isCurrentPageEmpty && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        }
        
        toast({
          title: t('prescriptions.toast.prescriptionDeleted.title'),
          description: t('prescriptions.toast.prescriptionDeleted.description', { patientName: prescriptionToRemove?.patientName || t('prescriptions.entityName') }),
          variant: "destructive",
          className: cn("border", theme === 'dark' ? "bg-[#450A0A] border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"),
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while deleting the prescription.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setPrescriptionToDelete(null);
  };

  const getExportData = (prescription: Prescription) => ({
    [t('prescriptions.export.prescriptionNumber')]: prescription.prescriptionNumber,
    [t('prescriptions.export.patientName')]: prescription.patientName,
    [t('prescriptions.export.doctorName')]: prescription.doctorName,
    [t('prescriptions.export.prescribedDate')]: prescription.prescribedDate,
    [t('prescriptions.export.dispensedDate')]: prescription.dispensedDate || 'Not dispensed',
    [t('prescriptions.export.status')]: prescription.status,
    [t('prescriptions.export.totalAmount')]: prescription.totalAmount ? `$${prescription.totalAmount.toFixed(2)}` : 'N/A',
    [t('prescriptions.export.notes')]: prescription.notes || 'No notes',
  });

  return (
    <div className={cn("flex h-screen overflow-hidden", theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground')}>
      <Sidebar isOpen={sidebarOpen} />
      <div className={cn("flex-1 flex flex-col overflow-y-auto", theme === 'dark' ? 'bg-[#040223] gradient-bg-background' : 'bg-background')}>
        <Header
          title={t('prescriptions.title')}
          icon={<PrescriptionIcon className="h-8 w-8" />}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 px-8 py-8 pt-24 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className={cn("text-2xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>{t('prescriptions.viewPrescriptions')}</h1>
              
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
                  {dataSource === 'api' && t('prescriptions.dataSource.api', 'Live Data')}
                  {dataSource === 'fallback' && t('prescriptions.dataSource.fallback', 'Sample Data')}
                  {dataSource === 'loading' && t('prescriptions.dataSource.loading', 'Loading...')}
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={() => fetchPrescriptions(true)}
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
                  {t('prescriptions.refresh', 'Refresh')}
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
                      {t('prescriptions.apiError.title', 'API Connection Issue')}
                    </p>
                    <p className="text-xs mt-1">
                      {t('prescriptions.apiError.description', 'Unable to connect to the prescription service. Showing sample data for demonstration purposes.')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Prescriptions Table Card */}
          <GenericTableCard
            items={prescriptions}
            setItems={setPrescriptions}
            selectedItems={selectedPrescriptions}
            setSelectedItems={setSelectedPrescriptions}
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
            onEditClick={(prescription) => {
              setFormData(prescription);
              setIsEditMode(true);
              setIsFormOpen(true);
            }}
            onDeleteClick={(id) => {
              setPrescriptionToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            initialItems={initialPrescriptions}
            columnConfig={columnConfig}
            getExportData={getExportData}
            exportFileName={t('prescriptions.exportFileName')}
            entityName={t('prescriptions.entityName')}
          />
          
          <GenericFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            title={t('prescriptions.formTitle')}
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