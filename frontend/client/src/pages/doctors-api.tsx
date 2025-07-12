import { useState, useRef, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Doctor, ColumnToggle } from "@/components/types/doctor";
import GenericTableCard from "@/components/ui/GenericTableCard";
import {
  GenericFormModal,
  FieldConfig,
} from "@/components/ui/GenericFormModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { TruncatedWithTooltip } from "@/components/utils/constants";
import DoctorWhiteCoatIcon from "@/assets/icons/DoctorWhiteCoatIcon";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import DoctorService, { CreateDoctorRequest } from "@/services/doctorService";

// Interface for UI compatibility with existing table structure
interface DoctorUI {
  id: number;
  name: string;
  department: string;
  specialization: string;
  availability: string;
  mobile: string;
  degree: string;
  experience: number;
  consultationFee: number;
  email: string;
  originalDoctor?: Doctor; // Keep reference to original for updates
}

// Helper functions to map between API Doctor and UI DoctorUI
const mapDoctorToUI = (doctor: Doctor): DoctorUI => ({
  id: doctor.id,
  name: `${doctor.firstName} ${doctor.lastName}`,
  department: doctor.specialization?.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase()) || 'General Medicine',
  specialization: doctor.specialization?.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase()) || 'General Medicine',
  availability: doctor.status === 'ACTIVE' ? 'Available' : 'Not Available',
  mobile: doctor.mobile || '',
  degree: doctor.qualification || '',
  experience: doctor.experienceYears || 0,
  consultationFee: Number(doctor.consultationFee) || 0,
  email: doctor.email || '',
  originalDoctor: doctor
});

const mapUIToCreateRequest = (doctorUI: Partial<DoctorUI>): CreateDoctorRequest => {
  const [firstName, ...lastNameParts] = (doctorUI.name || 'Unknown Doctor').split(' ');
  const lastName = lastNameParts.join(' ') || 'Unknown';
  
  // Map specialization to valid backend enum values
  const mapSpecialization = (spec: string): string => {
    const specializations: { [key: string]: string } = {
      'GENERAL PRACTICE': 'GENERAL_PRACTICE',
      'CARDIOLOGY': 'CARDIOLOGY',
      'NEUROLOGY': 'NEUROLOGY', 
      'ORTHOPEDICS': 'ORTHOPEDICS',
      'PEDIATRICS': 'PEDIATRICS',
      'DERMATOLOGY': 'DERMATOLOGY',
      'GYNECOLOGY': 'GYNECOLOGY',
      'EMERGENCY MEDICINE': 'EMERGENCY_MEDICINE',
      'RADIOLOGY': 'RADIOLOGY',
      'PSYCHIATRY': 'PSYCHIATRY',
      'SURGERY': 'SURGERY',
      'ONCOLOGY': 'ONCOLOGY',
      'ENDOCRINOLOGY': 'ENDOCRINOLOGY',
      'GASTROENTEROLOGY': 'GASTROENTEROLOGY',
      'PULMONOLOGY': 'PULMONOLOGY'
    };
    
    const normalized = spec.toUpperCase().trim();
    return specializations[normalized] || 'GENERAL_PRACTICE';
  };
  
  const createRequest = {
    firstName: firstName || 'Unknown',
    lastName,
    email: doctorUI.email || '',
    mobile: doctorUI.mobile || '',
    licenseNumber: `LIC-${Date.now()}`, // Generate unique license number
    specialization: mapSpecialization(doctorUI.specialization || 'General Practice'),
    experienceYears: doctorUI.experience || 0,
    qualification: doctorUI.degree || '',
    dateOfBirth: '1980-01-01', // Default date - in real app, this should be a form field
    gender: 'OTHER', // Default - in real app, this should be a form field  
    hireDate: new Date().toISOString().split('T')[0],
    status: doctorUI.availability === 'Available' ? 'ACTIVE' : 'INACTIVE',
    consultationFee: doctorUI.consultationFee || 0,
    bio: ''
  };
  
  console.log('🔄 Mapping UI to Create Request:', { original: doctorUI, mapped: createRequest });
  return createRequest;
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

  // Fetch doctors from API on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const apiDoctors = await DoctorService.getAllDoctors();
        const uiDoctors = apiDoctors.map(mapDoctorToUI);
        setDoctors(uiDoctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        toast({
          title: "API Connection Failed",
          description: "Failed to load doctors. Please check your connection.",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [theme, toast]);

  // Column definitions
  const buildColumns = (): ColumnToggle[] => ([
    { id: "checkbox", label: "Select", visible: true },
    { id: "name", label: t('doctors.columns.name'), visible: true },
    { id: "department", label: t('doctors.columns.department'), visible: true },
    { id: "specialization", label: t('doctors.columns.specialization'), visible: true },
    { id: "availability", label: t('doctors.columns.availability'), visible: true },
    { id: "mobile", label: t('doctors.columns.mobile'), visible: true },
    { id: "degree", label: t('doctors.columns.degree'), visible: true },
    { id: "experience", label: t('doctors.columns.experience'), visible: true },
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
            {item.name.charAt(0)}
          </div>
          <TruncatedWithTooltip text={item.name} maxWidth="max-w-[120px]" />
        </div>
      ),
    },
    {
      id: "department",
      key: "department",
      label: t('doctors.columnConfig.department'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.department} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "specialization",
      key: "specialization",
      label: t('doctors.columnConfig.specialization'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.specialization} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "availability",
      key: "availability",
      label: t('doctors.columnConfig.availability'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.availability} maxWidth="max-w-[120px]" />
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
      id: "degree",
      key: "degree",
      label: t('doctors.columnConfig.degree'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={item.degree} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "experience",
      key: "experience",
      label: t('doctors.columnConfig.experience'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={String(item.experience)} maxWidth="max-w-[120px]" />
      ),
    },
    {
      id: "consultationFee",
      key: "consultationFee",
      label: t('doctors.columnConfig.consultationFee'),
      render: (item: DoctorUI) => (
        <TruncatedWithTooltip text={String(item.consultationFee)} maxWidth="max-w-[120px]" />
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

  const formFields: FieldConfig[] = [
    { id: "name", label: t('doctors.formFields.name'), type: "text", required: true },
    { id: "specialization", label: t('doctors.formFields.specialization'), type: "text", required: true },
    { 
      id: "availability", 
      label: t('doctors.formFields.availability'), 
      type: "select", 
      required: true,
      options: [
        { value: 'Available', label: 'Available' },
        { value: 'Not Available', label: 'Not Available' }
      ] 
    },
    { id: "mobile", label: t('doctors.formFields.mobile'), type: "text", required: true },
    { id: "degree", label: t('doctors.formFields.degree'), type: "text", required: true },
    { id: "experience", label: t('doctors.formFields.experience'), type: "number", required: true },
    { id: "consultationFee", label: t('doctors.formFields.consultationFee'), type: "number", required: true },
    { id: "email", label: t('doctors.formFields.email'), type: "email", required: true, maxWidth: "col-span-2" },
  ];

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
    try {
      console.log('🔧 Form submission data:', data);
      
      // Validate phone number (more flexible validation)
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (data.mobile && !phoneRegex.test(data.mobile)) {
        toast({
          title: "Invalid Phone Number",
          description: "Phone number must be in format: 123-456-7890",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
        return;
      }

      if (isEditMode && data.id) {
        // Update existing doctor
        console.log('📝 Updating doctor with ID:', data.id);
        const originalDoctor = doctors.find(d => d.id === data.id)?.originalDoctor;
        if (originalDoctor) {
          // Map specialization for update
          const mapSpecialization = (spec: string): string => {
            const specializations: { [key: string]: string } = {
              'GENERAL PRACTICE': 'GENERAL_PRACTICE', 'CARDIOLOGY': 'CARDIOLOGY', 'NEUROLOGY': 'NEUROLOGY', 'ORTHOPEDICS': 'ORTHOPEDICS',
              'PEDIATRICS': 'PEDIATRICS', 'DERMATOLOGY': 'DERMATOLOGY', 'GYNECOLOGY': 'GYNECOLOGY', 'EMERGENCY MEDICINE': 'EMERGENCY_MEDICINE',
              'RADIOLOGY': 'RADIOLOGY', 'PSYCHIATRY': 'PSYCHIATRY', 'SURGERY': 'SURGERY', 'ONCOLOGY': 'ONCOLOGY',
              'ENDOCRINOLOGY': 'ENDOCRINOLOGY', 'GASTROENTEROLOGY': 'GASTROENTEROLOGY', 'PULMONOLOGY': 'PULMONOLOGY'
            };
            const normalized = spec.toUpperCase().trim();
            return specializations[normalized] || originalDoctor.specialization;
          };
          
          const [firstName, ...lastNameParts] = (data.name || '').split(' ');
          const lastName = lastNameParts.join(' ');
          
          const updateData = {
            firstName: firstName || originalDoctor.firstName,
            lastName: lastName || originalDoctor.lastName,
            email: data.email || originalDoctor.email,
            mobile: data.mobile || originalDoctor.mobile,
            specialization: (data.specialization ? mapSpecialization(data.specialization) : originalDoctor.specialization) as any,
            status: (data.availability ? (data.availability === 'Available' ? 'ACTIVE' : 'INACTIVE') : originalDoctor.status) as any,
            experienceYears: data.experience ?? originalDoctor.experienceYears,
            qualification: data.degree || originalDoctor.qualification,
            consultationFee: data.consultationFee ?? originalDoctor.consultationFee,
          };
          
          console.log('📤 Sending update data:', updateData);
          const updatedDoctor = await DoctorService.updateDoctor(data.id, updateData);
          console.log('✅ Doctor updated successfully:', updatedDoctor);
          
          const updatedUI = mapDoctorToUI(updatedDoctor);
          
          setDoctors(doctors.map(doctor => 
            doctor.id === data.id ? updatedUI : doctor
          ));
          
          toast({
            title: "Doctor Updated",
            description: `Doctor ${data.name} has been updated successfully.`,
            className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
          });
        }
      } else {
        // Create new doctor
        console.log('➕ Creating new doctor');
        const createData = mapUIToCreateRequest(data);
        console.log('📤 Sending create data:', createData);
        
        const newDoctor = await DoctorService.createDoctor(createData);
        console.log('✅ Doctor created successfully:', newDoctor);
        
        const newUI = mapDoctorToUI(newDoctor);
        setDoctors([...doctors, newUI]);
        
        toast({
          title: "Doctor Added",
          description: `Doctor ${data.name} has been added successfully.`,
          className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-primary-foreground"}`,
        });
      }
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('❌ Error saving doctor:', error);
      console.error('❌ Error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message
      });
      
      let errorMessage = "Failed to save doctor";
      if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Invalid data provided. Check all fields.";
      } else if (error?.response?.status === 500) {
        errorMessage = "A server error occurred. Please try again later.";
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
        await DoctorService.deleteDoctor(doctorToDelete);
        
        const doctorToRemove = doctors.find((d) => d.id === doctorToDelete);
        const updatedDoctors = doctors.filter((doctor) => doctor.id !== doctorToDelete);
        
        setDoctors(updatedDoctors);
        
        // Handle pagination if current page becomes empty
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const updatedCurrentPageItems = updatedDoctors.slice(start, end);
        const isCurrentPageEmpty = updatedCurrentPageItems.length === 0;
        
        if (isCurrentPageEmpty && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        
        toast({
          title: t('doctors.toast.doctorDeleted.title'),
          description: t('doctors.toast.doctorDeleted.description', { name: doctorToRemove?.name || "doctor" }),
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
      } catch (error: any) {
        console.error('Error deleting doctor:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete doctor",
          variant: "destructive",
          className: `${theme === 'dark' ? "bg-[#450A0A] border border-red-700/50 text-white" : "bg-destructive text-destructive-foreground"}`,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setDoctorToDelete(null);
  };

  const getExportData = (doctor: DoctorUI) => ({
    Name: doctor.name,
    Department: doctor.department,
    Specialization: doctor.specialization,
    Availability: doctor.availability,
    Mobile: doctor.mobile,
    Degree: doctor.degree,
    "Experience (Years)": doctor.experience,
    "Consultation Fee": doctor.consultationFee,
    Email: doctor.email,
  });

  if (isLoading) {
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
          <div className="flex-1 px-8 py-8 pt-24 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Loading doctors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            initialItems={[]} // No initial items since we're using API
            columnConfig={columnConfig}
            getExportData={getExportData}
            exportFileName={t('doctors.exportFileName')}
            entityName={t('doctors.entityName')}
          />
          <GenericFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={(data) => {
              console.log('🔗 GenericFormModal onSubmit triggered, calling handleFormSubmit');
              handleFormSubmit(data);
            }}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
            title={t('doctors.formTitle')}
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