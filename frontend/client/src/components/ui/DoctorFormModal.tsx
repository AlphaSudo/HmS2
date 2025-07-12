import React, { useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { DoctorFormFieldRenderer } from './DoctorFormFieldRenderer';
import type { FieldConfig } from "./GenericFormModal";

interface DoctorFormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  formData: Partial<T>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<T>>>;
  isEditMode: boolean;
  title: string;
  fields: FieldConfig[];
}

export const DoctorFormModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditMode,
  title,
  fields,
}: DoctorFormModalProps<T>) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldConfig = fields.find((f) => f.id === name);
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
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const containerClasses = cn(
    "rounded-xl w-full max-w-2xl p-8 shadow-lg transition-shadow",
    theme === 'dark'
      ? 'bg-gray-800/60 border border-teal-500/20 text-white shadow-teal-500/10'
      : 'bg-white border border-gray-200 text-[hsl(var(--table-text))] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
  );

  const cancelBtnClasses = cn(
    "px-4 py-2 rounded-md transition-colors border",
    theme === 'dark'
      ? 'bg-gray-700/40 text-gray-300 border-teal-500/20 hover:bg-gray-700/60'
      : 'bg-[hsl(var(--muted))] text-[hsl(var(--table-text))] border-gray-200 hover:bg-[hsl(var(--muted-foreground))]/20'
  );

  const submitBtnClasses = cn(
    "px-5 py-2 rounded-md font-semibold transition-opacity shadow-md hover:shadow-lg",
    theme === 'dark'
      ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white hover:opacity-95'
      : 'bg-teal-600 text-white hover:opacity-90'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className={containerClasses}>
        <h2 className="text-xl font-semibold mb-6">
          {isEditMode ? `${t('common.edit')} ${title}` : `${t('common.add')} ${title}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            {fields.map((field) => (
              <div
                key={field.id}
                className={field.maxWidth || (field.type === 'textarea' ? 'md:col-span-2' : 'md:col-span-1')}
              >
                <label className="block text-sm font-medium mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <DoctorFormFieldRenderer
                  field={field}
                  value={formData?.[field.id as keyof T] ?? (field.type === 'number' ? 0 : '')}
                  onChange={handleInputChange}
                  onRadioChange={handleRadioChange}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className={cancelBtnClasses}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={submitBtnClasses}>
              {isEditMode ? t('common.update') : t('common.add')} {title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 