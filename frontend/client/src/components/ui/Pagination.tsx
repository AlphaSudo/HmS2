import { Dispatch, SetStateAction } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>;
  totalItems: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
}: PaginationProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  const paginationItems = [];
  for (let i = startPage; i <= endPage; i++) {
    const pageButtonClasses = cn(
      "px-3 py-1 rounded-md",
      currentPage === i
        ? theme === "dark"
          ? "bg-[#3466ad] text-white"
          : "bg-[hsl(var(--primary))] text-white"
        : theme === "dark"
          ? "bg-[#02001E] text-[#94A3B8] hover:bg-[#0A004A]/50"
          : "bg-[hsl(var(--table-header-bg))] text-[hsl(var(--table-text))] hover:bg-[hsl(var(--table-row-even))]"
    );

    paginationItems.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={pageButtonClasses}
        aria-label={`Go to page ${i}`}
      >
        {i}
      </button>,
    );
  }

  const containerClasses = cn(
    "p-4 flex flex-col sm:flex-row justify-between items-center gap-4",
    theme === "dark"
      ? "bg-[#05002E] border-t border-[#5D0A72]/10"
      : "bg-[hsl(var(--table-bg))] border-t border-[hsl(var(--table-border))]"
  );

  const labelTextClasses = cn(
    "text-sm",
    theme === "dark" ? "text-[#94A3B8]" : "text-[hsl(var(--table-text))]"
  );

  const selectClasses = cn(
    "border rounded-md p-1 focus:outline-none focus:ring-1",
    theme === "dark"
      ? "bg-[#03001c] border-[#5D0A72]/10 text-[#94A3B8] focus:ring-[#5D0A72]/50"
      : "bg-[hsl(var(--table-header-bg))] border-[hsl(var(--table-border))] text-[hsl(var(--table-text))] focus:ring-[hsl(var(--primary))]/50"
  );

  const navButtonBase = "px-3 py-1 rounded-md";

  const getNavButtonClass = (disabled: boolean) =>
    cn(
      navButtonBase,
      disabled
        ? theme === "dark"
          ? "bg-[#03001c]/50 text-[#94A3B8]/50 cursor-not-allowed"
          : "bg-[hsl(var(--table-header-bg))]/50 text-[hsl(var(--table-text))]/40 cursor-not-allowed"
        : theme === "dark"
          ? "bg-[#03001c] text-[#94A3B8] hover:bg-[#0A004A]/50"
          : "bg-[hsl(var(--table-header-bg))] text-[hsl(var(--table-text))] hover:bg-[hsl(var(--table-row-even))]"
    );

  return (
    <div className={containerClasses}>
      <div className={cn("flex items-center gap-2", labelTextClasses)}>
        <span>{t('pagination.rowsPerPage')}</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            handlePageChange(1);
          }}
          className={selectClasses}
          aria-label="Select rows per page"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>
          {t('pagination.showingEntries', {
            from: (currentPage - 1) * itemsPerPage + 1,
            to: Math.min(currentPage * itemsPerPage, totalItems),
            total: totalItems,
          })}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={getNavButtonClass(currentPage === 1)}
          aria-label="Previous page"
        >
          {t('common.previous')}
        </button>
        {paginationItems}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={getNavButtonClass(currentPage === totalPages || totalPages === 0)}
          aria-label="Next page"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
};
