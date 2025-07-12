
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { DoctorSidebar } from '../components/ui/DoctorSidebar';
import { DoctorHeader } from '../components/ui/DoctorHeader';
import { FaPlus } from 'react-icons/fa';
import { ListTodo } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Task } from '../types/task';
import { TaskFilterControls } from '../components/tasks/TaskFilterControls';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const FILTER_ALL = 'all' as const;
const FILTER_DONE = 'done' as const;
const FILTER_UNDONE = 'undone' as const;
type FilterType = typeof FILTER_ALL | typeof FILTER_DONE | typeof FILTER_UNDONE;


const DoctorTasksPage: React.FC = () => {
  const {
      tasks,
      handleCheck,
      handleDeleteTask,
      handleMoveTask,
      handleAddTask,
      handleUpdateTask,
      formatDateForInput,
  } = useTasks();

  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FILTER_ALL);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case FILTER_DONE:
        return tasks.filter(task => task.completed);
      case FILTER_UNDONE:
        return tasks.filter(task => !task.completed);
      case FILTER_ALL:
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const handleEditClick = useCallback((task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback((formData: Omit<Task, 'id'>) => {
    if (editingTask) {
      handleUpdateTask(formData, editingTask.id);
    } else {
      handleAddTask(formData);
    }
    setShowForm(false);
    setEditingTask(null);
  }, [editingTask, handleAddTask, handleUpdateTask]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingTask(null);
  }, []);

  const handleAddTaskClick = useCallback(() => {
    setEditingTask(null);
    setShowForm(true);
  }, []);

  const getOriginalIndex = useCallback((taskId: number): number => {
      return tasks.findIndex(t => t.id === taskId);
  }, [tasks]);

  const deleteTaskAndCloseForm = useCallback((id: number) => {
      handleDeleteTask(id);
      if (editingTask && editingTask.id === id) {
          handleCancelForm();
      }
  }, [handleDeleteTask, editingTask, handleCancelForm]);


  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
      <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn("flex-1 flex flex-col overflow-hidden transition-all duration-300", isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64'))}>
        <DoctorHeader
          title={t('tasks.title')}
          icon={<ListTodo className="h-8 w-8 text-teal-400" />}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="p-8 flex gap-8 pt-8 overflow-y-auto">
          <div className={cn(
            "flex-1 rounded-xl p-6 min-w-0 shadow-lg",
            theme === 'dark'
              ? 'bg-gray-800/60 border border-teal-500/20'
              : 'bg-card border border-border'
          )}>
            <div className="flex justify-between items-center mb-2">
              <div className={cn('text-xl font-semibold', theme === 'dark' ? 'text-white' : 'text-foreground')}>{t('tasks.title')}</div>
              {!showForm && (
                <button onClick={handleAddTaskClick} className={cn('rounded-md py-2 px-4 font-medium flex items-center gap-2 transition-colors', theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground') }>
                  <FaPlus /> {t('tasks.addTask')}
                </button>
              )}
            </div>
            <TaskFilterControls
                currentFilter={filter}
                onFilterChange={setFilter}
            />

             <div className={cn('text-sm mb-4', theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground')}>{t('tasks.totalTasks', {count: tasks.length})}</div>
             <TaskList
                tasks={filteredTasks}
                onCheck={handleCheck}
                onDelete={deleteTaskAndCloseForm}
                onMove={handleMoveTask}
                onEditClick={handleEditClick}
                getOriginalIndex={getOriginalIndex}
             />
          </div>

          {showForm && (
            <div className={cn(
                "flex-1 rounded-xl p-6 shadow-lg",
                theme === 'dark'
                ? 'bg-gray-800/60 border border-teal-500/20'
                : 'bg-card border border-border'
            )}>
                <TaskForm
                    initialData={editingTask}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                    formatDateForInput={formatDateForInput}
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorTasksPage; 