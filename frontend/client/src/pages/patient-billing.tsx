import { useState, useEffect, useMemo } from "react";
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { PatientHeader } from "@/components/ui/PatientHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from 'sonner';
import {
  getInvoicesByUserId,
  getPatientBillingStatsByUserId,
  updateInvoiceStatus,
  downloadInvoicePDF,
  formatMoney,
  InvoiceFilters,
  Invoice,
  createMoneyObject
} from '../services/billingService';
import { getPatientByUserId } from "@/services/patientService";
import { 
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  DollarSign,
  FileText,
  Calendar,
  User,
  Receipt,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard as CardIcon,
  Shield,
  Banknote,
  XCircle
} from "lucide-react";
import { BillingPageSkeleton } from "@/components/BillingPageSkeleton";

// Use the Invoice type from billingService instead of local BillingInvoice
type BillingInvoice = Invoice;

// Sample data functions for development fallback
const getSampleInvoices = (count: number): BillingInvoice[] => {
  return Array.from({ length: count }, (_, i) => {
    const subtotalAmount = 100 + i * 50;
    const taxAmount = subtotalAmount * 0.08; // 8% tax
    const discountAmount = 0;
    const totalAmount = subtotalAmount + taxAmount - discountAmount;
    const paidAmount = i === 0 ? totalAmount : 0;
    const outstandingAmount = totalAmount - paidAmount;

    return {
      id: `sample-${i + 1}`,
      patientId: 1,
      doctorId: 1 + i,
      appointmentId: 1 + i,
      invoiceNumber: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingItems: [
        {
          itemCode: `SAMPLE-${i + 1}`,
          description: `Sample Service ${i + 1}`,
          quantity: 1,
          unitPrice: createMoneyObject(subtotalAmount),
          totalPrice: createMoneyObject(subtotalAmount),
          category: 'CONSULTATION'
        }
      ],
      subtotal: createMoneyObject(subtotalAmount),
      taxAmount: createMoneyObject(taxAmount),
      discountAmount: createMoneyObject(discountAmount),
      totalAmount: createMoneyObject(totalAmount),
      insuranceCoverage: createMoneyObject(0),
      patientResponsibility: createMoneyObject(totalAmount),
      payments: paidAmount > 0 ? [
        {
          paymentId: `pay-sample-${i + 1}`,
          amount: createMoneyObject(paidAmount),
          paymentMethod: 'Credit Card',
          transactionId: `TXN-SAMPLE-${i + 1}`,
          paymentDate: new Date().toISOString(),
          status: 'COMPLETED'
        }
      ] : [],
      paidAmount: createMoneyObject(paidAmount),
      outstandingAmount: createMoneyObject(outstandingAmount),
      status: i === 0 ? 'PAID' : 'SENT',
      notes: `Sample invoice ${i + 1} for demonstration purposes`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doctorName: `Dr. Sample ${i + 1}`
    };
  });
};

const createSampleStats = () => ({
  patientId: 1,
  totalBilled: { amount: 500, currency: "USD" },
  totalPaid: { amount: 100, currency: "USD" },
  totalOutstanding: { amount: 400, currency: "USD" }
});

const isDevelopment = process.env.NODE_ENV === 'development' || import.meta.env.DEV;

export default function PatientBilling() {
  useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "PAID" | "SENT" | "OVERDUE">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "doctor">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const recordsPerPage = 6;
  const { isRTL } = useLanguage();

  // TEMPORARY: Map user ID to patient ID based on the data pattern
  // user_id 8 → patient_id 1, user_id 9 → patient_id 2, etc.
  const getUserIdToPatientIdMapping = (userId: number): number => {
    // Based on the database pattern: patient_id = user_id - 7
    return userId - 7;
  };

  // Get patient data first, then patient ID
  const { data: patientData, isLoading: patientLoading, error: patientError } = useQuery({
    queryKey: ['patient-by-user', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.reject(new Error("User ID is not available."));
      }
      console.log(`[useQuery] Fetching patient data for userId: ${user.id}`);
      return getPatientByUserId(user.id);
    },
    enabled: !!user?.id
  });

  // Map user ID to correct patient ID since API doesn't return patient.id
  const patientId = user?.id ? getUserIdToPatientIdMapping(parseInt(user.id)) : null;
  
  console.log(`[PatientBilling] User ID: ${user?.id} → Patient ID: ${patientId}`);
  console.log(`[PatientBilling] Patient data available:`, !!patientData?.data);
  console.log(`[PatientBilling] Patient record:`, patientData?.data);
  console.log(`[PatientBilling] Patient ID resolution: id=${patientData?.data?.id}, patientId=${patientData?.data?.patientId}, userId=${patientData?.data?.userId}`);
  console.log(`[PatientBilling] Final patientId: ${patientId} (should be 1 for user_id 8)`);
  if (patientError) {
    console.log(`[PatientBilling] Patient fetch error, using fallback:`, patientError);
  }

  // API Queries
  const invoiceFilters: InvoiceFilters = {
    status: statusFilter === "all" ? undefined : statusFilter,
    page: currentPage - 1, // Backend is 0-indexed
    size: recordsPerPage
  };

  const { data: invoicesData, isLoading, error } = useQuery({
    queryKey: ['patient-invoices', user?.id, invoiceFilters],
    queryFn: async () => {
      if (!user?.id) {
        console.log('[useQuery] No user ID available');
        throw new Error('User ID not available');
      }

      console.log(`[useQuery] Attempting to fetch invoices for userId: ${user.id}`);
      const response = await getInvoicesByUserId(parseInt(user.id), invoiceFilters);
      console.log('[useQuery] Response received:', response);
      return response;
    },
    enabled: !!user?.id,
  });

  if (error) {
    console.error("[useQuery] An error occurred while fetching invoices:", error);
  }

  const { data: statsResponse } = useQuery({
    queryKey: ['patient-billing-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('[useQuery] No user ID available for stats');
        throw new Error('User ID not available');
      }

      console.log(`[useQuery] Attempting to fetch billing stats for userId: ${user.id}`);
      try {
        const result = await getPatientBillingStatsByUserId(parseInt(user.id));
        console.log(`[useQuery] Billing stats response:`, result.data);
        return result;
      } catch (error: any) {
        console.error(`[useQuery] Billing stats API error:`, error);
        console.error(`[useQuery] Stats error details:`, {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message
        });
        throw error;
      }
    },
    enabled: !!user?.id
  });

  const downloadMutation = useMutation({
    mutationFn: downloadInvoicePDF,
    onSuccess: (_, invoiceId: string) => {
      toast.success("Invoice downloaded successfully!", { id: `download-${invoiceId}` });
      setDownloadingId(null);
    },
    onError: (error, invoiceId: string) => {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.", { id: `download-${invoiceId}` });
      setDownloadingId(null);
    },
  });

  const handleDownload = (invoiceId: string) => {
    setDownloadingId(invoiceId);
    toast.loading("Downloading invoice...", { id: `download-${invoiceId}` });
    downloadMutation.mutate(invoiceId);
  };

  // Include patient loading in overall loading state
  const isOverallLoading = patientLoading || isLoading;

  // Smart fallback: use sample data only when no real data exists (not during loading)
  const hasRealData = invoicesData?.data?.content && invoicesData.data.content.length > 0;
  
  // Show sample data if:
  // - Not loading
  // - There's an error and we're in a development environment (allowing fallback on error)
  // - OR if we're in development and have no real data
  const shouldShowSampleData = !isOverallLoading && (
    (!!error && isDevelopment) || 
    (!hasRealData && isDevelopment)
  );
  
  const records = hasRealData 
    ? invoicesData.data.content 
    : shouldShowSampleData 
      ? getSampleInvoices(3)
      : [];
      
  // Debug logging
  console.log('[PatientBilling] Data selection logic:', {
    hasRealData,
    shouldShowSampleData,
    recordsLength: records.length,
    isDevelopment,
    error: !!error,
    isOverallLoading,
    invoicesDataExists: !!invoicesData,
    contentExists: !!invoicesData?.data?.content,
    contentLength: invoicesData?.data?.content?.length || 0
  });
  
  // Debug sample records
  if (shouldShowSampleData && records.length > 0) {
    console.log('[PatientBilling] Using sample data, first record structure:', {
      id: records[0]?.id,
      hasSubtotal: !!records[0]?.subtotal,
      subtotalAmount: records[0]?.subtotal?.amount,
      hasTaxAmount: !!records[0]?.taxAmount,
      hasDiscountAmount: !!records[0]?.discountAmount,
      hasTotalAmount: !!records[0]?.totalAmount
    });
  }
      
  const stats = statsResponse?.data 
    ? statsResponse.data
    : shouldShowSampleData 
      ? createSampleStats()
      : { 
          patientId: 0,
          totalBilled: { amount: 0, currency: "USD" }, 
          totalPaid: { amount: 0, currency: "USD" }, 
          totalOutstanding: { amount: 0, currency: "USD" }
        };

  // Determine whether to show the main error block.
  // We show it only if there's an error and we are NOT falling back to sample data.
  const showErrorBlock = !!error && !isOverallLoading && !shouldShowSampleData;

  // Determine whether to show the main content.
  // We show it if we're not loading, and we either have no error or are showing sample data as a fallback.
  const showContent = !isOverallLoading && (!error || shouldShowSampleData);
  
  // Client-side filtering for search term
  const filteredRecords = useMemo(() => {
    return records.filter((record: BillingInvoice) => {
      const matchesSearch = 
        record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.doctorName && record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [records, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredRecords.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredRecords, currentPage, recordsPerPage]);

  // Statistics from API - Money objects that formatMoney can handle
  const totalBilled = stats.totalBilled;  // Money object
  const totalPaid = stats.totalPaid;      // Money object  
  const totalPending = stats.totalOutstanding;  // Money object (use outstanding as pending)
  const totalOverdue = { amount: 0, currency: "USD" };  // Backend doesn't provide separate overdue

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'SENT':
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 'OVERDUE':
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case 'DRAFT':
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 'CANCELLED':
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return theme==='dark' ? "bg-gray-500/20 text-gray-400 border-gray-500/30" : "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4" />;
      case 'SENT':
        return <Clock className="w-4 h-4" />;
      case 'OVERDUE':
        return <AlertCircle className="w-4 h-4" />;
      case 'DRAFT':
        return <Clock className="w-4 h-4" />;
      case 'CANCELLED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Invoice Details Modal Component
  const InvoiceDetailsModal = ({ invoice, onClose }: { invoice: BillingInvoice; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={cn(
        'w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border m-4',
        theme === 'dark' ? 'bg-[#0f0728] border-white/10' : 'bg-white border-gray-200'
      )}>
        {/* Header */}
        <div className={cn('flex items-center justify-between p-6 border-b', theme === 'dark' ? 'border-white/10' : 'border-gray-200')}>
          <div>
            <h2 className={cn('text-2xl font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              Invoice Details
            </h2>
            <p className={cn('text-sm mt-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {invoice.invoiceNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Invoice Info */}
          <div className={cn('rounded-xl border p-4', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}>
            <h3 className={cn('text-lg font-semibold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              Invoice Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Doctor
                </label>
                <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {invoice.doctorName || 'N/A'}
                </p>
              </div>
              <div>
                <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Invoice Date
                </label>
                <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Due Date
                </label>
                <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Status
                </label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1">{invoice.status}</span>
                  </span>
                </div>
              </div>
              <div>
                <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Patient ID
                </label>
                <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {invoice.patientId}
                </p>
              </div>
              <div>
                <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Appointment ID
                </label>
                <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {invoice.appointmentId}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Items */}
          <div className={cn('rounded-xl border p-4', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}>
            <h3 className={cn('text-lg font-semibold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              Services & Procedures
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn('border-b', theme === 'dark' ? 'border-white/10' : 'border-gray-200')}>
                    <th className={cn('text-left py-2 text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Code
                    </th>
                    <th className={cn('text-left py-2 text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Description
                    </th>
                    <th className={cn('text-left py-2 text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Qty
                    </th>
                    <th className={cn('text-left py-2 text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Unit Price
                    </th>
                    <th className={cn('text-left py-2 text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.billingItems.map((item, index) => (
                    <tr key={index} className={cn('border-b', theme === 'dark' ? 'border-white/5' : 'border-gray-100')}>
                      <td className={cn('py-3 text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                        {item.itemCode}
                      </td>
                      <td className={cn('py-3 text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                            {item.category}
                          </p>
                        </div>
                      </td>
                      <td className={cn('py-3 text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                        {item.quantity}
                      </td>
                      <td className={cn('py-3 text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        ${item.unitPrice.amount.toFixed(2)}
                      </td>
                      <td className={cn('py-3 text-sm font-bold text-[#06B6D4]')}>
                        ${item.totalPrice.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Amount Breakdown */}
            <div className={cn('rounded-xl border p-4', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}>
              <h3 className={cn('text-lg font-semibold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                Amount Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Subtotal</span>
                  <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    ${invoice.subtotal.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Tax</span>
                  <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    ${invoice.taxAmount.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Discount</span>
                  <span className={cn('text-sm font-medium text-green-400')}>
                    -${invoice.discountAmount.amount.toFixed(2)}
                  </span>
                </div>
                <div className={cn('border-t pt-3', theme === 'dark' ? 'border-white/10' : 'border-gray-200')}>
                  <div className="flex justify-between">
                    <span className={cn('text-base font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      Total Amount
                    </span>
                    <span className="text-base font-bold text-[#06B6D4]">
                      ${invoice.totalAmount.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className={cn('border-t pt-3', theme === 'dark' ? 'border-white/10' : 'border-gray-200')}>
                  <div className="flex justify-between">
                    <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Paid Amount</span>
                    <span className={cn('text-sm font-medium text-green-400')}>
                      ${invoice.paidAmount.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      Outstanding
                    </span>
                    <span className={cn('text-sm font-bold', invoice.outstandingAmount.amount > 0 ? 'text-red-400' : 'text-green-400')}>
                      ${invoice.outstandingAmount.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className={cn('rounded-xl border p-4', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}>
              <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                <Shield className="w-5 h-5" />
                Insurance Information
              </h3>
              {invoice.insurance ? (
                <div className="space-y-3">
                  <div>
                    <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Insurance Company
                    </label>
                    <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {invoice.insurance.insuranceCompany}
                    </p>
                  </div>
                  <div>
                    <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Policy Number
                    </label>
                    <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {invoice.insurance.policyNumber}
                    </p>
                  </div>
                  <div>
                    <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      Coverage Percentage
                    </label>
                    <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {invoice.insurance.coveragePercentage}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                        Copay
                      </label>
                      <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        ${invoice.insurance.copayAmount.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                        Deductible
                      </label>
                      <p className={cn('text-base font-medium mt-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        ${invoice.insurance.deductible.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className={cn('border-t pt-3', theme === 'dark' ? 'border-white/10' : 'border-gray-200')}>
                    <div className="flex justify-between">
                      <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Insurance Coverage</span>
                      <span className={cn('text-sm font-medium text-blue-400')}>
                        ${invoice.insuranceCoverage.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        Patient Responsibility
                      </span>
                      <span className={cn('text-sm font-bold text-[#06B6D4]')}>
                        ${invoice.patientResponsibility.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cn('text-center py-8', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No insurance information on file</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          {invoice.payments.length > 0 && (
            <div className={cn('rounded-xl border p-4', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}>
              <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                <Banknote className="w-5 h-5" />
                Payment History
              </h3>
              <div className="space-y-3">
                {invoice.payments.map((payment, index) => (
                  <div 
                    key={index} 
                    className={cn('p-3 rounded-lg border', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200')}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardIcon className="w-4 h-4 text-gray-400" />
                          <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            payment.status === 'COMPLETED' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                          Payment ID: {payment.paymentId}
                        </p>
                        <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                          Transaction: {payment.transactionId}
                        </p>
                        <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                          Date: {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          ${payment.amount.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className={cn('rounded-xl border p-4', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}>
              <h3 className={cn('text-lg font-semibold mb-3', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                Notes
              </h3>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={onClose}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                theme === 'dark' 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Close
            </button>
            <button 
              onClick={() => handleDownload(invoice.id)}
              disabled={downloadingId === invoice.id}
              className="px-4 py-2 bg-[#06B6D4] text-white rounded-lg hover:bg-[#06B6D4]/90 transition-colors flex items-center gap-2"
            >
              {downloadingId === invoice.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Download className="w-4 h-4" />}
              <span>{downloadingId === invoice.id ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            {invoice.status !== 'PAID' && (
              <button className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] text-white' : 'bg-background text-foreground')}>
      <PatientSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
        <div className="p-8">
          <PatientHeader 
              title={t('patientBilling.title', 'Billing & Invoices')} 
              subtitle={t('patientBilling.subtitle', 'Track your medical expenses and payment history')} 
              icon={<Receipt className={cn('w-5 h-5', theme==='dark' ? 'text-white' : 'text-primary')} />} 
          />

          {/* Loading Skeleton */}
          {isOverallLoading && <BillingPageSkeleton />}

          {/* Error Message */}
          {showErrorBlock && (
            <div className={cn('backdrop-blur-sm rounded-2xl border p-12 text-center', theme === 'dark' ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-800')}>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Billing Data</h3>
              <p className="text-sm">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
          )}

          {/* Main Content */}
          {showContent && (
            <>
              {/* Sample Data Notice */}
              {shouldShowSampleData && (
                <div className={cn('backdrop-blur-sm rounded-2xl border p-4 mb-6', theme === 'dark' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700')}>
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100')}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className={cn('font-semibold', theme === 'dark' ? 'text-blue-300' : 'text-blue-800')}>
                        Demo Data Preview
                      </h4>
                      <p className={cn('text-sm mt-1', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}>
                        You're viewing sample billing data. Real invoices will appear here once you have appointments and billing records.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={cn('backdrop-blur-sm rounded-2xl border p-6', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-card border text-foreground')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn('text-sm font-medium', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientBilling.stats.totalBilled','Total Billed')}</p>
                      <p className={cn("text-2xl font-bold", theme==='dark' ? 'text-white' : 'text-foreground')}>${formatMoney(totalBilled)}</p>
                      <p className="text-[#06B6D4] text-sm font-medium mt-1">{t('patientBilling.stats.invoices',{ defaultValue: '{{count}} invoices', count: records.length })}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                      <DollarSign className={cn("w-6 h-6", theme==='dark' ? 'text-white' : 'text-primary')} />
                    </div>
                  </div>
                </div>

                <div className={cn('backdrop-blur-sm rounded-2xl border p-6', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-card border text-foreground')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn('text-sm font-medium', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientBilling.stats.totalPaid','Total Paid')}</p>
                      <p className="text-2xl font-bold text-green-400">${formatMoney(totalPaid)}</p>
                      <p className="text-green-400 text-sm font-medium mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {t('patientBilling.stats.paidLabel',{ defaultValue: '{{count}} paid', count: records.filter(r=>r.status==='PAID').length })}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>

                <div className={cn('backdrop-blur-sm rounded-2xl border p-6', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-card border text-foreground')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn('text-sm font-medium', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientBilling.stats.pending','Pending')}</p>
                      <p className="text-2xl font-bold text-yellow-400">${formatMoney(totalPending)}</p>
                      <p className="text-yellow-400 text-sm font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('patientBilling.stats.pendingLabel',{ defaultValue: '{{count}} pending', count: records.filter(r=>r.status==='SENT').length })}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className={cn('backdrop-blur-sm rounded-2xl border p-6', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-card border text-foreground')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn('text-sm font-medium', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientBilling.stats.overdue','Overdue')}</p>
                      <p className="text-2xl font-bold text-red-400">${formatMoney(totalOverdue)}</p>
                      <p className="text-red-400 text-sm font-medium mt-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {t('patientBilling.stats.overdueLabel',{ defaultValue: '{{count}} overdue', count: records.filter(r=>r.status==='OVERDUE').length })}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className={cn('backdrop-blur-sm rounded-2xl border p-6 mb-8', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-card border text-foreground')}>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1">
                      <Search className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5', theme==='dark' ? 'text-gray-400' : 'text-primary')} />
                      <input
                        type="text"
                        placeholder={t('patientBilling.searchPlaceholder','Search by invoice number or doctor name...')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                          'w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent',
                          theme==='dark'
                            ? 'bg-[#1a0a2e] border border-white/20 text-white placeholder-gray-400 focus:ring-[#8B5CF6]'
                            : 'bg-input border text-foreground placeholder-muted-foreground focus:ring-primary'
                        )}
                      />
                    </div>
                    
                    <div className="relative">
                      <Filter className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5', theme==='dark' ? 'text-gray-400' : 'text-primary')} />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "PAID" | "SENT" | "OVERDUE")}
                        className={cn(
                          'pl-10 pr-8 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent appearance-none cursor-pointer',
                          theme==='dark'
                            ? 'bg-[#1a0a2e] border border-white/20 text-white focus:ring-[#8B5CF6]'
                            : 'bg-input border text-foreground focus:ring-primary'
                        )}
                        style={{ colorScheme: theme==='dark' ? 'dark' : 'light' }}
                      >
                        <option value="all" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.filter.all','All Status')}</option>
                        <option value="PAID" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.filter.paid','Paid')}</option>
                        <option value="SENT" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.filter.pending','Sent')}</option>
                        <option value="OVERDUE" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.filter.overdue','Overdue')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-muted-foreground')}>{t('patientBilling.sort.label','Sort by:')}</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "doctor")}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent appearance-none cursor-pointer',
                          theme==='dark'
                            ? 'bg-[#1a0a2e] border border-white/20 text-white focus:ring-[#8B5CF6]'
                            : 'bg-input border text-foreground focus:ring-primary'
                        )}
                        style={{ colorScheme: theme==='dark' ? 'dark' : 'light' }}
                      >
                        <option value="date" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.sort.date','Date')}</option>
                        <option value="amount" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.sort.amount','Amount')}</option>
                        <option value="doctor" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientBilling.sort.doctor','Doctor')}</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          theme==='dark'
                            ? 'bg-[#1a0a2e] border border-white/20 text-gray-400 hover:text-white'
                            : 'bg-input border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {sortOrder === "asc" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <button className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      {t('patientBilling.buttons.export','Export')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Table */}
              <div className={cn('backdrop-blur-sm rounded-2xl border overflow-hidden', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-md')}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={cn(theme === 'dark' ? 'bg-white/5 border-b border-white/10' : 'bg-muted border-b', '')}>
                      <tr>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.invoiceNo','Invoice No')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.doctorName','Doctor Name')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.date','Date')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.amount','Amount')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.tax','Tax')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.discount','Discount')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.total','Total')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.status','Status')}</th>
                        <th className={cn('px-6 py-4 text-left text-sm font-semibold', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientBilling.table.actions','Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecords.map((record: BillingInvoice) => (
                        <tr key={record.id} className={cn(
                          'border-b transition-colors',
                          theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-border hover:bg-muted/50',
                          shouldShowSampleData && 'opacity-80' // Subtle indication for sample data
                        )}>
                          <td className="px-6 py-4">
                            <span className="text-[#8B5CF6] font-medium">{record.invoiceNumber}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className={cn('font-medium', theme==='dark' ? 'text-white' : 'text-foreground')}>{record.doctorName || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={cn('flex items-center gap-2', theme==='dark' ? 'text-gray-300' : 'text-gray-700')}>
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(record.invoiceDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className={cn('px-6 py-4 font-medium', theme==='dark' ? 'text-white' : 'text-foreground')}>${record.subtotal?.amount?.toFixed(2) || '0.00'}</td>
                          <td className={cn('px-6 py-4', theme==='dark' ? 'text-gray-300' : 'text-gray-700')}>${record.taxAmount?.amount?.toFixed(2) || '0.00'}</td>
                          <td className={cn('px-6 py-4', theme==='dark' ? 'text-gray-300' : 'text-gray-700')}>${record.discountAmount?.amount?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4 text-[#06B6D4] font-bold">${record.totalAmount?.amount?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 w-fit ${getStatusBadge(record.status)}`}>
                              {getStatusIcon(record.status)}
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setSelectedInvoice(record)}
                                className="p-2 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6]/30 transition-colors" 
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDownload(record.id)}
                                disabled={downloadingId === record.id}
                                className="p-2 bg-[#06B6D4]/20 text-[#06B6D4] rounded-lg hover:bg-[#06B6D4]/30 transition-colors flex items-center justify-center w-9 h-9" 
                                title="Download Invoice"
                              >
                                {downloadingId === record.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Download className="w-4 h-4" />}
                              </button>
                              {record.status !== 'PAID' && (
                                <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors" title="Pay Now">
                                  <CreditCard className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={cn('flex items-center justify-between px-6 py-4 border-t', theme==='dark' ? 'border-white/10' : 'border-border')}>
                    <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-muted-foreground')}>
                      {t('patientBilling.pagination.showing', {
                        defaultValue: 'Showing {{from}} to {{to}} of {{total}} results',
                        from: (currentPage - 1) * recordsPerPage + 1,
                        to: Math.min(currentPage * recordsPerPage, filteredRecords.length),
                        total: filteredRecords.length,
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={cn(
                          'px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                          theme==='dark'
                            ? 'bg-[#1a0a2e] border border-white/20 text-white hover:bg-white/5'
                            : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                        )}
                      >
                        {t('pagination.previous','Previous')}
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            'px-3 py-2 rounded-lg text-sm transition-colors',
                            currentPage === page
                              ? (theme==='dark' ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white' : 'bg-[#8B5CF6] text-white')
                              : (theme==='dark'
                                  ? 'bg-[#1a0a2e] border border-white/20 text-white hover:bg-white/5'
                                  : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100')
                          )}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={cn(
                          'px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                          theme==='dark'
                            ? 'bg-[#1a0a2e] border border-white/20 text-white hover:bg-white/5'
                            : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                        )}
                      >
                        {t('pagination.next','Next')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Empty State */}
              {paginatedRecords.length === 0 && !isLoading && (
                <div className={cn('backdrop-blur-sm rounded-2xl border p-12 text-center', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-card border text-foreground')}>
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={cn('text-xl font-semibold mb-2', theme==='dark' ? 'text-white' : 'text-foreground')}>{t('patientBilling.empty.noRecords','No billing records found')}</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm || statusFilter !== "all" 
                      ? t('patientBilling.empty.searchAdjust','Try adjusting your search criteria or filters') 
                      : t('patientBilling.empty.noRecordsYet','Your billing history will appear here once you have appointments')
                    }
                  </p>
                  {(searchTerm || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {t('patientBilling.buttons.clearFilters','Clear Filters')}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Invoice Details Modal */}
          {selectedInvoice && (
            <InvoiceDetailsModal 
              invoice={selectedInvoice} 
              onClose={() => setSelectedInvoice(null)} 
            />
          )}
        </div>
      </main>
    </div>
  );
} 