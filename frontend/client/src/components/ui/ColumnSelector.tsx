import { RefObject } from "react";
import { ColumnToggle } from "@/components/types/appointment";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ColumnSelectorProps {
  columns: ColumnToggle[];
  setColumns: (columns: ColumnToggle[]) => void;
  columnSelectorRef: RefObject<HTMLDivElement>;
  showColumnSelector: boolean;
}

export const ColumnSelector = ({ columns, setColumns, columnSelectorRef, showColumnSelector }: ColumnSelectorProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!showColumnSelector) return null;

  const dir = t('dir', { defaultValue: 'ltr' }) as 'ltr' | 'rtl';

  const containerClasses = cn(
    `absolute top-12 ${dir === 'rtl' ? 'left-0' : 'right-0'} z-30 w-64 rounded-lg shadow-lg overflow-hidden max-h-[400px] overflow-y-auto border`,
    theme === 'dark'
      ? 'bg-[#05002E] border-[#5D0A72]/20'
      : 'bg-white border-[hsl(var(--border))]'
  );

  const headerClasses = cn(
    'sticky top-0 p-3 border-b font-medium',
    theme === 'dark'
      ? 'bg-[#03001c] border-[#5D0A72]/20 text-[#94A3B8]'
      : 'bg-[hsl(var(--table-header-bg))] border-[hsl(var(--border))] text-[hsl(var(--table-text))]'
  );

  const rowClasses = cn(
    'flex items-center px-4 py-3 border-b cursor-pointer',
    theme === 'dark'
      ? 'hover:bg-[#02001e]/30 border-[#5D0A72]/10 text-[#94A3B8]'
      : 'hover:bg-[hsl(var(--table-row-even))] border-[hsl(var(--table-border))] text-[hsl(var(--table-text))]'
  );

  const checkboxBase = theme === 'dark'
    ? 'text-[#5D0A72] border-[#5D0A72]/30 focus:ring-[#5D0A72]'
    : 'text-[hsl(var(--primary))] border-[hsl(var(--border))] focus:ring-[hsl(var(--primary))]';

  return (
    <div ref={columnSelectorRef} className={containerClasses} dir={dir}>
      <div className={headerClasses}>
        <h3 className="text-base">{t('columnSelector.title')}</h3>
      </div>
      {columns.map((column) => (
        <div key={column.id} className={rowClasses}>
          <input
            type="checkbox"
            id={`column-${column.id}`}
            checked={column.visible}
            onChange={() =>
              setColumns(
                columns.map((c) =>
                  c.id === column.id ? { ...c, visible: !c.visible } : c
                )
              )
            }
            className={`w-5 h-5 rounded ${checkboxBase}`}
          />
          <label htmlFor={`column-${column.id}`} className="ml-3 text-sm cursor-pointer">
            {column.label}
          </label>
        </div>
      ))}
    </div>
  );
};