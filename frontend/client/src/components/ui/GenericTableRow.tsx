import { memo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ColumnToggle } from "@/components/types/common";
import { TruncatedWithTooltip,  AVATAR_BG } from "@/components/utils/constants";

interface ColumnConfig {
  id: string;
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
}

interface GenericTableRowProps<T extends { id: number }> {
  item: T;
  selectedItems: number[];
  handleSelectItem: (id: number) => void;
  onEditClick: (item: T) => void;
  onDeleteClick: (id: number) => void;
  columns: ColumnToggle[];
  columnConfig: ColumnConfig[];
}

export const GenericTableRow = memo(
  <T extends { id: number }>({
    item,
    selectedItems,
    handleSelectItem,
    onEditClick,
    onDeleteClick,
    columns,
    columnConfig,
  }: GenericTableRowProps<T>) => {
    const isSelected = selectedItems.includes(item.id);
    const { theme } = useTheme();

    const rowClasses = cn(
      "transition-colors cursor-pointer",
      theme === "dark"
        ? cn(
            "text-[#94A3B8] hover:bg-[#02001e]/30 even:bg-[#000041]",
            isSelected && "bg-[#5D0A72]/20"
          )
        : cn(
            "text-[hsl(var(--table-text))] hover:bg-[hsl(var(--table-row-even))] even:bg-[hsl(var(--table-bg))]",
            isSelected && "bg-[hsl(var(--primary)/0.15)]"
          )
    );

    const checkboxClasses = cn(
      "rounded h-4 w-4",
      theme === "dark"
        ? "border-[#5D0A72]/30 text-[#5D0A72] focus:ring-[#5D0A72]/30"
        : "border-[hsl(var(--table-border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))/30]"
    );

    const editBtnClasses = cn(
      "transition-colors",
      theme === "dark"
        ? "text-blue-500 hover:text-blue-700"
        : "text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
    );

    const deleteBtnClasses = cn(
      "transition-colors",
      theme === "dark"
        ? "text-red-500 hover:text-red-700"
        : "text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))]"
    );

    const handleRowClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "BUTTON" || target.closest("input, button")) {
        return;
      }
      onEditClick(item);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleSelectItem(item.id);
    };

    return (
      <tr
        className={rowClasses}
        onClick={handleRowClick}
        aria-selected={isSelected}
      >
        {columns.find((c) => c.id === "checkbox")?.visible && (
        <td className="py-4 px-6">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectItem(item.id)}
            onClick={handleCheckboxClick}
            className={checkboxClasses}
            aria-label={`Select item ${item.id}`}
          />
        </td>
        )}
        {columnConfig.map(
          (col) =>
            columns.find((c) => c.id === col.id)?.visible && (
              <td key={col.id} className="py-4 px-6">
                {col.render ? (
                  col.render(item)
                ) : (
                  <TruncatedWithTooltip
                    text={String((item as any)[col.key] || "")}
                    maxWidth={col.id === "email" || col.id === "injury" ? "max-w-[150px]" : "max-w-[120px]"}
                  />
                )}
              </td>
            )
        )}
        {columns.find((c) => c.id === "actions")?.visible && (
        <td className="py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(item); // item is of type T
              }}
              className={editBtnClasses}
              aria-label={`Edit item ${item.id}`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(item.id);
              }}
              className={deleteBtnClasses}
              aria-label={`Delete item ${item.id}`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </td>
        )}
      </tr>
    );
  }
) as <T extends { id: number }>(props: GenericTableRowProps<T>) => JSX.Element;


// GenericTableRow.displayName = "GenericTableRow";