import { CalendarEvent } from '../types/calendar';

// --- Date Utility Functions ---
export const getDaysInMonth = (year: number, month: number): number => {
  // month is 0-indexed here
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  // month is 0-indexed here
  // Returns 0 for Sunday, 1 for Monday, etc.
  return new Date(year, month, 1).getDay();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekStartDate = (date: Date): Date => {
  const startDate = new Date(date);
  const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ...
  startDate.setDate(startDate.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0); // Normalize
  return startDate;
};

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  return date.toLocaleDateString(undefined, options); // Use locale default
};

// Helper function to get event date range
export const getEventDateRange = (event: CalendarEvent): [Date, Date] => {
    const normalizeDate = (d: Date) => {
        const newDate = new Date(d);
        newDate.setHours(0,0,0,0);
        return newDate;
    }
    // Month in CalendarEvent is 0-indexed
    const start = normalizeDate(new Date(event.year, event.month, event.day));
    const end = addDays(start, event.durationDays); // End date is exclusive
    return [start, end];
};

export const normalizeDate = (d: Date): Date => {
    const newDate = new Date(d);
    newDate.setHours(0,0,0,0);
    return newDate;
}
