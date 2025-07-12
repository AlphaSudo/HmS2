import {
  ChevronDown,
  ChevronUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { Button } from "./button";
import { ColumnToggle } from "@/components/types/patient";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface DoctorAppointmentsTableProps<T> {
  data: T[];
  columns: {
    id: string;
    key: keyof T;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onSort: (column: string | null) => void;
  sortColumn: string | null;
  sortOrder: "asc" | "desc" | null;
  onViewPatient: (item: T) => void;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  isLoading?: boolean;
}

const SkeletonRow = ({ columns }: { columns: number }) => (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-3">
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-700/50"></div>
        </td>
      ))}
      <td className="py-4 px-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700/50"></div>
      </td>
    </tr>
  );

export default function DoctorAppointmentsTable<T extends { id: number }>({
  data,
  columns,
  onSort,
  sortColumn,
  sortOrder,
  onViewPatient,
  itemsPerPage,
  currentPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
}: DoctorAppointmentsTableProps<T>) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const tableContainerClasses = cn(
    "w-full h-full rounded-2xl p-6 flex flex-col transition-all duration-300",
    theme === 'dark' 
      ? 'bg-gray-800/60 border border-teal-500/20' 
      : 'bg-white border border-gray-200 shadow-lg shadow-gray-500/10'
  );

  const headerRowClasses = cn(
    theme === 'dark'
      ? 'bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 text-white'
      : 'bg-gradient-to-r from-teal-500 to-green-500 text-white'
  );

  const evenRowClasses = theme === 'dark'
    ? 'bg-gray-800/60'
    : 'bg-white';

  const oddRowClasses = theme === 'dark'
    ? 'bg-gray-800/40'
    : 'bg-gray-50';

  if (isLoading) {
    return (
        <div className={tableContainerClasses}>
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead className={cn(theme === 'dark' ? '[&_tr]:border-teal-500/20' : '[&_tr]:border-gray-200')}>
                    <tr>
                        {columns.map((c) => (<th key={c.id} className="p-4 text-left"><div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700/50"></div></th>))}
                        <th className="p-4 w-12"><div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700/50"></div></th>
                    </tr>
                </thead>
              <tbody>
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} columns={columns.length} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
  }

  if (!isLoading && data.length === 0) {
    return (
        <div className={tableContainerClasses}>
          <div className="flex flex-col items-center justify-center h-full text-center m-auto">
            <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('table.empty.title', 'No Appointments Found')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('table.empty.description', 'There are no appointments to display at this time.')}</p>
          </div>
        </div>
      );
  }

  return (
    <div className={tableContainerClasses}>
      <div className="overflow-x-auto rounded-2xl shadow-inner">
        <table className="w-full rounded-2xl overflow-hidden">
          <thead>
            <tr className={headerRowClasses}>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="py-4 px-3 text-left text-sm font-semibold tracking-wide cursor-pointer select-none"
                  onClick={() => onSort(col.key as string)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortColumn === col.key &&
                      (sortOrder === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
              ))}
              <th className="py-4 px-3 text-left text-sm font-semibold">
                {t('appointments.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  idx % 2 === 0 ? evenRowClasses : oddRowClasses,
                  'border-b',
                  theme === 'dark'
                    ? 'border-teal-500/15 hover:bg-teal-500/5'
                    : 'border-gray-200 hover:bg-teal-50'
                )}
              >
                {columns.map((col) => (
                  <td key={col.id} className="py-3 px-3 text-sm">
                    {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                  </td>
                ))}
                <td className="py-3 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('View Patient button clicked for:', item);
                      onViewPatient(item);
                    }}
                    className="hover:bg-blue-500/10 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-500 font-medium">View Patient</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end mt-auto pt-4">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <span className="text-sm">{t('table.footer.rowsPerPage')}</span>
                  <select
                      value={itemsPerPage}
                      onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                      className={cn("p-2 rounded-md text-sm", theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300')}
                  >
                      {[10, 20, 50].map(size => (
                          <option key={size} value={size}>{size}</option>
                      ))}
                  </select>
              </div>
              <div className="text-sm">
                  {t('table.footer.pageInfo', {
                      page: currentPage,
                      totalPages: totalPages
                  })}
              </div>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                  >
                      <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                  >
                      <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
          </div>
      </div>
    </div>
  );
}
  
