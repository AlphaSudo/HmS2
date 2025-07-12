import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export const SearchBar = ({ searchTerm, setSearchTerm, setCurrentPage }: SearchBarProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const iconClasses = cn(
    "h-4 w-4",
    theme === "dark" ? "text-[#94A3B8]/70" : "text-[hsl(var(--table-text))]/60"
  );

  const inputClasses = cn(
    "text-sm py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 w-full",
    theme === "dark"
      ? "bg-[#02001E] text-[#94A3B8] placeholder-[#94A3B8]/50 focus:ring-[#5D0A72]/50 border border-[#5D0A72]/10"
      : "bg-[hsl(var(--table-header-bg))] text-[hsl(var(--table-text))] placeholder-[hsl(var(--table-text))/50] focus:ring-[hsl(var(--primary))]/50 border border-[hsl(var(--table-border))]"
  );

  return (
    <div className="relative w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={iconClasses}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={t('common.search')}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className={inputClasses}
        aria-label="Search appointments"
      />
    </div>
  );
};