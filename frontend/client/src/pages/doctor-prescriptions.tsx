import React, { useState, useEffect } from 'react';
import { DoctorSidebar } from "@/components/ui/DoctorSidebar";
import { DoctorHeader } from "@/components/ui/DoctorHeader";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  getPrescriptionsByDoctor, 
  createPrescription, 
  updatePrescription, 
  Prescription, 
  CreatePrescriptionRequest 
} from '@/services/prescriptionService';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye,
  Calendar,
  User,
  FileText,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionFormData {
  patientId: string;
  patientName: string;
  prescribedDate: string;
  notes: string;
  status: string;
  totalAmount: string;
  dispensedDate?: string;
}

export default function DoctorPrescriptionsPage() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "dispensed" | "cancelled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: '',
    patientName: '',
    prescribedDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'pending',
    totalAmount: '',
  });

  // Fetch prescriptions when component mounts
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getPrescriptionsByDoctor(Number(user.id));
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
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.notes && prescription.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || prescription.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string, theme: 'dark' | 'light') => {
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

  const getStatusCount = (status: "pending" | "dispensed" | "cancelled" | "partially_dispensed") => {
    return prescriptions.filter(p => p.status.toLowerCase() === status).length;
  };

  const handleCreatePrescription = async () => {
    if (!user?.id) return;
    
    try {
      const prescriptionData: CreatePrescriptionRequest = {
        patientId: Number(formData.patientId),
        patientName: formData.patientName,
        doctorId: Number(user.id),
        doctorName: user.name || 'Doctor',
        prescribedDate: formData.prescribedDate,
        notes: formData.notes,
        status: formData.status,
        totalAmount: formData.totalAmount ? Number(formData.totalAmount) : undefined,
        dispensedDate: formData.dispensedDate,
      };

      const response = await createPrescription(prescriptionData);
      setPrescriptions(prev => [response.data, ...prev]);
      setIsCreateModalOpen(false);
      resetFormData();
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
    } catch (err) {
      console.error('Error creating prescription:', err);
      toast({
        title: "Error",
        description: "Failed to create prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPrescription = async () => {
    if (!selectedPrescription || !user?.id) return;
    
    try {
      const prescriptionData: CreatePrescriptionRequest = {
        patientId: Number(formData.patientId),
        patientName: formData.patientName,
        doctorId: Number(user.id),
        doctorName: user.name || 'Doctor',
        prescribedDate: formData.prescribedDate,
        notes: formData.notes,
        status: formData.status,
        totalAmount: formData.totalAmount ? Number(formData.totalAmount) : undefined,
        dispensedDate: formData.dispensedDate,
      };

      const response = await updatePrescription(selectedPrescription.id, prescriptionData);
      setPrescriptions(prev => 
        prev.map(p => p.id === selectedPrescription.id ? response.data : p)
      );
      setIsEditModalOpen(false);
      setSelectedPrescription(null);
      resetFormData();
      toast({
        title: "Success",
        description: "Prescription updated successfully",
      });
    } catch (err) {
      console.error('Error updating prescription:', err);
      toast({
        title: "Error",
        description: "Failed to update prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCreateModal = () => {
    resetFormData();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setFormData({
      patientId: prescription.patientId.toString(),
      patientName: prescription.patientName,
      prescribedDate: prescription.prescribedDate,
      notes: prescription.notes || '',
      status: prescription.status,
      totalAmount: prescription.totalAmount?.toString() || '',
      dispensedDate: prescription.dispensedDate,
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      patientId: '',
      patientName: '',
      prescribedDate: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'pending',
      totalAmount: '',
    });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedPrescription(null);
    resetFormData();
  };

  const renderPrescriptionForm = (isEdit: boolean = false) => {
    const inputClasses = cn(
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
      theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Patient ID</label>
            <input
              type="number"
              value={formData.patientId}
              onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              placeholder="Enter patient ID"
              disabled={isEdit}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Patient Name</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              placeholder="Enter patient name"
              className={inputClasses}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prescribed Date</label>
            <input
              type="date"
              value={formData.prescribedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, prescribedDate: e.target.value }))}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className={inputClasses}
            >
              <option value="pending">Pending</option>
              <option value="dispensed">Dispensed</option>
              <option value="cancelled">Cancelled</option>
              <option value="partially_dispensed">Partially Dispensed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Total Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
              placeholder="0.00"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dispensed Date (Optional)</label>
            <input
              type="date"
              value={formData.dispensedDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dispensedDate: e.target.value }))}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Add any additional notes about the prescription..."
            rows={4}
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none",
              theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            )}
          />
        </div>
      </div>
    );
  };

  const renderModal = (isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, actions?: React.ReactNode) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border",
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6">
            {children}
          </div>
          {actions && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
        <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
          <DoctorHeader 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Prescriptions" 
            subtitle="Manage patient prescriptions" 
            icon={<Pill className="w-5 h-5 text-white" />} 
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading prescriptions...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
      <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')} p-8`}>
        <DoctorHeader 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Prescriptions" 
          subtitle="Manage patient prescriptions" 
          icon={<Pill className="w-5 h-5 text-white" />} 
        />

        {/* Welcome Section */}
        <div className={cn('backdrop-blur-sm rounded-2xl border p-6 mb-8', theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm')}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={cn('text-xl font-semibold mb-2', theme==='dark' ? 'text-white' : 'text-gray-800')}>
                Prescription Management 📋
              </h2>
              <p className="text-gray-400">
                Create, view and manage prescriptions for your patients.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B5CF6]">{getStatusCount('pending')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#06B6D4]">{getStatusCount('dispensed')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Dispensed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{getStatusCount('cancelled')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Cancelled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{getStatusCount('partially_dispensed')}</div>
                <div className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-600')}>Partially Dispensed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
                  theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={cn(
                  "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
                  theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                )}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="dispensed">Dispensed</option>
                <option value="cancelled">Cancelled</option>
                <option value="partially_dispensed">Partially Dispensed</option>
              </select>
            </div>
          </div>
          <Button onClick={openCreateModal} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>

        {/* Prescriptions Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' ? 'No prescriptions match your search criteria.' : 'No prescriptions created yet.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={openCreateModal} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Prescription
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPrescriptions.map((prescription) => (
                <Card key={prescription.id} className={cn(
                  'transition-all duration-200 hover:shadow-lg',
                  theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{prescription.prescriptionNumber}</CardTitle>
                      <span className={cn("px-2 py-1 text-xs font-medium rounded-full border", getStatusColor(prescription.status, theme))}>
                        {prescription.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{prescription.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                    </div>
                    {prescription.totalAmount && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">$</span>
                        <span className="font-medium">{prescription.totalAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {prescription.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 line-clamp-2 text-xs">
                          {prescription.notes}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openViewModal(prescription)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditModal(prescription)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Modal */}
      {renderModal(
        isCreateModalOpen,
        closeModals,
        "Create New Prescription",
        renderPrescriptionForm(),
        <>
          <Button variant="outline" onClick={closeModals}>
            Cancel
          </Button>
          <Button onClick={handleCreatePrescription} className="bg-teal-600 hover:bg-teal-700">
            Create Prescription
          </Button>
        </>
      )}

      {/* Edit Modal */}
      {renderModal(
        isEditModalOpen,
        closeModals,
        "Edit Prescription",
        renderPrescriptionForm(true),
        <>
          <Button variant="outline" onClick={closeModals}>
            Cancel
          </Button>
          <Button onClick={handleEditPrescription} className="bg-teal-600 hover:bg-teal-700">
            Update Prescription
          </Button>
        </>
      )}

      {/* View Modal */}
      {renderModal(
        isViewModalOpen,
        closeModals,
        "Prescription Details",
        selectedPrescription && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Prescription Number</label>
                <p className="text-lg font-semibold">{selectedPrescription.prescriptionNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={cn("inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1", getStatusColor(selectedPrescription.status, theme))}>
                  {selectedPrescription.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Patient</label>
                <p>{selectedPrescription.patientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Doctor</label>
                <p>{selectedPrescription.doctorName}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Prescribed Date</label>
                <p>{new Date(selectedPrescription.prescribedDate).toLocaleDateString()}</p>
              </div>
              {selectedPrescription.dispensedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dispensed Date</label>
                  <p>{new Date(selectedPrescription.dispensedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            {selectedPrescription.totalAmount && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-lg font-semibold">${selectedPrescription.totalAmount.toFixed(2)}</p>
              </div>
            )}
            {selectedPrescription.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Notes</label>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  {selectedPrescription.notes}
                </p>
              </div>
            )}
          </div>
        ),
        <Button variant="outline" onClick={closeModals}>
          Close
        </Button>
      )}
    </div>
  );
} 