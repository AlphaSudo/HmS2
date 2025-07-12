import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Patient, ColumnToggle, MedicalHistory } from "@/components/types/patient";
import GenericTableCard from "@/components/ui/GenericTableCard";
import {
  GenericFormModal,
  FieldConfig,
} from "@/components/ui/GenericFormModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { initialPatients } from "@/assets/data/initialPatients";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import PatientIcon from "@/assets/icons/PatientIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllPatients, getPatientByUserId, updatePatient, deletePatient, getMedicalHistory, getMedicalHistoryByUserId, createPatient } from "@/services/patientService";
import { Button } from "@/components/ui/button";
import { Download, Eye } from 'lucide-react';

export default function PatientsPage() {
  const [, setLocation] = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useLanguage();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Update column labels when language changes while preserving visibility state
  useEffect(() => {
    setColumns((prev) =>
      prev.map((col) =>
        ["checkbox"].includes(col.id)
          ? col
          : { ...col, label: t(`patients.columns.${col.id}`) || col.label },
      ),
    );
  }, [t]);

  const [columns, setColumns] = useState<ColumnToggle[]>([
    { id: "checkbox", label: "Select", visible: true },
    { id: "name", label: t('patients.columns.name'), visible: true },
    { id: "treatment", label: t('patients.columns.treatment'), visible: true },
    { id: "gender", label: t('patients.columns.gender'), visible: true },
    { id: "mobile", label: t('patients.columns.mobile'), visible: true },
    { id: "admissionDate", label: t('patients.columns.admissionDate'), visible: true },
    { id: "doctorAssigned", label: t('patients.columns.doctorAssigned'), visible: true },
    { id: "address", label: t('patients.columns.address'), visible: false },
    { id: "bloodGroup", label: t('patients.columns.bloodGroup'), visible: false },
    { id: "dischargeDate", label: t('patients.columns.dischargeDate'), visible: false },
    { id: "status", label: t('patients.columns.status'), visible: true },
    { id: "medicalHistory", label: t('patients.columns.medicalHistory'), visible: true },
    { id: "addAppointment", label: t('patients.columns.addAppointment', 'Add Appointment'), visible: true },
    { id: "actions", label: t('patients.columns.actions'), visible: true },
  ]);
  
  const handleReadHistory = (patient: Patient) => {
    try {
      console.log('👁️ Opening patient profile for userId:', patient.userId);
      
      const userId = patient.userId;
      if (!userId) {
        toast({ 
          title: "Error", 
          description: "Patient user ID not available.", 
          variant: "destructive" 
        });
        return;
      }
      
      // Prepare patient data for the profile component
      const patientData = {
        patientId: patient.id, // Use table primary key for API calls
        userId: patient.userId, // Include userId for reference
        patientName: `${patient.firstName} ${patient.lastName}`,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.mobile,
        mobile: patient.mobile,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        maritalStatus: patient.maritalStatus,
        address: patient.address,
        treatment: patient.treatment,
        admissionDate: patient.admissionDate,
        dischargeDate: patient.dischargeDate,
        doctorAssigned: patient.doctorAssigned,
        doctorId: patient.doctorId,
        dateOfBirth: patient.dateOfBirth,
        status: patient.status
      };
      
      console.log('📋 Patient data for profile:', patientData);
      
      // Navigate with patient data as URL parameters
      const encodedData = encodeURIComponent(JSON.stringify(patientData));
      const targetUrl = `/user/${userId}?patientData=${encodedData}`;
      
      setLocation(targetUrl);
      
      // Show navigation feedback
      toast({ 
        title: "📖 Opening Patient Profile", 
        description: `Loading profile for ${patient.firstName} ${patient.lastName}`, 
        className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"}`,
      });
    } catch (error) {
      console.error('❌ Error navigating to patient profile:', error);
      toast({ 
        title: "Navigation Error", 
        description: "Could not navigate to patient profile.", 
        variant: "destructive" 
      });
    }
  };

  const handleDownloadHistory = async (patient: Patient) => {
    try {
      console.log('💾 Downloading medical history for userId:', patient.userId);
      
      const userId = patient.userId;
      if (!userId) {
        toast({ 
          title: "Error", 
          description: "Patient user ID not available for download.", 
          variant: "destructive" 
        });
        return;
      }

      console.log(`📥 Using userId for medical history: ${userId}`);
      console.log(`🔗 API call will be: GET /user/${userId}`);

      // Show loading toast
      toast({ 
        title: "Downloading...", 
        description: "Fetching medical history data...",
        className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"}`,
      });

      // Use the same endpoint pattern as read button
      const response = await getMedicalHistoryByUserId(userId);
      console.log('📋 Medical history response:', response);
      
      const historyData = JSON.stringify(response.data, null, 2);
      const blob = new Blob([historyData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Create a more descriptive filename
      const timestamp = new Date().toISOString().split('T')[0];
      const patientName = `${patient.firstName}-${patient.lastName}`.replace(/\s+/g, '-');
      link.download = `medical-history-${patientName}-${timestamp}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ 
        title: "✅ Download Complete", 
        description: `Medical history for ${patient.firstName} ${patient.lastName} downloaded successfully.`,
        className: `${theme === 'dark' ? "bg-green-900/30 border border-green-700/50 text-green-400" : "bg-green-100 text-green-800 border border-green-200"}`,
      });
    } catch (error: any) {
      console.error("❌ Failed to download medical history:", error);
      console.error("❌ Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error?.response?.data?.message,
        url: error?.config?.url
      });
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      
      // Handle specific error cases
      let userMessage = `Could not download medical history: ${errorMessage}`;
      if (error?.response?.status === 404) {
        userMessage = `❌ Medical history not found for user ID: ${patient.userId}. The patient may not have medical history recorded yet.`;
      } else if (error?.response?.status === 403) {
        userMessage = "❌ You don't have permission to access this patient's medical history.";
      }
      
      toast({ 
        title: "Download Failed", 
        description: userMessage, 
        variant: "destructive" 
      });
    }
  };

  const handleAddAppointment = (patient: Patient) => {
    try {
      // Prepare patient data for appointment form
      const patientData = {
        patientId: patient.userId, // Use userId for appointment
        patientName: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phone: patient.mobile,
        gender: patient.gender.toLowerCase(),
        // Doctor info from patient record
        doctorId: patient.doctorId,
        doctor: patient.doctorAssigned,
        // Default appointment values
        date: new Date().toISOString().split('T')[0], // Today's date
        time: "09:00",
        status: "Scheduled",
        visitType: "New Patient",
        issue: ""
      };
      
      console.log('🚀 Adding appointment for patient:', patientData);
      const encodedData = encodeURIComponent(JSON.stringify(patientData));
      const targetUrl = `/admin/appointments?patientData=${encodedData}`;
      console.log('🔗 Navigating to URL:', targetUrl);
      
      setLocation(targetUrl);
      
      // Show immediate feedback
      toast({ 
        title: "Redirecting...", 
        description: `Opening appointment form for ${patientData.patientName}`, 
        className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"}`,
      });
    } catch (error) {
      console.error('❌ Error navigating to appointments:', error);
      toast({ 
        title: "Navigation Error", 
        description: "Could not navigate to appointment form.", 
        variant: "destructive" 
      });
    }
  };

  const columnConfig = useMemo(() => [
    {
      id: "name",
      key: "name",
      label: t('patients.columnConfig.name'),
      render: (item: Patient) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium ${theme === 'dark' ? 'bg-[#0C4A6E]' : 'bg-primary/20 text-primary'}`}>
            {(item.firstName || "").charAt(0)}
          </div>
          <TruncatedWithTooltip text={`${item.firstName} ${item.lastName}`} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "treatment",
      key: "treatment",
      label: t('patients.columnConfig.treatment'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.treatment} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "gender",
      key: "gender",
      label: t('patients.columnConfig.gender'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.gender} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "mobile",
      key: "mobile",
      label: t('patients.columnConfig.mobile'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.mobile} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "admissionDate",
      key: "admissionDate",
      label: t('patients.columnConfig.admissionDate'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.admissionDate} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "doctorAssigned",
      key: "doctorAssigned",
      label: t('patients.columnConfig.doctorAssigned'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.doctorAssigned} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "address",
      key: "address",
      label: t('patients.columnConfig.address'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.address} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "bloodGroup",
      key: "bloodGroup",
      label: t('patients.columnConfig.bloodGroup'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.bloodGroup} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "dischargeDate",
      key: "dischargeDate",
      label: t('patients.columnConfig.dischargeDate'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.dischargeDate || "N/A"} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "status",
      key: "status",
      label: t('patients.columnConfig.status'),
      render: (item: Patient) => (
        <TruncatedWithTooltip text={item.status} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "medicalHistory",
      key: "medicalHistory",
      label: t('patients.columnConfig.medicalHistory'),
      render: (item: Patient) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleReadHistory(item)}>
            <Eye className="h-4 w-4 mr-1" />
            Read
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownloadHistory(item)}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      ),
    },
    {
      id: "addAppointment",
      key: "addAppointment",
      label: t('patients.columnConfig.addAppointment', 'Add Appointment'),
      render: (item: Patient) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAddAppointment(item)}
          className="text-green-600 hover:text-green-800 border-green-200 hover:border-green-300"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Appointment
        </Button>
      ),
    },

  ], [t, theme, handleAddAppointment]);

  const formFields: FieldConfig[] = useMemo(() => [
    { id: "firstName", label: t('patients.formFields.firstName'), type: "text", required: true },
    { id: "lastName", label: t('patients.formFields.lastName'), type: "text", required: true },
    { id: "email", label: t('patients.formFields.email'), type: "email" },
    { id: "dateOfBirth", label: t('patients.formFields.dateOfBirth'), type: "date" },
    { id: "maritalStatus", label: t('patients.formFields.maritalStatus'), type: "text" },
    { id: "treatment", label: t('patients.formFields.treatment'), type: "text", required: true },
    {
      id: "gender",
      label: t('patients.formFields.gender'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('patients.formFields.selectGender'), disabled: true },
        { value: "Male", label: t('patients.formFields.male') },
        { value: "Female", label: t('patients.formFields.female') },
      ],
    },
    {
      id: "mobile",
      label: t('patients.formFields.mobile'),
      type: "tel",
      required: true,
    },
    { id: "admissionDate", label: t('patients.formFields.admissionDate'), type: "date", required: true,},
    { id: "doctorAssigned", label: t('patients.formFields.doctorAssigned'), type: "text", required: true },
    { id: "address", label: t('patients.formFields.address'), type: "text", required: true },
    {
      id: "bloodGroup",
      label: t('patients.formFields.bloodGroup'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('patients.formFields.selectBloodType'), disabled: true },
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
      ],
    },
    { id: "dischargeDate", label: t('patients.formFields.dischargeDate'), type: "date", required: false },
    {
      id: "status",
      label: t('patients.formFields.status'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('patients.formFields.selectStatus'), disabled: true },
        { value: "Admitted", label: t('patients.formFields.admitted') },
        { value: "Discharged", label: t('patients.formFields.discharged') },
        { value: "Under Observation", label: t('patients.formFields.underObservation') },
      ],
    },
  ], [t]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        // The backend Patient model uses camelCase (e.g., admissionDate)
        // Ensure the frontend Patient type matches this or perform a mapping.
        setPatients(response.data); 
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        toast({
          title: "Error",
          description: "Could not fetch patients.",
          variant: "destructive",
        });
      }
    };

    fetchPatients();
  }, [toast]);

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

  const handleFormSubmit = async (data: Partial<Patient>) => {
    try {
      console.log('handleFormSubmit called with:', { data, isEditMode, formData }); // Debug log

      // Validate phone number
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (data.mobile && !phoneRegex.test(data.mobile)) {
        toast({
          title: t('patients.toast.invalidPhone.title'),
          description: t('patients.toast.invalidPhone.description'),
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
        return;
      }

      // Get the patient ID for updates - use userId since backend now accepts it
      let patientId = null;
      
      if (isEditMode) {
        // Backend now accepts userId for updates
        patientId = formData.userId || data.userId;
        console.log('Edit mode - Using userId for update:', patientId);
      }

      if (isEditMode && patientId) {
        // Update existing patient using userId (backend now accepts this)
        console.log('Updating patient with userId:', patientId, 'Data:', data); // Debug log
        const response = await updatePatient(patientId, data);
        setPatients(patients.map((p) => (
          p.userId === patientId ? response.data : p
        )));
        toast({ 
          title: "Success", 
          description: "Patient updated successfully." 
        });
      } else if (isEditMode && !patientId) {
        // Edit mode but no valid patient userId found
        console.error('Edit mode but no valid patient userId found:', { formData, data });
        toast({ 
          title: "Error", 
          description: "Could not find patient userId for update. Please refresh and try again.", 
          variant: "destructive" 
        });
        return;
      } else {
        // Create new patient (fallback - though we usually use patient-profile page)
        console.log('Creating new patient. IsEditMode:', isEditMode, 'PatientId:', patientId); // Debug log
        
        // For the simple form, we need to add required fields that might be missing
        const createData = {
          ...data,
          // Add default values for required fields if missing
          userId: Math.floor(Math.random() * 90000) + 10000, // Generate userId for admin-created patients
          doctorId: 1, // Default doctor ID - you may need to adjust this
          bloodGroup: data.bloodGroup || 'O+',
          status: data.status || 'Admitted'
        };
        
        const response = await createPatient(createData);
        setPatients([...patients, response.data]);
        toast({ 
          title: "Success", 
          description: "Patient created successfully." 
        });
      }
      
      setIsFormOpen(false);
      setFormData({});
      setIsEditMode(false);
    } catch (error: any) {
      console.error("Failed to save patient:", error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      
      // Handle specific errors
      if (error?.response?.status === 404) {
        toast({ 
          title: "Patient Not Found", 
          description: "The patient record could not be found. It may have been deleted by another user.", 
          variant: "destructive" 
        });
      } else if (errorMessage.includes('Mobile number') && errorMessage.includes('already in use')) {
        toast({ 
          title: "Mobile Number Conflict", 
          description: "This mobile number is already registered. Please use a different number or check if you're updating the correct patient.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: `Failed to save patient: ${errorMessage}`, 
          variant: "destructive" 
        });
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (patientToDelete) {
      try {
        await deletePatient(patientToDelete);
        setPatients(patients.filter((p) => p.userId !== patientToDelete));
        toast({ title: "Success", description: "Patient deleted." });
      } catch (error) {
        console.error("Failed to delete patient:", error);
        toast({ title: "Error", description: "Failed to delete patient.", variant: "destructive" });
      }
    }
    setIsDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const getExportData = (patient: Patient) => ({
    Name: `${patient.firstName} ${patient.lastName}`,
    Treatment: patient.treatment,
    Gender: patient.gender,
    Mobile: patient.mobile,
    AdmissionDate: patient.admissionDate,
    DoctorAssigned: patient.doctorAssigned,
    Address: patient.address,
    BloodGroup: patient.bloodGroup,
    DischargeDate: patient.dischargeDate || "N/A",
    Status: patient.status,
  });

  return (
    <div
      className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground'}`}
    >
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={t('patients.title')}
          icon={<PatientIcon className="h-8 w-8" />}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 px-8 py-8 pt-24">
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('patients.viewPatients')}</h1>
          </div>

          <GenericTableCard
            items={patients.map(p => ({ ...p, id: p.userId }))}
            setItems={(items) => setPatients(items.map(item => ({ ...item, userId: item.id })))}
            selectedItems={selectedPatients}
            setSelectedItems={setSelectedPatients}
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
              // Navigate to patient-profile page for creating new patients
              setLocation('/admin/patient-profile');
            }}
            onEditClick={(patient) => {
              // Convert back to Patient format with userId
              const patientData = { ...patient, userId: patient.id };
              setFormData(patientData);
              setIsEditMode(true);
              setIsFormOpen(true);
            }}
            onDeleteClick={(id) => {
              // Use userId directly for deletion (backend now accepts this)
              setPatientToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            initialItems={initialPatients.map(p => ({ ...p, id: p.userId }))}
            columnConfig={columnConfig}
            getExportData={(item) => getExportData(item as Patient)}
            exportFileName={t('patients.exportFileName')}
            entityName={t('patients.entityName')}
          />
          <GenericFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            title={t('patients.formTitle')}
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