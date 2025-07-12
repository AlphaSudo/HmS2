import React , { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FaTrash, FaArrowUp, FaArrowDown, FaEdit } from 'react-icons/fa';
import { Task } from '../../types/task';

interface TaskListProps {
    tasks: Task[];
    onCheck: (id: number) => void;
    onDelete: (id: number) => void;
    onMove: (index: number, direction: 'up' | 'down') => void;
    onEditClick: (task: Task) => void;
    getOriginalIndex: (taskId: number) => number; // Function to get original index for moving
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onCheck,
    onDelete,
    onMove,
    onEditClick,
    getOriginalIndex
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    // Memoize the mapping from task ID to its original index
    const originalIndexMap = useMemo(() => {
        const map = new Map<number, number>();
        // Assuming getOriginalIndex is stable and correct based on the full task list context
        tasks.forEach(task => {
            map.set(task.id, getOriginalIndex(task.id));
        });
        return map;
    }, [tasks, getOriginalIndex]); // Recalculate if tasks or the function changes

    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="w-full table-auto border-separate border-spacing-0">
                <thead>
                    <tr className={cn('text-xs uppercase', theme === 'dark' ? 'text-teal-300 bg-gray-900/70' : 'text-muted-foreground bg-muted')}>
                        <th className={cn('p-2 sticky top-0', theme === 'dark' ? 'bg-gray-900/70' : 'bg-muted')}></th>
                        <th className={cn('p-2 text-left sticky top-0', theme === 'dark' ? 'bg-gray-900/70' : 'bg-muted')}>{t('tasks.table.task')}</th>
                        <th className={cn('p-2 sticky top-0', theme === 'dark' ? 'bg-gray-900/70' : 'bg-muted')}>{t('tasks.table.priority')}</th>
                        <th className={cn('p-2 sticky top-0', theme === 'dark' ? 'bg-gray-900/70' : 'bg-muted')}>{t('tasks.table.assignee')}</th>
                        <th className={cn('p-2 sticky top-0', theme === 'dark' ? 'bg-gray-900/70' : 'bg-muted')}>{t('tasks.table.dueDate')}</th>
                        <th className={cn('p-2 sticky top-0', theme === 'dark' ? 'bg-gray-900/70' : 'bg-muted')}>{t('tasks.table.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {
                         // Find the original index in the main tasks array for moving
                         const originalIndex = originalIndexMap.get(task.id) ?? -1; // Use ?? -1 as a fallback if needed
                       
                         // Disable move buttons if index wasn't found (shouldn't happen ideally)
                        const isMoveUpDisabled = originalIndex === -1 || originalIndex === 0;
                        // Note: Comparing originalIndex to tasks.length might be incorrect if 'tasks' is filtered/sorted.
                        // The logic for disabling 'down' might need the total count from the parent.
                        // For simplicity, let's assume getOriginalIndex provides indices relative to the *original* list.
                        // A better approach might be for the parent to provide the total original count.
                        const isMoveDownDisabled = originalIndex === -1 /* || originalIndex >= totalOriginalTasks - 1 */;

                
                        return (
                            <tr key={task.id} className={cn(
                              'hover:cursor-pointer',
                              task.completed
                                ? (theme === 'dark' ? 'bg-gray-800/50 line-through text-gray-500 hover:bg-gray-700/50' : 'bg-muted/50 line-through text-muted-foreground hover:bg-muted')
                                : (theme === 'dark' ? 'text-white hover:bg-gray-700/50' : 'text-foreground hover:bg-muted'))}>
                                <td className={cn("p-2", theme === 'dark' ? 'border-b border-teal-500/20' : 'border-b border-border')}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onCheck(task.id)}
                                        className={cn('form-checkbox h-4 w-4 rounded focus:ring-2', theme === 'dark' ? 'text-teal-500 bg-gray-700 border-gray-600 focus:ring-teal-500' : 'text-primary bg-background border-border focus:ring-primary')}
                                    />
                                </td>
                                <td className={cn('p-2 min-w-[180px] cursor-pointer', theme === 'dark' ? 'border-b border-teal-500/20 hover:text-teal-400' : 'border-b border-border') } onClick={() => onEditClick(task)}>
                                    {task.title}
                                </td>
                                <td className={cn('p-2', theme === 'dark' ? 'border-b border-teal-500/20' : 'border-b border-border') }>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                        task.priority === 'High' ? 'bg-red-500 text-white' :
                                        task.priority === 'Normal' ? 'bg-yellow-500 text-white' :
                                        'bg-cyan-400 text-white'
                                    }`}>{t(`tasks.priority.${task.priority.toLowerCase()}`)}</span>
                                </td>
                                <td className={cn('p-2', theme === 'dark' ? 'border-b border-teal-500/20' : 'border-b border-border') }>
                                    <img src={task.assignee} alt="assignee" className="w-7 h-7 rounded-full border-2" />
                                </td>
                                <td className={cn('p-2', theme === 'dark' ? 'border-b border-teal-500/20' : 'border-b border-border') }>{task.date}</td>
                                <td className={cn('p-2', theme === 'dark' ? 'border-b border-teal-500/20' : 'border-b border-border') }>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEditClick(task)}
                                            className={cn('transition-colors', theme === 'dark' ? 'text-gray-400 hover:text-yellow-400' : 'text-muted-foreground hover:text-yellow-600')}
                                            title={t('tasks.table.edit')}
                                        >
                                            <FaEdit />
                                        </button>
                                       <button
                                            onClick={() => onMove(originalIndex, 'up')}
                                            disabled={isMoveUpDisabled} // Use calculated disabled state
                                            className="text-gray-400 hover:text-teal-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title={t('tasks.table.moveUp')}
                                        >
                                            <FaArrowUp />
                                        </button>
                                        <button
                                            onClick={() => onMove(originalIndex, 'down')}
                                            // Consider passing total task count if needed for accurate disabling
                                            disabled={isMoveDownDisabled} // Use calculated disabled state
                                            className="text-gray-400 hover:text-teal-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title={t('tasks.table.moveDown')}
                                        >
                                            <FaArrowDown />
                                        </button>
                                        <button
                                            onClick={() => onDelete(task.id)}
                                            className="text-gray-400 hover:text-red-500"
                                            title={t('tasks.table.delete')}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
