// Task type definition
export interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Normal' | 'Low';
  assignee: string; // URL to profile image or name
  date: string | Date; // Can be string or Date object
  details: string;
  completed: boolean;
}

// Priority levels for tasks
export const priorities: Task['priority'][] = ['High', 'Normal', 'Low'];

// Filter types for task filtering
export type TaskFilter = 'all' | 'done' | 'undone'; 