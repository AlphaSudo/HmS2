import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';
import { addDays, getEventDateRange } from '@/utils/dateUtils';
import { WEEKDAYS_SHORT } from '@/utils/constants';

interface WeekViewProps {
  weekStartDate: Date;
  today: Date;
  events: CalendarEvent[];
  openAddModal: (date: Date) => void;
  openEditModal: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  weekStartDate,
  today,
  events,
  openAddModal,
  openEditModal,
}) => {
  const { theme } = useTheme();
  // Memoize week days calculation
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(weekStartDate, i));
  }, [weekStartDate]);

  // Memoize the calculation of events per day for the week
  const eventsByDay = useMemo(() => {
    const eventsMap: { [key: string]: CalendarEvent[] } = {};
    weekDays.forEach(day => {
      const dayStart = day;
      const dayEnd = addDays(dayStart, 1);
      const dayEvents = events
        .filter(event => {
          const [eventStart, eventEnd] = getEventDateRange(event);
          // Check if the event interval overlaps with the day interval
          return eventStart < dayEnd && eventEnd > dayStart;
        })
        .sort((a: CalendarEvent, b: CalendarEvent) =>
          (a.startTime || "").localeCompare(b.startTime || "")
        );
      eventsMap[day.toISOString()] = dayEvents; // Use ISO string as key
    });
    return eventsMap;
  }, [events, weekDays]); // Dependencies: events and the calculated weekDays

  return (
    <div className={cn('grid grid-cols-7 gap-1 md:gap-2', theme==='dark' ? 'text-white' : 'text-foreground')}>
      {/* Header Row */}
      {weekDays.map(day => {
        const isToday = day.getTime() === today.getTime();
        return (
          <div key={day.toISOString()} className={cn('text-center pb-2 mb-2', theme==='dark' ? 'border-b border-white/20' : 'border-b border-border')}>
            <div className={cn('text-xs opacity-70', isToday ? (theme==='dark' ? 'text-teal-400' : 'text-primary') : '')}>{WEEKDAYS_SHORT[day.getDay()]}</div>
            <div className={cn('text-lg md:text-xl font-bold', isToday ? (theme==='dark' ? 'text-teal-300' : 'text-primary') : '')}>{day.getDate()}</div>
          </div>
        );
      })}
      {/* Content Columns */}
      {weekDays.map(day => {
        // Retrieve pre-calculated and sorted events for the day
        const dayEvents = eventsByDay[day.toISOString()] || [];
        const eventBaseStyle = "mt-1 px-1.5 py-1 rounded shadow-md shadow-black/40 flex items-center gap-1.5 text-xs font-medium text-white/95 cursor-pointer hover:opacity-80 transition-opacity";

        return (
          <div key={`col-${day.toISOString()}`} className={cn('min-h-[200px] first:border-l-0 px-1 space-y-1.5 flex flex-col', theme==='dark' ? 'border-l border-white/10' : 'border-l border-border')}>
             <div className="flex-grow space-y-1.5 overflow-y-auto max-h-[calc(100%-2rem)] scrollbar-thin scrollbar-thumb-teal-400/50 scrollbar-track-transparent pr-1"> {/* Added overflow and scrollbar */}
                 {/* Events are already filtered and sorted */}
                 {dayEvents.map((event: CalendarEvent) => (
                      <div
                        key={event.id}
                        className={`${eventBaseStyle} bg-gradient-to-r ${event.colorGradient}`}
                        onClick={(e) => { e.stopPropagation(); openEditModal(event); }}
                        title={`${event.title}${event.startTime ? ` (${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''})` : ''} [${event.category}]`}
                      >
                        {event.startTime && <span className="text-[10px] opacity-80 font-mono">{event.startTime}</span>}
                        <span role="img" aria-label={event.title} className="text-sm">{event.emoji}</span>
                        <span className="truncate flex-1">{event.title}</span>
                        {/* Show duration only if it starts on this day */}
                        {event.durationDays > 1 && new Date(event.year, event.month, event.day).getTime() === day.getTime() && <span className="text-[9px] opacity-70">({event.durationDays}d)</span>}
                      </div>
                 ))}
             </div>
             <button onClick={() => openAddModal(day)} className={cn('mt-auto pt-2 text-center w-full text-xs opacity-60 hover:opacity-100 transition-opacity', theme==='dark' ? 'text-teal-400/70 hover:text-green-400' : 'text-primary hover:text-primary-foreground')}>+ Add</button>
          </div>
        );
      })}
    </div>
  );
};