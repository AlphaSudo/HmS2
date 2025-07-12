import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { Task, priorities } from '../../types/task'; // Import Task type and priorities

// Define the shape of the form data, excluding the 'id'
type TaskFormData = Omit<Task, 'id'>;

interface TaskFormProps {
    initialData?: Task | null; // Task data for editing, null for adding
    onSubmit: (formData: TaskFormData) => void;
    onCancel: () => void;
    formatDateForInput: (dateString: string | Date) => string; // Receive formatter
}

const defaultFormState: TaskFormData = {
    title: '',
    assignee: '',
    priority: 'Normal',
    date: '', // Store date as YYYY-MM-DD for input
    details: '',
    completed: false,
};

export const TaskForm: React.FC<TaskFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    formatDateForInput
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [form, setForm] = useState<TaskFormData>(defaultFormState);
    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            // Pre-populate form for editing, formatting the date correctly
            setForm({
                ...initialData,
                date: formatDateForInput(initialData.date), // Format date for input
            });
        } else {
            // Reset form for adding
            setForm(defaultFormState);
        }
    }, [initialData, formatDateForInput]); // Rerun effect if initialData or formatter changes

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && 'checked' in e.target) {
            setForm(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form); // Pass the current form state (date is YYYY-MM-DD)
    };

    const containerClass = cn(
      'flex-1 rounded-xl p-6 min-w-[320px] shadow-lg',
      theme === 'dark'
        ? 'bg-gray-800/60 border border-teal-500/20 text-white'
        : 'bg-card border border-border text-foreground'
    );

    const inputClass = cn('w-full p-3 rounded-lg focus:outline-none',
      theme === 'dark'
        ? 'border border-teal-500/30 bg-gray-900/70 text-white focus:ring-2 focus:ring-teal-500'
        : 'border border-border bg-input text-foreground');

    const checkboxClass = cn('mr-2 form-checkbox h-4 w-4 rounded focus:ring-2',
      theme === 'dark' ? 'text-teal-500 bg-gray-700 border-gray-600 focus:ring-teal-500' : 'text-primary bg-background border-border focus:ring-primary');

    const labelTextClass = cn('text-sm flex items-center', theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground');

    return (
        <div className={containerClass}>
            <div className={cn('text-lg font-semibold mb-4', theme === 'dark' ? 'text-white' : 'text-foreground')}>
                {isEditing ? t('tasks.form.editTask') : t('tasks.form.newTask')}
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="mb-4">
                    <input
                        className={inputClass}
                        type="text"
                        name="title"
                        placeholder={t('tasks.form.titlePlaceholder')}
                        value={form.title}
                        onChange={handleFormChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className={labelTextClass}>
                        <input
                            type="checkbox"
                            name="completed"
                            checked={form.completed}
                            onChange={handleFormChange}
                            className={checkboxClass}
                        /> {t('tasks.form.markComplete')}
                    </label>
                </div>
                <div className="mb-4">
                    <input
                        className={inputClass}
                        type="text"
                        name="assignee"
                        placeholder={t('tasks.form.assigneePlaceholder')}
                        value={form.assignee}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="flex gap-4 mb-4">
                    <select
                        className={cn(inputClass, 'flex-1')}
                        name="priority"
                        value={form.priority}
                        onChange={handleFormChange}
                    >
                        {priorities.map(p => <option key={p} value={p}>{t(`tasks.priority.${p.toLowerCase()}`)}</option>)}
                    </select>
                    <input
                        className={cn(inputClass, 'flex-1')}
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        className={cn(inputClass, 'min-h-[60px]')}
                        name="details"
                        placeholder={t('tasks.form.detailsPlaceholder')}
                        value={form.details}
                        onChange={handleFormChange}
                    />
                </div>
                <button type="submit" className={cn('w-full rounded-md py-3 font-semibold flex items-center justify-center gap-2 transition-colors', theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground')}>
                    {isEditing ? <FaEdit /> : <FaCheckCircle />}
                    {isEditing ? t('tasks.form.update') : t('tasks.form.add')}
                </button>
            </form>
            <button onClick={onCancel} className={cn('mt-4 w-full rounded-md py-2 font-medium transition', theme === 'dark' ? 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600' : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80') }>
                {t('tasks.form.cancel')}
            </button>
        </div>
    );
};
