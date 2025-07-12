import { useState, useCallback } from 'react';
import { initialTasks } from '../assets/data/initialTasks';
import { Task } from '../types/task'; // Assuming Task type is defined here or adjust path

// Helper to format date for display (e.g., "May 04, 2025")
const formatDateForDisplay = (dateString: string | Date): string => {
    if (!dateString) return '';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
         // Add timezone offset to prevent date shifting when converting to ISO string for input
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset*60*1000));
        if (isNaN(adjustedDate.getTime())) return ''; // Invalid date
        return adjustedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch (e) {
        console.error("Error formatting date for display:", e);
        return ''; // Fallback
    }
};

// Helper to format date for the date input (YYYY-MM-DD)
const formatDateForInput = (dateString: string | Date): string => {
    if (!dateString) return '';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        // Add timezone offset to prevent date shifting when converting to ISO string for input
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset*60*1000));
        if (isNaN(adjustedDate.getTime())) return ''; // Invalid date
        return adjustedDate.toISOString().split('T')[0];
    } catch (e) {
        console.error("Error formatting date for input:", e);
        return ''; // Fallback
    }
};


const DEFAULT_ASSIGNEE_URL = 'https://randomuser.me/api/portraits/men/1.jpg';
const DEFAULT_DATE_DISPLAY = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

export const useTasks = (initialTaskList: Task[] = initialTasks) => {
    const [tasks, setTasks] = useState<Task[]>(initialTaskList);

    const handleCheck = useCallback((id: number) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    const handleDeleteTask = useCallback((id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }, []);

    const handleMoveTask = useCallback((index: number, direction: 'up' | 'down') => {
        setTasks(prevTasks => {
            if (direction === 'up' && index === 0) return prevTasks;
            if (direction === 'down' && index === prevTasks.length - 1) return prevTasks;

            const newTasks = [...prevTasks];
            const taskToMove = newTasks[index];
            const swapIndex = direction === 'up' ? index - 1 : index + 1;

            newTasks[index] = newTasks[swapIndex];
            newTasks[swapIndex] = taskToMove;

            return newTasks;
        });
    }, []);

     const handleAddTask = useCallback((newTaskData: Omit<Task, 'id'>) => {
        setTasks(prevTasks => {
            const newId = prevTasks.length > 0 ? Math.max(...prevTasks.map(t => t.id)) + 1 : 1;
            const newTask: Task = {
                ...newTaskData,
                id: newId,
                assignee: newTaskData.assignee || DEFAULT_ASSIGNEE_URL,
                date: formatDateForDisplay(newTaskData.date) || DEFAULT_DATE_DISPLAY, // Format date for display
            };
            return [...prevTasks, newTask];
        });
    }, []);

    const handleUpdateTask = useCallback((updatedTaskData: Omit<Task, 'id'>, id: number) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? {
                        ...task, // Keep original id and potentially other unchanged fields
                        ...updatedTaskData, // Apply updates
                        assignee: updatedTaskData.assignee || DEFAULT_ASSIGNEE_URL,
                        date: formatDateForDisplay(updatedTaskData.date) || DEFAULT_DATE_DISPLAY, // Format date for display
                      }
                    : task
            )
        );
    }, []);


    return {
        tasks,
        setTasks, // Expose if needed for direct manipulation (e.g., drag-and-drop reordering)
        handleCheck,
        handleDeleteTask,
        handleMoveTask,
        handleAddTask,
        handleUpdateTask,
        formatDateForInput, // Expose helper for form pre-population
        formatDateForDisplay // Expose helper if needed elsewhere
    };
};
