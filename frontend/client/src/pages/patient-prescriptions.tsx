import { useState, useEffect } from "react";
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { PatientHeader } from "@/components/ui/PatientHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { getPrescriptionsByPatient, Prescription } from "@/services/prescriptionService";
import { 
  Calendar, 
  User, 
  FileText, 
  Download, 
  Eye, 
  Pill,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";


export default function PatientPrescriptions() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "dispensed" | "cancelled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state for viewing prescription details
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch prescriptions when component mounts
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getPrescriptionsByPatient(Number(user.id));
        setPrescriptions(response.data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load prescriptions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user?.id]);

  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.notes && prescription.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || prescription.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string, theme: 'dark' | 'light') => {
    const isDark = theme==='dark';
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

  const getStatusCount = (status: "pending" | "dispensed" | "cancelled") => {
    return prescriptions.filter(p => p.status.toLowerCase() === status).length;
  };

  // Action button handlers
  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const handleDownloadPrescription = (prescription: Prescription) => {
    // Create a simple prescription document
    const prescriptionText = `
PRESCRIPTION DETAILS
==================

Prescription Number: ${prescription.prescriptionNumber}
Patient: ${prescription.patientName}
Doctor: ${prescription.doctorName}
Date Prescribed: ${prescription.prescribedDate}
${prescription.dispensedDate ? `Date Dispensed: ${prescription.dispensedDate}` : ''}
Status: ${prescription.status.toUpperCase()}
${prescription.totalAmount ? `Total Amount: $${prescription.totalAmount.toFixed(2)}` : ''}

Notes:
${prescription.notes || 'No additional notes'}

Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download the file
    const blob = new Blob([prescriptionText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription-${prescription.prescriptionNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Success - file has been downloaded
    console.log(`Prescription ${prescription.prescriptionNumber} downloaded successfully`);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedPrescription(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isViewModalOpen) {
        closeViewModal();
      }
    };

    if (isViewModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isViewModalOpen]);

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] text-white' : 'bg-background text-foreground')}>
      <PatientSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')} p-8`}>
        <PatientHeader 
            title={t('patientPrescriptions.title', 'My Prescriptions')} 
            subtitle={t('patientPrescriptions.subtitle', 'View and manage your medical prescriptions')} 
            icon={<Pill className="w-5 h-5 text-white" />} 
         />

        {/* Welcome Section */}
        <div className={cn('backdrop-blur-sm rounded-2xl border p-6 mb-8', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={cn('text-xl font-semibold mb-2', theme==='dark' ? 'text-white' : 'text-gray-800')}>
                {t('patientPrescriptions.greeting.title','Welcome back, {{name}}! 👋',{name:user?.name})}
              </h2>
              <p className="text-gray-400">
                {t('patientPrescriptions.greeting.desc','Here are all your medical prescriptions and medication history.')}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B5CF6]">{getStatusCount('pending')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientPrescriptions.stats.active','Active')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#06B6D4]">{getStatusCount('dispensed')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientPrescriptions.stats.completed','Completed')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{getStatusCount('cancelled')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>{t('patientPrescriptions.stats.expired','Expired')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Mobile */}
        <div className="grid grid-cols-3 gap-4 mb-8 lg:hidden">
          <div className={cn('backdrop-blur-sm rounded-xl border p-4 text-center', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
            <div className="text-xl font-bold text-[#8B5CF6]">{getStatusCount('pending')}</div>
            <div className={cn('text-xs', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Active</div>
          </div>
          <div className={cn('backdrop-blur-sm rounded-xl border p-4 text-center', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
            <div className="text-xl font-bold text-[#06B6D4]">{getStatusCount('dispensed')}</div>
            <div className={cn('text-xs', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Completed</div>
          </div>
          <div className={cn('backdrop-blur-sm rounded-xl border p-4 text-center', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
            <div className="text-xl font-bold text-red-400">{getStatusCount('cancelled')}</div>
            <div className={cn('text-xs', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Expired</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={cn('backdrop-blur-sm rounded-2xl border p-6 mb-8', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5', theme==='dark' ? 'text-gray-400' : 'text-gray-500')} />
              <input
                type="text"
                placeholder={t('patientPrescriptions.searchPlaceholder','Search prescriptions, doctors, or notes...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent',
                  theme === 'dark'
                    ? 'bg-[#1a0a2e] border border-white/20 text-white placeholder-gray-400 focus:ring-[#8B5CF6]'
                    : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-primary shadow-sm'
                )}
              />
            </div>
            <div className="relative">
              <Filter className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5', theme==='dark' ? 'text-gray-400' : 'text-gray-500')} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "dispensed" | "cancelled")}
                className={cn(
                  'pl-10 pr-8 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent appearance-none cursor-pointer',
                  theme === 'dark'
                    ? 'bg-[#1a0a2e] border border-white/20 text-white focus:ring-[#8B5CF6]'
                    : 'bg-white border border-gray-300 text-gray-800 focus:ring-primary shadow-sm'
                )}
                style={{
                  colorScheme: theme === 'dark' ? 'dark' : 'light'
                }}
              >
                <option value="all" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientPrescriptions.filter.all','All Status')}</option>
                <option value="pending" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientPrescriptions.filter.active','Active')}</option>
                <option value="dispensed" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientPrescriptions.filter.completed','Completed')}</option>
                <option value="cancelled" style={{ backgroundColor: '#1a0a2e', color: 'white' }}>{t('patientPrescriptions.filter.expired','Expired')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={cn('backdrop-blur-sm rounded-2xl border p-12 text-center', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#8B5CF6]" />
            <h3 className={cn('text-lg font-medium', theme==='dark' ? 'text-white' : 'text-gray-800')}>{t('patientPrescriptions.loading','Loading prescriptions...')}</h3>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={cn('backdrop-blur-sm rounded-2xl border p-12 text-center', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-red-500" />
            </div>
            <h3 className={cn('text-lg font-medium mb-2', theme==='dark' ? 'text-white' : 'text-gray-800')}>{t('patientPrescriptions.error.title','Error Loading Prescriptions')}</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            >
              {t('patientPrescriptions.error.retry','Try Again')}
            </button>
          </div>
        )}

        {/* Prescriptions Table */}
        {!loading && !error && (
          <div className={cn('backdrop-blur-sm rounded-2xl border overflow-hidden', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-md')}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={cn(theme === 'dark' ? 'bg-white/5 border-b border-white/10' : 'bg-muted border-b', '')}>
                  <tr>
                    <th className={cn('text-left p-4 font-medium', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>#</th>
                    <th className={cn('text-left p-4 font-medium', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientPrescriptions.table.doctor','Doctor')}</th>
                    <th className={cn('text-left p-4 font-medium', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientPrescriptions.table.date','Date')}</th>
                    <th className={cn('text-left p-4 font-medium', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientPrescriptions.table.amount','Amount')}</th>
                    <th className={cn('text-left p-4 font-medium', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientPrescriptions.table.status','Status')}</th>
                    <th className={cn('text-left p-4 font-medium', theme==='dark' ? 'text-gray-300' : 'text-gray-600')}>{t('patientPrescriptions.table.actions','Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className={cn('border-b transition-colors', theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-border hover:bg-muted/50')}>
                      <td className="p-4">
                        <span className="text-[#8B5CF6] font-medium">{prescription.prescriptionNumber}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className={cn('w-4 h-4', theme==='dark' ? 'text-gray-400' : 'text-gray-500')} />
                          <span className={cn(theme==='dark' ? 'text-gray-300' : 'text-gray-700')}>{prescription.doctorName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={cn('w-4 h-4', theme==='dark' ? 'text-gray-400' : 'text-gray-500')} />
                          <span className={cn(theme==='dark' ? 'text-gray-300' : 'text-gray-700')}>{prescription.prescribedDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn('font-medium', theme==='dark' ? 'text-white' : 'text-gray-800')}>
                          {prescription.totalAmount ? `$${prescription.totalAmount.toFixed(2)}` : 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status, theme)}`}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewPrescription(prescription)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white" 
                            aria-label={t('patientPrescriptions.table.view','View')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadPrescription(prescription)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white" 
                            aria-label={t('patientPrescriptions.table.download','Download')}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <div className="text-sm text-gray-400">
                  {t('patientPrescriptions.pagination.showing','Showing {{from}} to {{to}} of {{total}} prescriptions',{
                    from:startIndex+1,
                    to:Math.min(startIndex+itemsPerPage,filteredPrescriptions.length),
                    total:filteredPrescriptions.length})}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-[#8B5CF6] text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* No prescriptions message */}
            {filteredPrescriptions.length === 0 && (
              <div className="p-12 text-center">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className={cn('text-xl font-semibold mb-2', theme==='dark' ? 'text-white' : 'text-gray-800')}>{t('patientPrescriptions.empty.noPrescriptions','No prescriptions found')}</h3>
                <p className="text-gray-400">
                  {searchTerm || statusFilter !== "all" 
                    ? t('patientPrescriptions.empty.searchAdjust','Try adjusting your search or filter criteria')
                    : t('patientPrescriptions.empty.noPrescriptionsYet','You don\'t have any prescriptions yet')
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Prescription View Modal */}
      {isViewModalOpen && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={cn(
            "rounded-xl w-full max-w-2xl p-6 m-4 shadow-lg transition-shadow max-h-[90vh] overflow-y-auto",
            theme === "dark"
              ? "bg-gradient-to-br from-[#0a004a] via-[#05002E] to-[#03001c] border border-[#5D0A72]/30 text-white shadow-blue-900/30"
              : "bg-white border border-gray-200 text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          )}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-2xl font-semibold", theme === "dark" ? "text-white" : "text-gray-800")}>
                Prescription Details
              </h2>
              <button
                onClick={closeViewModal}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark" 
                    ? "text-gray-400 hover:text-white hover:bg-white/10" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={cn("text-lg font-medium mb-3", theme === "dark" ? "text-gray-200" : "text-gray-700")}>
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Prescription Number
                    </label>
                    <p className={cn("text-lg font-mono", theme === "dark" ? "text-white" : "text-gray-800")}>
                      {selectedPrescription.prescriptionNumber}
                    </p>
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Patient Name
                    </label>
                    <p className={cn(theme === "dark" ? "text-white" : "text-gray-800")}>
                      {selectedPrescription.patientName}
                    </p>
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Doctor
                    </label>
                    <p className={cn(theme === "dark" ? "text-white" : "text-gray-800")}>
                      {selectedPrescription.doctorName}
                    </p>
                  </div>
                  <div>
                    <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Status
                    </label>
                    <p>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPrescription.status, theme)}`}>
                        {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={cn("text-lg font-medium mb-3", theme === "dark" ? "text-gray-200" : "text-gray-700")}>
                  Dates & Amount
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Date Prescribed
                    </label>
                    <p className={cn(theme === "dark" ? "text-white" : "text-gray-800")}>
                      {new Date(selectedPrescription.prescribedDate).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedPrescription.dispensedDate && (
                    <div>
                      <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        Date Dispensed
                      </label>
                      <p className={cn(theme === "dark" ? "text-white" : "text-gray-800")}>
                        {new Date(selectedPrescription.dispensedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedPrescription.totalAmount && (
                    <div>
                      <label className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        Total Amount
                      </label>
                      <p className={cn("text-xl font-semibold", theme === "dark" ? "text-green-400" : "text-green-600")}>
                        ${selectedPrescription.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedPrescription.notes && (
              <div className="mt-6">
                <h3 className={cn("text-lg font-medium mb-3", theme === "dark" ? "text-gray-200" : "text-gray-700")}>
                  Notes
                </h3>
                <div className={cn(
                  "p-4 rounded-lg",
                  theme === "dark" ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                )}>
                  <p className={cn(theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                    {selectedPrescription.notes}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => handleDownloadPrescription(selectedPrescription)}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
                  theme === "dark"
                    ? "bg-[#5D0A72] hover:bg-[#5D0A72]/80 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                )}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={closeViewModal}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors border",
                  theme === "dark"
                    ? "text-gray-400 hover:bg-white/10 border-white/20"
                    : "text-gray-600 border-gray-300 hover:bg-gray-50"
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
