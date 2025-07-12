import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
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
    'rounded-lg w-full max-w-md p-6 transition-shadow',
    theme === 'dark'
      ? 'bg-[#020120] text-white shadow-blue-900/30'
      : 'bg-white text-[hsl(var(--table-text))] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
  );

  const cancelBtnClasses = cn(
    'px-6 py-2 rounded-lg transition-colors',
    theme === 'dark'
      ? 'bg-[#494949] text-white hover:bg-[#5D5D5D]'
      : 'bg-[hsl(var(--muted))] text-[hsl(var(--table-text))] hover:bg-[hsl(var(--muted-foreground))]/20'
  );

  const deleteBtnClasses = cn(
    'px-6 py-2 rounded-lg transition-colors',
    theme === 'dark'
      ? 'bg-[#E53E3E] text-white hover:bg-[#C53030]'
      : 'bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(var(--destructive))]/80'
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
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
          <h3 className={cn('text-xl font-medium mb-2', theme === 'dark' ? 'text-white' : 'text-[hsl(var(--table-text))]')}>
            {t('deleteDialog.title')}
          </h3>
          <p className={cn(theme === 'dark' ? 'text-[#94A3B8]' : 'text-[hsl(var(--muted-foreground))]')}>
            {t('deleteDialog.message')}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className={cancelBtnClasses}>
            {t('common.cancel')}
          </button>
          <button onClick={onConfirm} className={deleteBtnClasses}>
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};
