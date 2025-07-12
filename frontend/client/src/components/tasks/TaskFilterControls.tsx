import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Define filter types (or import from types/task.ts if defined there)
const FILTER_ALL = 'all' as const;
const FILTER_DONE = 'done' as const;
const FILTER_UNDONE = 'undone' as const;
type FilterType = typeof FILTER_ALL | typeof FILTER_DONE | typeof FILTER_UNDONE;


interface TaskFilterControlsProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export const TaskFilterControls: React.FC<TaskFilterControlsProps> = ({
    currentFilter,
    onFilterChange,
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    return (
        <div className="flex gap-2 mb-4">
            <button
                onClick={() => onFilterChange(FILTER_ALL)}
                className={cn('px-3 py-1 rounded text-sm transition-colors',
                  currentFilter === FILTER_ALL
                    ? (theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-primary text-primary-foreground')
                    : (theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-muted text-muted-foreground hover:bg-muted/80'))}
            >
                {t('tasks.filters.all')}
            </button>
            <button
                onClick={() => onFilterChange(FILTER_DONE)}
                className={cn('px-3 py-1 rounded text-sm transition-colors',
                  currentFilter === FILTER_DONE
                    ? (theme === 'dark' ? 'bg-green-500 text-white' : 'bg-green-600 text-white')
                    : (theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-muted text-muted-foreground hover:bg-muted/80'))}
            >
                {t('tasks.filters.done')}
            </button>
            <button
                onClick={() => onFilterChange(FILTER_UNDONE)}
                className={cn('px-3 py-1 rounded text-sm transition-colors',
                  currentFilter === FILTER_UNDONE
                    ? (theme === 'dark' ? 'bg-yellow-500 text-white' : 'bg-yellow-400 text-white')
                    : (theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-muted text-muted-foreground hover:bg-muted/80'))}
            >
                {t('tasks.filters.undone')}
            </button>
        </div>
    );
};
