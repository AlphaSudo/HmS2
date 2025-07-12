import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { ColumnToggle } from "@/components/types/patient";
import GenericTableCard from "@/components/ui/GenericTableCard";
import {
  GenericFormModal,
  FieldConfig,
} from "@/components/ui/GenericFormModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { initialInvoices } from "@/assets/data/initialInvoices";
import {
  getAllInvoices,
  createInvoice,
  updateInvoice as updateInvoiceApi,
  deleteInvoice as deleteInvoiceApi,
  Invoice,
  Money,
  BillingItem,
  createMoneyObject,
  formatMoney,
  downloadInvoicePDF,
} from "@/services/billingService";
import { getPatientById } from "@/services/patientService";
import DoctorService from "@/services/doctorService";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import BillingIcon from "@/assets/icons/BillingIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Receipt, Calendar, User, FileText, DollarSign, CreditCard, Clock, CheckCircle, AlertCircle, XCircle, Eye, Download } from "lucide-react";

export default function BillingPage() {
  // Sidebar & Language
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useLanguage();
  const { t } = useTranslation();
  
  // Invoices Data
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  
  // Sorting & Pagination
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Form Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Invoice>>({});
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  
  // Doctors Data
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  
  // Hooks
  const { toast } = useToast();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  
  // Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  
  // Data Source Tracking
  const [dataSource, setDataSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [apiError, setApiError] = useState<string | null>(null);

  // Patient and Doctor Names Cache
  const [patientNames, setPatientNames] = useState<Record<number, string>>({});
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [namesLoading, setNamesLoading] = useState(false);

  // Invoice Preview Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  // Data fetching function - prioritize API data over sample data
  const fetchInvoices = useCallback(async (showToast = true) => {
    setIsLoading(true);
    setDataSource('loading');
    setApiError(null);
    
    try {
      const data = await getAllInvoices();
      const apiInvoices = data.data;
      
      // Prioritize API data - only use fallback if API returns empty
      if (apiInvoices && apiInvoices.length > 0) {
        setInvoices(apiInvoices);
        setDataSource('api');
        console.log(`✅ Loaded ${apiInvoices.length} invoices from API`);
        
        if (showToast) {
          toast({
            title: t('billing.toast.apiSuccess.title', 'Data Loaded'),
            description: t('billing.toast.apiSuccess.description', `Successfully loaded ${apiInvoices.length} invoices from server.`),
            className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
          });
        }
      } else {
        // Use sample data as fallback only if API returns empty
        setInvoices(initialInvoices);
        setDataSource('fallback');
        console.log("⚠️ API returned empty data, using sample invoices as fallback");
        
        if (showToast) {
          toast({
            title: t('billing.toast.fallbackData.title', 'Using Sample Data'),
            description: t('billing.toast.fallbackData.description', 'API returned no invoices, showing sample data for demonstration.'),
            className: cn(theme === 'dark' ? "bg-[#FBA427]/20 border border-[#FBA427]/50 text-white" : "bg-amber-50 border border-amber-200 text-amber-800"),
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      setApiError(errorMessage);
      console.error("❌ Failed to fetch invoices from API:", error);
      
      // Use sample data as fallback when API fails
      setInvoices(initialInvoices);
      setDataSource('fallback');
      
      if (showToast) {
        toast({
          title: t('billing.toast.apiError.title', 'API Connection Failed'),
          description: t('billing.toast.apiError.description', `Could not connect to billing service: ${errorMessage}. Showing sample data for demonstration.`),
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

  // Fetch patient and doctor names for invoices
  const fetchPatientAndDoctorNames = useCallback(async (invoiceList: Invoice[]) => {
    if (invoiceList.length === 0) return;
    
    setNamesLoading(true);
    
    try {
      const uniquePatientIds = Array.from(new Set(invoiceList.map(inv => inv.patientId)));
      const uniqueDoctorIds = Array.from(new Set(invoiceList.map(inv => inv.doctorId)));
      
      // Fetch patient names
      const patientPromises = uniquePatientIds.map(async (patientId) => {
        try {
          const response = await getPatientById(patientId);
          return { 
            id: patientId, 
            name: `${response.data.firstName} ${response.data.lastName}` 
          };
        } catch (error) {
          console.error(`Failed to fetch patient ${patientId}:`, error);
          return { id: patientId, name: `Patient #${patientId}` };
        }
      });
      
      // Fetch doctor names
      const doctorPromises = uniqueDoctorIds.map(async (doctorId) => {
        try {
          const response = await DoctorService.getDoctorById(doctorId);
          return { 
            id: doctorId, 
            name: `Dr. ${response.firstName} ${response.lastName}` 
          };
        } catch (error) {
          console.error(`Failed to fetch doctor ${doctorId}:`, error);
          return { id: doctorId, name: `Doctor #${doctorId}` };
        }
      });
      
      const [patientResults, doctorResults] = await Promise.all([
        Promise.all(patientPromises),
        Promise.all(doctorPromises)
      ]);
      
      // Update state with fetched names
      const newPatientNames: Record<number, string> = {};
      const newDoctorNames: Record<number, string> = {};
      
      patientResults.forEach(({ id, name }) => {
        newPatientNames[id] = name;
      });
      
      doctorResults.forEach(({ id, name }) => {
        newDoctorNames[id] = name;
      });
      
      setPatientNames(prev => ({ ...prev, ...newPatientNames }));
      setDoctorNames(prev => ({ ...prev, ...newDoctorNames }));
      
    } catch (error) {
      console.error('Error fetching names:', error);
    } finally {
      setNamesLoading(false);
    }
  }, []);

  // Handle invoice preview
  const handlePreviewInvoice = useCallback((invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setIsPreviewModalOpen(true);
  }, []);

  // Handle invoice download
  const handleDownloadInvoice = useCallback(async (invoiceId: string) => {
    setDownloadingInvoiceId(invoiceId);
    try {
      console.log(`[Download] Attempting to download invoice: ${invoiceId}`);
      
      // Check if the invoice ID is valid
      if (!invoiceId || invoiceId === 'undefined' || invoiceId === 'null') {
        throw new Error('Invalid invoice ID');
      }
      
      const response = await downloadInvoicePDF(invoiceId);
      
      // Check if response contains PDF data
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty PDF response from server');
      }
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`[Download] Successfully downloaded invoice: ${invoiceId}`);
      toast({
        title: t('billing.toast.downloadSuccess.title', 'Download Successful'),
        description: t('billing.toast.downloadSuccess.description', 'Invoice PDF downloaded successfully.'),
        className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
      });
    } catch (error: any) {
      console.error(`[Download] Failed to download invoice ${invoiceId}:`, error);
      
      let errorMessage = 'Failed to download invoice PDF.';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: PDF generation failed. The invoice might be corrupted or missing data.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Invoice not found. It may have been deleted.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to download this invoice.';
      } else if (error.message === 'Invalid invoice ID') {
        errorMessage = 'Invalid invoice ID. Cannot download PDF.';
      } else if (error.message === 'Empty PDF response from server') {
        errorMessage = 'Server returned empty PDF. Please try again.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast({
        title: t('billing.toast.downloadError.title', 'Download Failed'),
        description: t('billing.toast.downloadError.description', errorMessage),
        variant: "destructive",
      });
    } finally {
      setDownloadingInvoiceId(null);
    }
  }, [toast, theme, t]);

  // Fetch names whenever invoices change
  useEffect(() => {
    if (invoices.length > 0) {
      fetchPatientAndDoctorNames(invoices);
    }
  }, [invoices, fetchPatientAndDoctorNames]);

  // Fetch invoices from backend on mount
  useEffect(() => {
    fetchInvoices(false); // Don't show toast on initial load
  }, [fetchInvoices]);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Columns
  const getColumns = (t: (key: string) => string): ColumnToggle[] => [
    { id: "checkbox", label: t('billing.columns.select'), visible: true },
    { id: "invoiceNumber", label: t('billing.columns.invoiceNumber'), visible: true },
    { id: "patientName", label: t('billing.columns.patientName'), visible: true },
    { id: "doctorName", label: t('billing.columns.doctorName'), visible: true },
    { id: "invoiceDate", label: t('billing.columns.invoiceDate'), visible: true },
    { id: "dueDate", label: t('billing.columns.dueDate'), visible: false },
    { id: "totalAmount", label: t('billing.columns.totalAmount'), visible: true },
    { id: "paidAmount", label: t('billing.columns.paidAmount'), visible: true },
    { id: "outstandingAmount", label: t('billing.columns.outstandingAmount'), visible: true },
    { id: "status", label: t('billing.columns.status'), visible: true },
    { id: "notes", label: t('billing.columns.notes'), visible: false },
    { id: "actions", label: t('billing.columns.actions'), visible: true },
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
      id: "invoiceNumber",
      key: "invoiceNumber",
      label: t('billing.columnConfig.invoiceNumber'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <Receipt className={cn('w-4 h-4', theme === 'dark' ? 'text-[#8B5CF6]' : 'text-primary')} />
          <TruncatedWithTooltip text={item.invoiceNumber} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "patientName",
      key: "patientName",
      label: t('billing.columnConfig.patientName'),
      render: (item: Invoice & { patientName?: string }) => (
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium", theme === 'dark' ? 'bg-[#0C4A6E]' : 'bg-primary/20 text-primary')}>
            {(item.patientName || `Patient #${item.patientId}`).charAt(0).toUpperCase()}
          </div>
          <TruncatedWithTooltip 
            text={item.patientName || patientNames[item.patientId] || `Patient #${item.patientId}`} 
            maxWidth="max-w-[100px]" 
          />
        </div>
      ),
    },
    {
      id: "doctorName",
      key: "doctorName",
      label: t('billing.columnConfig.doctorName'),
      render: (item: Invoice & { doctorName?: string }) => (
        <div className="flex items-center gap-2">
          <User className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip 
            text={item.doctorName || doctorNames[item.doctorId] || 'Unknown Doctor'} 
            maxWidth="max-w-[120px]" 
          />
        </div>
      ),
    },
    {
      id: "invoiceDate",
      key: "invoiceDate",
      label: t('billing.columnConfig.invoiceDate'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <Calendar className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip text={new Date(item.invoiceDate).toLocaleDateString()} maxWidth="max-w-[100px]" />
        </div>
      ),
    },
    {
      id: "dueDate",
      key: "dueDate",
      label: t('billing.columnConfig.dueDate'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <Clock className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip text={new Date(item.dueDate).toLocaleDateString()} maxWidth="max-w-[100px]" />
        </div>
      ),
    },
    {
      id: "totalAmount",
      key: "totalAmount",
      label: t('billing.columnConfig.totalAmount'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <DollarSign className={cn('w-4 h-4', theme === 'dark' ? 'text-green-400' : 'text-green-600')} />
          <span className={cn('font-medium', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
            {formatMoney(item.totalAmount)}
          </span>
        </div>
      ),
    },
    {
      id: "paidAmount",
      key: "paidAmount",
      label: t('billing.columnConfig.paidAmount'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <CreditCard className={cn('w-4 h-4', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
          <span className={cn('font-medium', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}>
            {formatMoney(item.paidAmount)}
          </span>
        </div>
      ),
    },
    {
      id: "outstandingAmount",
      key: "outstandingAmount",
      label: t('billing.columnConfig.outstandingAmount'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <DollarSign className={cn('w-4 h-4', item.outstandingAmount.amount > 0 ? 'text-red-500' : 'text-gray-400')} />
          <span className={cn('font-medium', item.outstandingAmount.amount > 0 ? 'text-red-500' : 'text-gray-400')}>
            {formatMoney(item.outstandingAmount)}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      key: "status",
      label: t('billing.columnConfig.status'),
      render: (item: Invoice) => {
        const getStatusColor = (status: string) => {
          const isDark = theme === 'dark';
          switch (status.toLowerCase()) {
            case 'draft':
              return isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200';
            case 'sent':
              return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
            case 'paid':
              return isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
            case 'overdue':
              return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
            case 'cancelled':
              return isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-700 border-orange-200';
            default:
              return isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200';
          }
        };
        
        const getStatusIcon = (status: string) => {
          switch (status.toLowerCase()) {
            case 'paid':
              return <CheckCircle className="w-3 h-3" />;
            case 'overdue':
              return <AlertCircle className="w-3 h-3" />;
            case 'cancelled':
              return <XCircle className="w-3 h-3" />;
            default:
              return <Clock className="w-3 h-3" />;
          }
        };
        
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
            {getStatusIcon(item.status)}
            {item.status.toUpperCase()}
          </span>
        );
      },
    },
    {
      id: "notes",
      key: "notes",
      label: t('billing.columnConfig.notes'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <FileText className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          <TruncatedWithTooltip text={item.notes || 'No notes'} maxWidth="max-w-[150px]" />
        </div>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: t('billing.columnConfig.actions'),
      render: (item: Invoice) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewInvoice(item);
            }}
            className={cn(
              "p-2 rounded-md hover:bg-gray-100 transition-colors",
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            )}
            title="Preview Invoice"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadInvoice(item.id);
            }}
            disabled={downloadingInvoiceId === item.id}
            className={cn(
              "p-2 rounded-md hover:bg-gray-100 transition-colors",
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
              downloadingInvoiceId === item.id ? 'opacity-50 cursor-not-allowed' : ''
            )}
            title="Download Invoice PDF"
          >
            {downloadingInvoiceId === item.id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            ) : (
              <Download className="w-4 h-4 text-green-600" />
            )}
          </button>
        </div>
      ),
    },
  ];

  const formFields: FieldConfig[] = useMemo(() => [
    {
      id: "invoiceNumber",
      label: t('billing.formFields.invoiceNumber'),
      type: "text",
      required: false,
      disabled: true, // Auto-generated by backend
    },
    {
      id: "patientId",
      label: t('billing.formFields.patientId'),
      type: "number",
      required: true,
    },
    {
      id: "doctorId",
      label: t('billing.formFields.doctorId'),
      type: "number",
      required: true,
    },
    {
      id: "doctorName",
      label: t('billing.formFields.doctorName'),
      type: "select",
      required: true,
      options: doctorsLoading 
        ? [{ value: "", label: "Loading doctors...", disabled: true }]
        : [
            { value: "", label: t('billing.formFields.selectDoctor', 'Select a Doctor'), disabled: true },
            ...doctors.map(doctor => ({
              value: `Dr. ${doctor.firstName} ${doctor.lastName}`,
              label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization || 'General'}`,
              doctorId: doctor.id
            }))
          ]
    },
    {
      id: "appointmentId",
      label: t('billing.formFields.appointmentId'),
      type: "number",
      required: true,
    },
    {
      id: "invoiceDate",
      label: t('billing.formFields.invoiceDate'),
      type: "date",
      required: true,
    },
    {
      id: "dueDate",
      label: t('billing.formFields.dueDate'),
      type: "date",
      required: true,
    },
    {
      id: "status",
      label: t('billing.formFields.status'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('billing.formFields.selectStatus'), disabled: true },
        { value: "DRAFT", label: t('billing.formFields.draft') },
        { value: "SENT", label: t('billing.formFields.sent') },
        { value: "PAID", label: t('billing.formFields.paid') },
        { value: "OVERDUE", label: t('billing.formFields.overdue') },
        { value: "CANCELLED", label: t('billing.formFields.cancelled') },
      ],
    },
    {
      id: "subtotal",
      label: t('billing.formFields.subtotal'),
      type: "number",
      required: true,
      step: "0.01",
    },
    {
      id: "taxAmount",
      label: t('billing.formFields.taxAmount'),
      type: "number",
      required: false,
      step: "0.01",
    },
    {
      id: "discountAmount",
      label: t('billing.formFields.discountAmount'),
      type: "number",
      required: false,
      step: "0.01",
    },
    {
      id: "notes",
      label: t('billing.formFields.notes'),
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

  const handleFormSubmit = async (data: Partial<Invoice>) => {
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
        const invoiceData: Partial<Invoice> = {
          ...data,
          doctorId: Number(finalDoctorId),
          patientId: Number(data.patientId),
          appointmentId: Number(data.appointmentId),
          subtotal: createMoneyObject(Number(data.subtotal) || 0),
          taxAmount: createMoneyObject(Number(data.taxAmount) || 0),
          discountAmount: createMoneyObject(Number(data.discountAmount) || 0),
          totalAmount: createMoneyObject(
            (Number(data.subtotal) || 0) + 
            (Number(data.taxAmount) || 0) - 
            (Number(data.discountAmount) || 0)
          ),
        };
        
        await updateInvoiceApi(data.id, invoiceData);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchInvoices(false);
        } else {
          // If using fallback data, update locally
          setInvoices(
            invoices.map((invoice) =>
              invoice.id === data.id ? { ...invoice, ...invoiceData } : invoice,
            ),
          );
        }
        
        toast({
          title: t('billing.toast.invoiceUpdated.title'),
          description: t('billing.toast.invoiceUpdated.description', { invoiceNumber: data.invoiceNumber }),
          className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
        });
      } else {
        // Create new invoice
        const invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
          patientId: Number(data.patientId!),
          doctorId: Number(finalDoctorId) || 1,
          appointmentId: Number(data.appointmentId!),
          invoiceNumber: data.invoiceNumber || '',
          invoiceDate: data.invoiceDate || new Date().toISOString(),
          dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingItems: [],
          subtotal: createMoneyObject(Number(data.subtotal) || 0),
          taxAmount: createMoneyObject(Number(data.taxAmount) || 0),
          discountAmount: createMoneyObject(Number(data.discountAmount) || 0),
          totalAmount: createMoneyObject(
            (Number(data.subtotal) || 0) + 
            (Number(data.taxAmount) || 0) - 
            (Number(data.discountAmount) || 0)
          ),
          insuranceCoverage: createMoneyObject(0),
          patientResponsibility: createMoneyObject(
            (Number(data.subtotal) || 0) + 
            (Number(data.taxAmount) || 0) - 
            (Number(data.discountAmount) || 0)
          ),
          payments: [],
          paidAmount: createMoneyObject(0),
          outstandingAmount: createMoneyObject(
            (Number(data.subtotal) || 0) + 
            (Number(data.taxAmount) || 0) - 
            (Number(data.discountAmount) || 0)
          ),
          status: (data.status as Invoice['status']) || 'DRAFT',
          notes: data.notes || '',
          doctorName: data.doctorName || 'Unknown Doctor',
        };
        
        const created = await createInvoice(invoiceData);
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchInvoices(false);
        } else {
          // If using fallback data, add locally
          setInvoices([...invoices, created.data]);
        }
        
        toast({
          title: t('billing.toast.invoiceAdded.title'),
          description: t('billing.toast.invoiceAdded.description', { invoiceNumber: created.data.invoiceNumber }),
          className: cn(theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while saving the invoice.",
        variant: "destructive",
      });
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (invoiceToDelete) {
      try {
        const invoiceToRemove = invoices.find(
          (s) => s.id === invoiceToDelete.toString(),
        );
        
        await deleteInvoiceApi(invoiceToDelete.toString());
        
        // If using API data, refresh from API to stay in sync
        if (dataSource === 'api') {
          await fetchInvoices(false);
        } else {
          // If using fallback data, update locally
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const updatedInvoices = invoices.filter(
            (invoice) => invoice.id !== invoiceToDelete.toString(),
          );
          const updatedCurrentPageItems = updatedInvoices.slice(start, end);
          const isCurrentPageEmpty = updatedCurrentPageItems.length === 0;

          setInvoices(updatedInvoices);
          if (isCurrentPageEmpty && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        }
        
        toast({
          title: t('billing.toast.invoiceDeleted.title'),
          description: t('billing.toast.invoiceDeleted.description', { invoiceNumber: invoiceToRemove?.invoiceNumber || t('billing.entityName') }),
          variant: "destructive",
          className: cn("border", theme === 'dark' ? "bg-[#450A0A] border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"),
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while deleting the invoice.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const getExportData = (invoice: Invoice & { patientName?: string; doctorName?: string }) => ({
    [t('billing.export.invoiceNumber')]: invoice.invoiceNumber,
    [t('billing.export.patientName')]: invoice.patientName || patientNames[invoice.patientId] || `Patient #${invoice.patientId}`,
    [t('billing.export.doctorName')]: invoice.doctorName || doctorNames[invoice.doctorId] || 'Unknown Doctor',
    [t('billing.export.invoiceDate')]: new Date(invoice.invoiceDate).toLocaleDateString(),
    [t('billing.export.dueDate')]: new Date(invoice.dueDate).toLocaleDateString(),
    [t('billing.export.totalAmount')]: formatMoney(invoice.totalAmount),
    [t('billing.export.paidAmount')]: formatMoney(invoice.paidAmount),
    [t('billing.export.outstandingAmount')]: formatMoney(invoice.outstandingAmount),
    [t('billing.export.status')]: invoice.status,
    [t('billing.export.notes')]: invoice.notes || 'No notes',
  });

  return (
    <div className={cn("flex h-screen overflow-hidden", theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground')}>
      <Sidebar isOpen={sidebarOpen} />
      <div className={cn("flex-1 flex flex-col overflow-y-auto", theme === 'dark' ? 'bg-[#040223] gradient-bg-background' : 'bg-background')}>
        <Header
          title={t('billing.title')}
          icon={<BillingIcon className="h-8 w-8" />}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 px-8 py-8 pt-24 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className={cn("text-2xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>{t('billing.viewInvoices')}</h1>
              
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
                  {dataSource === 'api' && t('billing.dataSource.api', 'Live Data')}
                  {dataSource === 'fallback' && t('billing.dataSource.fallback', 'Sample Data')}
                  {dataSource === 'loading' && t('billing.dataSource.loading', 'Loading...')}
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={() => fetchInvoices(true)}
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
                  {t('billing.refresh', 'Refresh')}
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
                      {t('billing.apiError.title', 'API Connection Issue')}
                    </p>
                    <p className="text-xs mt-1">
                      {t('billing.apiError.description', 'Unable to connect to the billing service. Showing sample data for demonstration purposes.')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Invoices Table Card */}
          <GenericTableCard
            items={invoices.map((invoice, index) => ({ 
              ...invoice, 
              id: parseInt(invoice.id?.toString() || '0') || index + 1,
              // Ensure patient and doctor names are available
              patientName: patientNames[invoice.patientId] || `Patient #${invoice.patientId}`,
              doctorName: doctorNames[invoice.doctorId] || `Doctor #${invoice.doctorId}`
            }))}
            setItems={(items) => setInvoices(items.map(item => ({ 
              ...item, 
              id: item.id?.toString() || `invoice-${Date.now()}`
            } as Invoice)))}
            selectedItems={selectedInvoices}
            setSelectedItems={setSelectedInvoices}
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
            onEditClick={(invoice) => {
              // Convert money objects to numbers for form
              const formInvoice = {
                ...invoice,
                id: invoice.id?.toString() || '',
                subtotal: (invoice as any).subtotal?.amount || 0,
                taxAmount: (invoice as any).taxAmount?.amount || 0,
                discountAmount: (invoice as any).discountAmount?.amount || 0,
              };
              setFormData(formInvoice);
              setIsEditMode(true);
              setIsFormOpen(true);
            }}
            onDeleteClick={(id) => {
              setInvoiceToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            initialItems={initialInvoices.map((invoice, index) => ({ 
              ...invoice, 
              id: parseInt(invoice.id?.toString() || '0') || index + 1,
              patientName: `Patient #${invoice.patientId}`,
              doctorName: invoice.doctorName || `Doctor #${invoice.doctorId}`
            }))}
            columnConfig={columnConfig}
            getExportData={(item) => getExportData(item as any)}
            exportFileName={t('billing.exportFileName')}
            entityName={t('billing.entityName')}
          />
          
          <GenericFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            title={t('billing.formTitle')}
            fields={formFields}
          />

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onCancel={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
          />
          
          {/* Invoice Preview Modal */}
          {isPreviewModalOpen && previewInvoice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={cn("bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", theme === 'dark' ? 'bg-[#1E1B4B] text-white' : 'bg-white text-black')}>
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Invoice Preview</h2>
                    <button
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Invoice Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Invoice Number:</strong> {previewInvoice.invoiceNumber}</div>
                        <div><strong>Patient:</strong> {patientNames[previewInvoice.patientId] || `Patient #${previewInvoice.patientId}`}</div>
                        <div><strong>Doctor:</strong> {doctorNames[previewInvoice.doctorId] || `Doctor #${previewInvoice.doctorId}`}</div>
                        <div><strong>Invoice Date:</strong> {new Date(previewInvoice.invoiceDate).toLocaleDateString()}</div>
                        <div><strong>Due Date:</strong> {new Date(previewInvoice.dueDate).toLocaleDateString()}</div>
                        <div><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${previewInvoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{previewInvoice.status}</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Subtotal:</strong> {formatMoney(previewInvoice.subtotal)}</div>
                        <div><strong>Tax Amount:</strong> {formatMoney(previewInvoice.taxAmount)}</div>
                        <div><strong>Discount:</strong> {formatMoney(previewInvoice.discountAmount)}</div>
                        <div className="border-t pt-2"><strong>Total Amount:</strong> {formatMoney(previewInvoice.totalAmount)}</div>
                        <div><strong>Paid Amount:</strong> {formatMoney(previewInvoice.paidAmount)}</div>
                        <div><strong>Outstanding:</strong> {formatMoney(previewInvoice.outstandingAmount)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {previewInvoice.notes && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Notes</h3>
                      <p className="text-sm text-gray-600">{previewInvoice.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(previewInvoice.id)}
                      disabled={downloadingInvoiceId === previewInvoice.id}
                      className={cn(
                        "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2",
                        downloadingInvoiceId === previewInvoice.id ? "opacity-50 cursor-not-allowed" : ""
                      )}
                    >
                      {downloadingInvoiceId === previewInvoice.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 