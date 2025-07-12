import { useState, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Doctor } from "@/components/types/doctor";

interface UseDoctorsTableProps {
  doctors: Doctor[];
  setDoctors: (doctors: Doctor[]) => void;
  initialDoctors: Doctor[];
  sortColumn: string | null;
  setSortColumn: (column: string | null) => void;
  sortOrder: 'asc' | 'desc' | null;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
}

export const useDoctorsTable = ({
  doctors,
  setDoctors,
  initialDoctors,
  sortColumn,
  setSortColumn,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
}: UseDoctorsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return doctors;

    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    return doctors.filter((doctor) =>
      Object.values(doctor).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [doctors, searchTerm]);

  const sortedDoctors = useMemo(() => {
    return [...filteredDoctors].sort((a, b) => {
      if (!sortOrder || !sortColumn) return a.id - b.id;

      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortColumn) {
        case 'id':
          return multiplier * (a.id - b.id);
        case 'name':
        case 'department':
        case 'specialization':
        case 'availability':
        case 'degree':
        case 'mobile':
        case 'email':
          return multiplier * a[sortColumn].localeCompare(b[sortColumn]);
        case 'experience':
          return multiplier * (a.experience - b.experience);
        case 'consultationFee':
          return multiplier * (a.consultationFee - b.consultationFee);
        default:
          return 0;
      }
    });
  }, [filteredDoctors, sortColumn, sortOrder]);

  const totalPages = Math.ceil(sortedDoctors.length / itemsPerPage);
  const currentDoctors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDoctors.slice(start, start + itemsPerPage);
  }, [sortedDoctors, currentPage, itemsPerPage]);

  const handleSortClick = useCallback((column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null (unsorted)
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortOrder(null);
        setSortColumn(null);
      } else {
        setSortOrder('asc');
        setSortColumn(column);
      }
    } else {
      // New column selected, start with ascending sort
      setSortColumn(column);
      setSortOrder('asc');
    }
  }, [sortColumn, sortOrder, setSortColumn, setSortOrder]);

  const handleRefreshTable = useCallback(() => {
    setDoctors(initialDoctors);
    setCurrentPage(1);
    setSortColumn(null);
    setSortOrder(null);
    setSearchTerm('');
    toast({
      title: 'Table Refreshed',
      description: 'Doctors data has been refreshed.',
      className: 'bg-[#05002E] border border-[#5D0A72]/20 text-white',
    });
  }, [initialDoctors, setDoctors, setCurrentPage, setSortColumn, setSortOrder, toast]);

  const handleXlsxDownload = useCallback(() => {
    try {
      const exportData = sortedDoctors.map((doctor) => ({
        'Name': doctor.name,
        'Department': doctor.department,
        'Specialization': doctor.specialization,
        'Availability': doctor.availability,
        'Mobile': doctor.mobile,
        'Degree': doctor.degree,
        'Experience (Years)': doctor.experience,
        'Consultation Fee': doctor.consultationFee,
        'Email': doctor.email,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Doctors');
      XLSX.writeFile(workbook, 'Cliniva_Doctors.xlsx');

      toast({
        title: 'Export Successful',
        description: 'Doctors data has been exported to Excel.',
        className: 'bg-[#05002E] border border-[#5D0A72]/20 text-white',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data.',
        variant: 'destructive',
      });
      console.error('Export error:', error);
    }
  }, [sortedDoctors, toast]);

  return {
    searchTerm,
    setSearchTerm,
    filteredDoctors,
    sortedDoctors,
    currentDoctors,
    totalPages,
    handleSortClick,
    handleRefreshTable,
    handleXlsxDownload,
  };
};