import { Task } from '../../types/task'; // Import the Task type

// Mock data for tasks
export const initialTasks: Task[] = [ // Explicitly type the array as Task[]
  {
    id: 1,
    title: 'Update patient records',
    priority: 'High', // Matches Task['priority']
    assignee: 'https://randomuser.me/api/portraits/women/1.jpg',
    date: 'May 05, 2025',
    details: '', // Added details property
    completed: false,
  },
  {
    id: 2,
    title: 'Schedule annual check-ups',
    priority: 'Normal', // Matches Task['priority']
    assignee: 'https://randomuser.me/api/portraits/men/2.jpg',
    date: 'May 10, 2025',
    details: '', // Added details property
    completed: false,
  },
  {
    id: 3,
    title: 'Order new supplies',
    priority: 'Low', // Matches Task['priority']
    assignee: 'https://randomuser.me/api/portraits/women/3.jpg',
    date: 'May 15, 2025',
    details: '', // Added details property
    completed: true,
  },
  {
    id: 4,
    title: 'Review lab results',
    priority: 'High', // Matches Task['priority']
    assignee: 'https://randomuser.me/api/portraits/men/4.jpg',
    date: 'May 06, 2025',
    details: '', // Added details property
    completed: false,
  },
  {
    id: 5,
    title: 'Prepare monthly report',
    priority: 'Normal', // Matches Task['priority']
    assignee: 'https://randomuser.me/api/portraits/women/5.jpg',
    date: 'May 20, 2025',
    details: '', // Added details property
    completed: false,
  },
];