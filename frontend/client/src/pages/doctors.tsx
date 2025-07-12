import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Doctor, 
  ColumnToggle, 
  Specialization, 
  Gender, 
  DoctorStatus,
  getSpecializationDisplay,
  getGenderDisplay,
  getStatusDisplay,
} from "@/components/types/doctor";
import GenericTableCard from "@/components/ui/GenericTableCard";
import {
  GenericFormModal,
  FieldConfig,
} from "@/components/ui/GenericFormModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { initialDoctors } from "@/assets/data/initialDoctors";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import DoctorWhiteCoatIcon from "@/assets/icons/DoctorWhiteCoatIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import DoctorService, { CreateDoctorRequest } from "@/services/doctorService";

// The UI data structure will now be aligned with the backend's Doctor entity for consistency.
interface DoctorUI extends Doctor {
  originalDoctor?: Doctor;
}

// Helper functions to map between API Doctor and UI Doctor
const mapDoctorToUI = (doctor: Doctor): DoctorUI => ({
  ...doctor,
  originalDoctor: doctor,
});

const mapUIToCreateRequest = (doctorUI: Partial<DoctorUI>): CreateDoctorRequest => {
  return {
    firstName: doctorUI.firstName || '',
    lastName: doctorUI.lastName || '',
    email: doctorUI.email || '',
    mobile: doctorUI.mobile || '',
    licenseNumber: doctorUI.licenseNumber || '',
    specialization: (doctorUI.specialization || Specialization.GENERAL_PRACTICE) as Specialization,
    experienceYears: doctorUI.experienceYears || 0,
    qualification: doctorUI.qualification || '',
    dateOfBirth: doctorUI.dateOfBirth || '1970-01-01',
    gender: (doctorUI.gender || Gender.MALE) as Gender,
    hireDate: doctorUI.hireDate || new Date().toISOString().split('T')[0], // Use today's date, not future date
    status: (doctorUI.status || DoctorStatus.ACTIVE) as DoctorStatus,
    consultationFee: doctorUI.consultationFee || 0,
    bio: doctorUI.bio || '',
  };
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DoctorUI>>({});
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
  
  // Data Source Tracking (like other pages)
  const [dataSource, setDataSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [apiError, setApiError] = useState<string | null>(null);

  // Single declaration of columns using useState
  const buildColumns = () : ColumnToggle[] => ([
    { id: "checkbox", label: "Select", visible: true },
    { id: "name", label: t('doctors.columns.name'), visible: true },
    { id: "specialization", label: t('doctors.columns.specialization'), visible: true },
    { id: "status", label: t('doctors.columns.availability'), visible: true },
    { id: "mobile", label: t('doctors.columns.mobile'), visible: true },
    { id: "qualification", label: t('doctors.columns.degree'), visible: true },
    { id: "experienceYears", label: t('doctors.columns.experience'), visible: true },
    { id: "consultationFee", label: t('doctors.columns.consultationFee'), visible: true },
    { id: "email", label: t('doctors.columns.email'), visible: true },
    { id: "actions", label: t('doctors.columns.actions'), visible: true },
  ]);

  const [columns, setColumns] = useState<ColumnToggle[]>(buildColumns());

  // Update column labels when language changes
  useEffect(() => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        label: col.id === 'checkbox' ? col.label : t(`doctors.columns.${col.id}`)
      }))
    );
  }, [t]);

  const columnConfig = useMemo(() => ([
    {
      id: "name",
      key: "name",
      label: t('doctors.columnConfig.name'),
      render: (item: DoctorUI) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium ${theme === 'dark' ? 'bg-[#0C4A6E]' : 'bg-primary/20 text-primary'}`}>
            {(item.firstName || '').charAt(0)}
          </div>
          <TruncatedWithTooltip text={`${item.firstName} ${item.lastName}`} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "specialization",
      key: "specialization",
      label: t('doctors.columnConfig.specialization'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip
          text={getSpecializationDisplay(item.specialization)}
          maxWidth="max-w-[120px]"
        />
      ),
    },
    {
      id: "status",
      key: "status",
      label: t('doctors.columnConfig.availability'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={getStatusDisplay(item.status)} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "mobile",
      key: "mobile",
      label: t('doctors.columnConfig.mobile'),
      sortable: false,
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.mobile} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "qualification",
      key: "qualification",
      label: t('doctors.columnConfig.degree'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.qualification} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "experienceYears",
      key: "experienceYears",
      label: t('doctors.columnConfig.experience'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip
          text={String(item.experienceYears)}
          maxWidth="max-w-[120px]"
        />
      ),
    },
    {
      id: "consultationFee",
      key: "consultationFee",
      label: t('doctors.columnConfig.consultationFee'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip
          text={String(item.consultationFee)}
          maxWidth="max-w-[120px]"
        />
      ),
    },
    {
      id: "email",
      key: "email",
      label: t('doctors.columnConfig.email'),
      sortable: false,
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.email} maxWidth="max-w-[150px]" />
      ),
    },
  ]), [t, theme]);

  const formFields: FieldConfig[] = useMemo(() => ([
    { id: "firstName", label: t('doctors.formFields.firstName', 'First Name'), type: "text", required: true },
    { id: "lastName", label: t('doctors.formFields.lastName', 'Last Name'), type: "text", required: true },
    { id: "email", label: t('doctors.formFields.email'), type: "email", required: true },
    { id: "mobile", label: t('doctors.formFields.mobile'), type: "text", required: true },
    { id: "licenseNumber", label: t('doctors.formFields.licenseNumber', 'License Number'), type: "text", required: true },
    { 
      id: "specialization", 
      label: t('doctors.formFields.specialization'), 
      type: "select", 
      required: true,
      options: Object.values(Specialization).map(s => ({ value: s, label: getSpecializationDisplay(s) }))
    },
    { id: "experienceYears", label: t('doctors.formFields.experienceYears'), type: "number", required: true },
    { id: "qualification", label: t('doctors.formFields.qualification'), type: "text", required: true },
    { id: "dateOfBirth", label: t('doctors.formFields.dateOfBirth'), type: "date", required: true, max: new Date().toISOString().split('T')[0] },
    { 
      id: "gender", 
      label: t('doctors.formFields.gender'), 
      type: "select", 
      required: true,
      options: Object.values(Gender).map(g => ({ value: g, label: getGenderDisplay(g) }))
    },
    { id: "hireDate", label: t('doctors.formFields.hireDate'), type: "date", required: true, max: new Date().toISOString().split('T')[0] },
    { 
      id: "status", 
      label: t('doctors.formFields.status'), 
      type: "select", 
      required: true,
      options: Object.values(DoctorStatus).map(s => ({ value: s, label: getStatusDisplay(s) }))
    },
    { id: "consultationFee", label: t('doctors.formFields.consultationFee'), type: "number", required: true },
    { id: "bio", label: t('doctors.formFields.bio', 'Bio'), type: "textarea", required: false, maxWidth: "col-span-2" },
  ]), [t]);

  // Data fetching function - prioritize API data over sample data (like other pages)
  const fetchDoctors = useCallback(async (showToast = true) => {
    setIsLoading(true);
    setDataSource('loading');
    setApiError(null);
    
    try {
      const apiDoctors = await DoctorService.getAllDoctors();
      
      // Prioritize API data - only use fallback if API returns empty
      if (apiDoctors && apiDoctors.length > 0) {
        const uiDoctors = apiDoctors.map(mapDoctorToUI);
        setDoctors(uiDoctors);
        setDataSource('api');
        console.log(`✅ Loaded ${uiDoctors.length} doctors from API`);
        
        if (showToast) {
          toast({
            title: "Data Loaded",
            description: `Successfully loaded ${uiDoctors.length} doctors from server.`,
            className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
          });
        }
      } else {
        // Use sample data as fallback only if API returns empty
        const mockData: DoctorUI[] = initialDoctors.map(mock => {
            const [firstName, ...lastNameParts] = mock.name.split(' ');
            const lastName = lastNameParts.join(' ');
            return {
                id: mock.id,
                firstName,
                lastName,
                email: mock.email,
                mobile: mock.mobile,
                licenseNumber: `LIC-MOCK-${mock.id}`,
                specialization: (mock.specialization.toUpperCase().replace(/ /g, '_') || 'GENERAL_PRACTICE') as Specialization,
                experienceYears: mock.experience,
                qualification: mock.degree,
                dateOfBirth: '1980-01-01',
                gender: Gender.MALE,
                hireDate: new Date().toISOString().split('T')[0],
                status: mock.availability === 'Available' ? DoctorStatus.ACTIVE : DoctorStatus.INACTIVE,
                consultationFee: mock.consultationFee,
                bio: `Mock bio for ${mock.name}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        });
        setDoctors(mockData);
        setDataSource('fallback');
        console.log("⚠️ API returned empty data, using sample doctors as fallback");
        
        if (showToast) {
          toast({
            title: "Using Sample Data",
            description: "API returned no doctors, showing sample data for demonstration.",
            className: `${theme === 'dark' ? "bg-[#FBA427]/20 border border-[#FBA427]/50 text-white" : "bg-amber-50 border border-amber-200 text-amber-800"}`,
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      setApiError(errorMessage);
      console.error("❌ Failed to fetch doctors from API:", error);
      
      // Use sample data as fallback when API fails
      const mockData: DoctorUI[] = initialDoctors.map(mock => {
        const [firstName, ...lastNameParts] = mock.name.split(' ');
        const lastName = lastNameParts.join(' ');
        return {
            id: mock.id,
            firstName,
            lastName,
            email: mock.email,
            mobile: mock.mobile,
            licenseNumber: `LIC-MOCK-${mock.id}`,
            specialization: (mock.specialization.toUpperCase().replace(/ /g, '_') || 'GENERAL_PRACTICE') as Specialization,
            experienceYears: mock.experience,
            qualification: mock.degree,
            dateOfBirth: '1980-01-01',
            gender: Gender.MALE,
            hireDate: new Date().toISOString().split('T')[0],
            status: mock.availability === 'Available' ? DoctorStatus.ACTIVE : DoctorStatus.INACTIVE,
            consultationFee: mock.consultationFee,
            bio: `Mock bio for ${mock.name}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
      });
      setDoctors(mockData);
      setDataSource('fallback');
      
      if (showToast) {
        toast({
          title: "API Connection Failed",
          description: `Could not connect to doctor service: ${errorMessage}. Showing sample data for demonstration.`,
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, theme, t]);

  // Fetch doctors from backend on mount
  useEffect(() => {
    fetchDoctors(false); // Don't show toast on initial load
  }, [fetchDoctors]);

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

  const handleFormSubmit = async (data: Partial<DoctorUI>) => {
    console.log('🎯 handleFormSubmit called with data:', data);
    console.log('🔍 Current dataSource state:', dataSource);
    try {
      console.log('🔧 Form submission data:', data);
      
      const phoneRegex = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/;
      if (data.mobile && !phoneRegex.test(data.mobile)) {
        toast({
          title: "Invalid Phone Number",
          description: "Phone number must be 10 digits (e.g., 1234567890 or 123-456-7890).",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
        return;
      }

      // Validate dates are not in the future
      const today = new Date().toISOString().split('T')[0];
      console.log('📅 Today\'s date:', today);
      console.log('📅 Date of birth:', data.dateOfBirth);
      console.log('📅 Hire date:', data.hireDate);
      
      if (data.dateOfBirth && data.dateOfBirth > today) {
        console.log('❌ Date of birth is in the future!');
        toast({
          title: "Invalid Date of Birth",
          description: "Date of birth cannot be in the future.",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
        return;
      }

      if (data.hireDate && data.hireDate > today) {
        console.log('❌ Hire date is in the future!');
        toast({
          title: "Invalid Hire Date",
          description: "Hire date cannot be in the future.",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
        return;
      }
      
      console.log('✅ Date validation passed');

      if (isEditMode && data.id) {
        // Update existing doctor
        console.log('📝 Updating doctor with ID:', data.id);
        
        if (dataSource === 'api') {
          // API mode - update via backend and refresh
          console.log('🌐 API mode: Updating via backend');
          const originalDoctor = doctors.find(d => d.id === data.id)?.originalDoctor;
          
          if (originalDoctor) {
            const updateData: Doctor = { ...originalDoctor, ...data };
            
            console.log('📤 Sending update data:', updateData);
            await DoctorService.updateDoctor(data.id, updateData);
            console.log('✅ Doctor updated successfully');
            
            // Refresh from API to stay in sync
            await fetchDoctors(false);
            
            toast({
              title: "Doctor Updated",
              description: `Doctor ${data.firstName} ${data.lastName} has been updated successfully.`,
              className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
            });
          }
        } else {
          // Fallback mode - update locally (when using mock data)
          console.log('💾 Fallback mode: Updating locally');
          const existingDoctor = doctors.find(d => d.id === data.id);
          
          if (existingDoctor) {
            const updatedDoctor = { ...existingDoctor, ...data } as DoctorUI;
            
            setDoctors(doctors.map(doctor => 
              doctor.id === data.id ? updatedDoctor : doctor
            ));
            
            toast({
              title: "Doctor Updated",
              description: `Doctor ${data.firstName} ${data.lastName} has been updated successfully (offline mode).`,
              className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
            });
          } else {
            console.error('❌ Doctor not found for update:', data.id);
            toast({
              title: "Error",
              description: "Doctor not found for update.",
              variant: "destructive",
              className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
            });
          }
        }
      } else {
        // Create new doctor
        console.log('➕ Creating new doctor');
        console.log('🔍 Current dataSource:', dataSource);
        const createData = mapUIToCreateRequest(data);
        console.log('📋 Mapped create data:', createData);
        
        if (dataSource === 'api') {
          // API mode - create via backend and refresh
          console.log('🌐 API mode: Creating via backend');
          console.log('📤 Sending create data:', JSON.stringify(createData, null, 2));
          
          try {
            await DoctorService.createDoctor(createData);
            console.log('✅ Doctor created successfully');
            
            // Refresh from API to stay in sync
            console.log('🔄 Refreshing doctors list...');
            await fetchDoctors(false);
            console.log('✅ Doctors list refreshed');
            
            toast({
              title: "Doctor Added",
              description: `Doctor ${createData.firstName} ${createData.lastName} has been added successfully.`,
              className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
            });
          } catch (error) {
            console.error('❌ Error in API create:', error);
            throw error;
          }
        } else {
          // Fallback mode - add locally (when using mock data)
          console.log('💾 Fallback mode: Adding locally');
          const newId = doctors.length > 0 ? Math.max(...doctors.map((d) => d.id)) + 1 : 1;
          const newDoctor: DoctorUI = { ...createData, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          
          setDoctors([...doctors, newDoctor]);
          
          toast({
            title: "Doctor Added",
            description: `Doctor ${createData.firstName} ${createData.lastName} has been added successfully (offline mode).`,
            className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
          });
        }
      }
      console.log('🔚 Closing form...');
      setIsFormOpen(false);
      console.log('✅ Form closed');
    } catch (error: any) {
      console.error('❌ Error saving doctor:', error);
      console.error('❌ Error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message
      });
      
      let errorMessage = "Failed to save doctor";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error Saving Doctor",
        description: errorMessage,
        variant: "destructive",
        className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (doctorToDelete) {
      try {
        // Get the doctor to be deleted
        const doctorToRemove = doctors.find((d) => d.id === doctorToDelete);
        
        if (dataSource === 'api') {
          // API mode - delete via backend and refresh
          console.log('🌐 API mode: Deleting via backend');
          await DoctorService.deleteDoctor(doctorToDelete);
          
          // Refresh from API to stay in sync
          await fetchDoctors(false);
          
          toast({
            title: "Doctor Deleted",
            description: `Doctor ${doctorToRemove?.firstName || "doctor"} has been deleted successfully.`,
            variant: "destructive",
            className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
          });
        } else {
          // Fallback mode - delete locally (when using mock data)
          console.log('💾 Fallback mode: Deleting locally');
          const updatedDoctors = doctors.filter(
            (doctor) => doctor.id !== doctorToDelete,
          );
          setDoctors(updatedDoctors);
          
          toast({
            title: "Doctor Deleted",
            description: `Doctor ${doctorToRemove?.firstName || "doctor"} has been deleted successfully (offline mode).`,
            variant: "destructive",
            className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
          });
        }
      } catch (error: any) {
        console.error('Error deleting doctor:', error);
        toast({
          title: "Error Deleting Doctor",
          description: error?.response?.data?.message || "Failed to delete doctor. Please try again.",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setDoctorToDelete(null);
  };

  const getExportData = (doctor: DoctorUI) => ({
    Name: `${doctor.firstName} ${doctor.lastName}`,
    Specialization: getSpecializationDisplay(doctor.specialization),
    Status: getStatusDisplay(doctor.status),
    Mobile: doctor.mobile,
    Qualification: doctor.qualification,
    "Experience (Years)": doctor.experienceYears,
    "Consultation Fee": doctor.consultationFee,
    Email: doctor.email,
  });

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground'}`}>
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={t('doctors.title')}
          icon={<DoctorWhiteCoatIcon className="h-8 w-8" />}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 px-8 py-8 pt-24">
          {/* Breadcrumbs and Title */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('doctors.viewDoctors')}</h1>
          </div>

          <GenericTableCard
            items={doctors}
            setItems={setDoctors}
            selectedItems={selectedDoctors}
            setSelectedItems={setSelectedDoctors}
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
            onEditClick={(doctor) => {
              setFormData(doctor);
              setIsEditMode(true);
              setIsFormOpen(true);
            }}
            onDeleteClick={(id) => {
              setDoctorToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            initialItems={[]}
            columnConfig={columnConfig}
            getExportData={getExportData}
            exportFileName={t('doctors.exportFileName')}
            entityName={t('doctors.entityName')}
          />
          <GenericFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            title={isEditMode ? t('doctors.formTitle.edit', 'Edit Doctor') : t('doctors.formTitle.add', 'Add New Doctor')}
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