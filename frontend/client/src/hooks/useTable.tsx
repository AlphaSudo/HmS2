import { useState, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

interface UseTableProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  initialItems: T[];
  sortColumn: string | null;
  setSortColumn: (column: string | null) => void;
  sortOrder: "asc" | "desc" | null;
  setSortOrder: (order: "asc" | "desc" | null) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  getExportData: (item: T) => Record<string, any>;
  exportFileName: string;
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
  setSelectAll: Dispatch<SetStateAction<boolean>>
  entityName: string;
}

export const useTable = <T extends { id: number }>({
  items,
  setItems,
  initialItems,
  sortColumn,
  setSortColumn,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  getExportData,
  exportFileName,
  setSelectedItems,
  setSelectAll,
  entityName,
}: UseTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    return items.filter((item: T) =>
      (Object.values(item) as Array<T[keyof T]>).some(
        (value) => 
          typeof value === "string" && 
          value.toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [items, searchTerm]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (!sortOrder || !sortColumn) return a.id - b.id; // Default sort by id if no column/order specified

      const multiplier = sortOrder === "asc" ? 1 : -1;
      // Use keyof T for type safety, assuming sortColumn is a valid key
      const key = sortColumn as keyof T; 
      const valueA = a[key];
      const valueB = b[key];

      // Type checking for sorting logic
      if (typeof valueA === "number" && typeof valueB === "number") {
        return multiplier * (valueA - valueB);
      } else if (valueA instanceof Date && valueB instanceof Date) { // Handle Date objects directly
        return multiplier * (valueA.getTime() - valueB.getTime());
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
         // Specific handling for time strings if needed, otherwise localeCompare
         if (sortColumn === "time" && /\\d{1,2}:\\d{2}/.test(valueA) && /\\d{1,2}:\\d{2}/.test(valueB)) {
           const [hoursA, minutesA] = valueA.split(":").map(Number);
           const [hoursB, minutesB] = valueB.split(":").map(Number);
           return multiplier * (hoursA * 60 + minutesA - (hoursB * 60 + minutesB));
         }
         // Specific handling for date strings if they are not Date objects
         if (sortColumn === "date" || sortColumn.toLowerCase().includes("date")) {
            const dateA = new Date(valueA).getTime();
            const dateB = new Date(valueB).getTime();
            if (!isNaN(dateA) && !isNaN(dateB)) { // Check if dates are valid
              return multiplier * (dateA - dateB);
            }
         }
         // Default string comparison
         return multiplier * valueA.localeCompare(valueB);
      } else {
        // Fallback for other types or mixed types - convert to string
        return multiplier * String(valueA).localeCompare(String(valueB));
      }
    });
  }, [filteredItems, sortColumn, sortOrder]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(start, start + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  const handleSortClick = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        if (sortOrder === "asc") {
          setSortOrder("desc");
        } else if (sortOrder === "desc") {
          setSortOrder(null);
          setSortColumn(null);
        } else {
          setSortOrder("asc");
          setSortColumn(column);
        }
      } else {
        setSortColumn(column);
        setSortOrder("asc");
      }
    },
    [sortColumn, sortOrder, setSortColumn, setSortOrder]
  );

  const handleRefreshTable = useCallback(() => {
    setItems(initialItems);
    setCurrentPage(1);
    setSortColumn(null);
    setSortOrder(null);
    setSearchTerm("");
    setItemsPerPage(5);
    setSelectedItems([]);
    setSelectAll(false);
    toast({
      title: t("toast.refreshTitle"),
      description: t("toast.refreshDescription", { entity: entityName }),
      className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
    });
  }, [initialItems, setItems, setCurrentPage, setSortColumn, setSortOrder, toast, t, entityName]);

  const handleXlsxDownload = useCallback(() => {
    try {
      const exportData = sortedItems.map(getExportData);
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, exportFileName);

      toast({
        title: t("toast.exportSuccessTitle"),
        description: t("toast.exportSuccessDescription"),
        className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
      });
    } catch (error) {
      toast({
        title: t("toast.exportFailTitle"),
        description: t("toast.exportFailDescription"),
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  }, [sortedItems, getExportData, exportFileName, toast, t]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    sortedItems,
    currentItems,
    totalPages,
    handleSortClick,
    handleRefreshTable,
    handleXlsxDownload,
    setSelectedItems,
    setSelectAll,
  };
};