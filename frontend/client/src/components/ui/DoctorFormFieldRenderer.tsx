import React from 'react';
import { FieldConfig } from './GenericFormModal';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface DoctorFormFieldRendererProps<T> {
  field: FieldConfig;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onRadioChange: (name: string, value: string) => void;
}

export const DoctorFormFieldRenderer = <T extends Record<string, any>>({
  field,
  value,
  onChange,
  onRadioChange,
}: DoctorFormFieldRendererProps<T>) => {
  const { theme } = useTheme();

  const commonInputClass = cn(
    'w-full rounded-md p-2 focus:outline-none transition-colors',
    theme === 'dark'
      ? 'border border-teal-500/20 bg-gray-800/40 text-white placeholder-gray-400 focus:border-teal-400'
      : 'border border-teal-500/40 bg-white text-gray-700 placeholder-gray-400 focus:border-teal-600'
  );

  if (field.type === 'textarea') {
    return (
      <textarea
        name={field.id}
        value={value || ''}
        onChange={onChange}
        className={commonInputClass}
        required={field.required}
        rows={3}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        name={field.id}
        value={value || field.defaultValue || ''}
        onChange={onChange}
        className={commonInputClass}
        required={field.required}
      >
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'radio') {
    return (
      <div className="flex space-x-4 pt-1">
        {field.options?.map((opt) => (
          <div key={opt.value} className="flex items-center">
            <input
              type="radio"
              id={`${field.id}-${opt.value}`}
              name={field.id}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onRadioChange(field.id, opt.value)}
              className={cn(
                'w-4 h-4 rounded focus:ring-2',
                theme === 'dark'
                  ? 'text-teal-400 border-teal-500/40 focus:ring-teal-500'
                  : 'text-teal-600 border-teal-500 focus:ring-teal-600'
              )}
              required={field.required}
            />
            <label
              htmlFor={`${field.id}-${opt.value}`}
              className={cn(
                'ml-2 cursor-pointer',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    );
  }

  // default input types
  return (
    <input
      type={field.type}
      name={field.id}
      value={value || ''}
      onChange={onChange}
      className={commonInputClass}
      required={field.required}
      pattern={field.pattern}
      min={field.type === 'number' ? 0 : undefined}
    />
  );
}; 