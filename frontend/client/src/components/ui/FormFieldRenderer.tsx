import React from 'react';
import { FieldConfig } from './GenericFormModal';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface FormFieldRendererProps<T> {
    field: FieldConfig;
    value: any; // Consider refining 'any' if possible, but tricky with generics
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onRadioChange: (name: string, value: string) => void; // Pass radio handler
}

export const FormFieldRenderer = <T extends Record<string, any>>({
    field,
    value,
    onChange,
    onRadioChange
}: FormFieldRendererProps<T>) => {

    const { theme } = useTheme();

    const commonInputClass = cn(
        'w-full rounded-md p-2',
        theme === 'dark'
            ? 'border border-[#5D0A72]/30 bg-[#03001c] text-white'
            : 'border border-[hsl(var(--border))] bg-white text-[hsl(var(--table-text))]'
    );

    if (field.type === "textarea") {
        return (
            <textarea
                name={field.id}
                value={value || ""}
                onChange={onChange}
                className={commonInputClass}
                required={field.required}
                rows={3}
            />
        );
    }

    if (field.type === "select") {
        return (
            <select
                name={field.id}
                value={value || field.defaultValue || ""}
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

    if (field.type === "radio") {
        return (
            <div className="flex space-x-4 pt-1">
                {field.options?.map((opt) => (
                    <div key={opt.value} className="flex items-center">
                        <input
                            type="radio"
                            id={`${field.id}-${opt.value}`} // Add unique ID for label association
                            name={field.id}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onRadioChange(field.id, opt.value)}
                            className={cn(
                                'w-4 h-4 rounded',
                                theme === 'dark'
                                    ? 'text-[#5D0A72] border-[#5D0A72]/30 focus:ring-[#8A0AA7]'
                                    : 'text-[hsl(var(--primary))] border-[hsl(var(--border))] focus:ring-[hsl(var(--primary))]'
                            )}
                            required={field.required}
                        />
                        <label htmlFor={`${field.id}-${opt.value}`} className={cn('ml-2 cursor-pointer', theme === 'dark' ? 'text-[#94A3B8]' : 'text-[hsl(var(--table-text))]')}>
                            {opt.label}
                        </label>
                    </div>
                ))}
            </div>
        );
    }

    // Default to input for other types (text, email, number, date, tel, etc.)
    return (
        <input
            type={field.type}
            name={field.id}
            value={value || ""}
            onChange={onChange}
            className={commonInputClass}
            required={field.required}
            pattern={field.pattern} // Pass pattern
            min={field.type === "number" ? 0 : undefined} // Keep min logic
            // Add other relevant input attributes if needed (e.g., step for number)
        />
    );
};
