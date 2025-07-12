import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface DoctorDeleteConfirmationDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DoctorDeleteConfirmationDialog: React.FC<DoctorDeleteConfirmationDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const dialogClasses = cn(
    "rounded-xl w-full max-w-md p-8 shadow-lg transition-shadow",
    theme === "dark"
      ? "bg-gray-800/60 border border-teal-500/20 text-white shadow-teal-500/10"
      : "bg-white border border-gray-200 text-[hsl(var(--table-text))] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
  );

  const cancelBtnClasses = cn(
    "px-6 py-2 rounded-lg transition-colors border",
    theme === "dark"
      ? "bg-gray-700/40 text-gray-300 border-teal-500/20 hover:bg-gray-700/60"
      : "bg-[hsl(var(--muted))] text-[hsl(var(--table-text))] border-gray-200 hover:bg-[hsl(var(--muted-foreground))]/20"
  );

  const deleteBtnClasses = cn(
    "px-6 py-2 rounded-lg transition-colors shadow",
    theme === "dark"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(var(--destructive))]/80"
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div ref={dialogRef} className={dialogClasses}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("deleteDialog.title")}
          </h3>
          <p className={cn(theme === "dark" ? "text-gray-400" : "text-[hsl(var(--muted-foreground))]")}> 
            {t("deleteDialog.message")}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className={cancelBtnClasses}>
            {t("common.cancel")}
          </button>
          <button onClick={onConfirm} className={deleteBtnClasses}>
            {t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}; 