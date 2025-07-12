import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';
import { MONTH_NAMES, WEEKDAYS_LONG } from '@/utils/constants';

interface DayViewProps {
  currentDate: Date;
  today: Date;
  events: CalendarEvent[];
  openAddModal: (date: Date) => void;
  openEditModal: (event: CalendarEvent) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  today,
  events,
  openAddModal,
  openEditModal,
}) => {
  const { theme } = useTheme();
  const isToday = currentDate.getTime() === today.getTime();
  const eventBaseStyle = "px-3 py-2 rounded-lg shadow-md shadow-black/40 flex items-center gap-3 text-sm font-medium text-white/95 cursor-pointer hover:opacity-90 transition-opacity";

  // Memoize the sorted events
  const sortedDayEvents = useMemo(() => {
    // Create a new array before sorting to avoid mutating the prop
    return [...events].sort((a: CalendarEvent, b: CalendarEvent) => 
      (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
    );
  }, [events]); // Recalculate only when events array changes

  return (
      <div className="space-y-3 max-w-2xl mx-auto w-full">
          <h2 className={cn('text-2xl font-semibold text-center mb-4',
            isToday
              ? (theme === 'dark' ? 'text-teal-400' : 'text-primary')
              : (theme === 'dark' ? 'text-teal-300' : 'text-foreground'))}>
              {WEEKDAYS_LONG[currentDate.getDay()]}, {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getDate()}
          </h2>
          {sortedDayEvents.length === 0 && ( // Use the memoized variable
              <p className={cn('text-center py-6', theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground')}>No events scheduled for this day.</p>
          )}
          {sortedDayEvents // Use the memoized variable
              .map((event: CalendarEvent) => (
                  <div
                      key={event.id}
                      className={`${eventBaseStyle} bg-gradient-to-r ${event.colorGradient}`}
                      onClick={() => openEditModal(event)}
                      title={`${event.title} [${event.category}]`}
                  >
                      <div className="w-20 text-right font-mono text-xs opacity-80 flex-shrink-0">
                          {event.startTime ? (
                              <>
                                  <div>{event.startTime}</div>
                                  {event.endTime && <div className="opacity-70">to {event.endTime}</div>}
                              </>
                          ) : (
                              <div>All Day</div>
                          )}
                           {event.durationDays > 1 && <div className="text-[10px] opacity-60">({event.durationDays} days)</div>}
                      </div>
                      <div className="flex items-center gap-2 flex-1 overflow-hidden">
                           <span role="img" aria-label={event.title} className="text-lg">{event.emoji}</span>
                           <span className="truncate font-semibold">{event.title}</span>
                      </div>
                      <span className="text-xs capitalize opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
                          {event.category}
                      </span>
                  </div>
              ))}
           <button 
             onClick={() => openAddModal(currentDate)} 
             className={cn('mt-4 w-full text-center py-2 rounded-lg transition-colors',
               theme === 'dark'
                 ? 'bg-white/5 hover:bg-white/10 text-teal-300 hover:text-green-400'
                 : 'bg-muted hover:bg-muted/80 text-primary hover:text-primary-foreground')}
           >
             + Add Event for this Day
           </button>
      </div>
  );
};