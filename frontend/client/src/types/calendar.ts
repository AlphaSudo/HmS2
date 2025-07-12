// Define an interface for the event structure
export interface CalendarEvent {
  id: string;
  day: number;
  month: number; // 0-indexed (0 = January, 11 = December)
  year: number;
  title: string;
  emoji: string;
  startTime?: string; // Optional: e.g., "10:00"
  endTime?: string;   // Optional: e.g., "11:30"
  durationDays: number; // Duration in days (1 for single day)
  colorGradient: string; // e.g., 'from-orange-500 to-red-600'
  category: string; // Added category field
}

// Define available categories
export const eventCategories = ['personal', 'work', 'friends', 'important', 'travel', 'other'] as const; // Use const assertion for type safety
export type EventCategory = typeof eventCategories[number]; // Create a type from the categories
