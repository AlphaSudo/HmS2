import React, { useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { FormFieldRenderer } from './FormFieldRenderer'; // Import the new component

// Make sure FieldConfig is exported or defined here
export interface FieldConfig {
  id: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "radio"| "date" | "tel";
  required?: boolean;
  pattern?: string;
  options?: { value: string; label: string; disabled?: boolean }[];
  defaultValue?: string | number;
  maxWidth?: string;
  
}

interface GenericFormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  formData: Partial<T>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<T>>>;
  isEditMode: boolean;
  title: string;
  fields: FieldConfig[];
}

export const GenericFormModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditMode,
  title,
  fields,
}: GenericFormModalProps<T>) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]); // Add dependencies

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldConfig = fields.find(f => f.id === name);
    setFormData((prev) => ({
      ...prev,
      [name]: fieldConfig?.type === 'number' ? Number(value) : value,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 GenericFormModal: Form submitted with data:', formData);
    console.log('🚀 GenericFormModal: Form fields:', fields);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Additional safety check for formData
  if (!formData) {
    console.warn('GenericFormModal: formData is undefined, rendering empty form');
    return null;
  }

  const containerClasses = cn(
    "rounded-xl w-full max-w-2xl p-6 shadow-lg transition-shadow",
    theme === "dark"
      ? "bg-gradient-to-br from-[#0a004a] via-[#05002E] to-[#03001c] border border-[#5D0A72]/30 text-white shadow-blue-900/30"
      : "bg-white border border-[hsl(var(--border))] text-[hsl(var(--table-text))] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
  );

  const cancelBtnClasses = cn(
    "px-4 py-2 rounded-md transition-colors border",
    theme === "dark"
      ? "text-[#94A3B8] hover:bg-[#5D0A72]/20 border-transparent hover:border-[#5D0A72]/50"
      : "text-[hsl(var(--table-text))] border-transparent hover:bg-[hsl(var(--muted))]/40 hover:border-[hsl(var(--border))]"
  );

  const submitBtnClasses = cn(
    "px-5 py-2 rounded-md font-semibold transition-opacity shadow-md hover:shadow-lg",
    theme === "dark"
      ? "bg-gradient-to-r from-[#5D0A72] to-[#8A0AA7] text-white hover:opacity-95"
      : "bg-[hsl(var(--primary))] text-white hover:opacity-90"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className={cn(
          "rounded-xl w-full max-w-2xl shadow-lg transition-shadow flex flex-col max-h-[90vh]", // Added max-height and flex column
          theme === "dark"
            ? "bg-gradient-to-br from-[#0a004a] via-[#05002E] to-[#03001c] border border-[#5D0A72]/30 text-white shadow-blue-900/30"
            : "bg-white border border-[hsl(var(--border))] text-[hsl(var(--table-text))] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        )}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-0">
          <h2 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-[hsl(var(--table-text))]")}>
            {isEditMode ? `${t('common.edit')} ${title}` : `${t('common.add')} ${title}`}
          </h2>
        </div>

        {/* Scrollable Content & Footer */}
        <form id="generic-form" onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
              {fields.map((field) => (
                <div key={field.id} className={field.maxWidth || (field.type === 'textarea' ? 'md:col-span-2' : 'md:col-span-1')}>
                  <label htmlFor={field.id} className={cn('block text-sm font-medium mb-1.5', theme === 'dark' ? 'text-[#94A3B8]' : 'text-[hsl(var(--table-text))]')}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <FormFieldRenderer
                    field={field}
                    value={formData?.[field.id as keyof T] ?? (field.type === 'number' ? 0 : '')}
                    onChange={handleInputChange}
                    onRadioChange={handleRadioChange}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-opacity-20" style={{
            borderTopColor: theme === 'dark' ? '#5D0A72' : 'hsl(var(--border))'
          }}>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={cancelBtnClasses}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className={submitBtnClasses}
              >
                {isEditMode ? `${t('common.update')}` : `${t('common.add')}`} {title}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};