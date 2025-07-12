import { useState, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/components/types/appointment";

interface UseAppointmentsTableProps {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  initialAppointments: Appointment[];
  sortColumn: string | null;
  setSortColumn: (column: string | null) => void;
  sortOrder: 'asc' | 'desc' | null;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  setSelectedAppointments: Dispatch<SetStateAction<number[]>>;
  setSelectAll: Dispatch<SetStateAction<boolean>>;
}

export const useAppointmentsTable = ({
  appointments,
  setAppointments,
  initialAppointments,
  sortColumn,
  setSortColumn,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  setSelectedAppointments,
  setSelectAll,
}: UseAppointmentsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return appointments;

    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    return appointments.filter((appointment) =>
      Object.values(appointment).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [appointments, searchTerm]);

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      if (!sortOrder || !sortColumn) return a.id - b.id;

      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortColumn) {
        case 'id':
          return multiplier * (a.id - b.id);
        case 'patientName':
        case 'doctor':
        case 'gender':
        case 'issue':
        case 'status':
        case 'visitType':
          return multiplier * a[sortColumn].localeCompare(b[sortColumn]);
        case 'date':
          return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'time':
          const [hoursA, minutesA] = a.time.split(':').map(Number);
          const [hoursB, minutesB] = b.time.split(':').map(Number);
          return multiplier * (hoursA * 60 + minutesA - (hoursB * 60 + minutesB));
        default:
          return 0;
      }
    });
  }, [filteredAppointments, sortColumn, sortOrder]);

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const currentAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAppointments.slice(start, start + itemsPerPage);
  }, [sortedAppointments, currentPage, itemsPerPage]);

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
    setAppointments(initialAppointments);
    setCurrentPage(1);
    setSortColumn(null);
    setSortOrder(null);
    setSearchTerm('');
    setItemsPerPage(5);
    setSelectedAppointments([]);
    setSelectAll(false);
    toast({
      title: 'Table Refreshed',
      description: 'Appointments data has been refreshed.',
      className: 'bg-[#05002E] border border-[#5D0A72]/20 text-white',
    });
  }, [initialAppointments, setAppointments, setCurrentPage, setSortColumn, setSortOrder, toast]);

  const handleXlsxDownload = useCallback(() => {
    try {
      const exportData = sortedAppointments.map((appointment) => ({
        'Patient Name': appointment.patientName,
        Doctor: appointment.doctor,
        Gender: appointment.gender,
        Date: appointment.date,
        Time: appointment.time,
        Phone: appointment.phone,
        Issue: appointment.issue,
        Email: appointment.email,
        Status: appointment.status,
        'Visit Type': appointment.visitType,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
      XLSX.writeFile(workbook, 'Cliniva_Appointments.xlsx');

      toast({
        title: 'Export Successful',
        description: 'Appointments data has been exported to Excel.',
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
  }, [sortedAppointments, toast]);

  return {
    searchTerm,
    setSearchTerm,
    filteredAppointments,
    sortedAppointments,
    currentAppointments,
    totalPages,
    handleSortClick,
    handleRefreshTable,
    handleXlsxDownload,
  };
};