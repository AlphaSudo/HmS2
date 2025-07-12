import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';
import { normalizeDate, getEventDateRange } from '@/utils/dateUtils';
import { WEEKDAYS_SHORT } from '@/utils/constants';

interface MonthViewProps {
  year: number;
  month: number; // 0-indexed
  today: Date;
  events: CalendarEvent[];
  openAddModal: (date: Date) => void;
  openEditModal: (event: CalendarEvent) => void;
  getDaysInMonth: (year: number, month: number) => number;
  getFirstDayOfMonth: (year: number, month: number) => number;
}

export const MonthView: React.FC<MonthViewProps> = ({
  year,
  month,
  today,
  events,
  openAddModal,
  openEditModal,
  getDaysInMonth,
  getFirstDayOfMonth,
}) => {
  const { theme } = useTheme();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Memoize the calculation of events per day
  const eventsByDay = useMemo(() => {
    const eventsMap: { [day: number]: CalendarEvent[] } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = normalizeDate(new Date(year, month, day));
      const dayEvents = events
        .filter(event => {
          const [eventStart, eventEnd] = getEventDateRange(event);
          return cellDate >= eventStart && cellDate < eventEnd;
        })
        .sort((a: CalendarEvent, b: CalendarEvent) =>
          (a.startTime || "").localeCompare(b.startTime || "")
        );
      if (dayEvents.length > 0) {
        eventsMap[day] = dayEvents;
      }
    }
    return eventsMap;
  }, [events, year, month, daysInMonth]); // Dependencies

  return (
    <div className={cn('grid grid-cols-7 gap-1 md:gap-2 text-xs md:text-sm', theme==='dark'?'text-white':'text-foreground')}>
      {WEEKDAYS_SHORT.map(day => (
        <div key={day} className={cn('text-center font-semibold tracking-widest opacity-70 pb-2', theme==='dark'?'text-shadow-[0_1px_3px_rgba(255,255,255,0.2)]':'')}>
          {day}
        </div>
      ))}
      {Array.from({ length: firstDayIndex }).map((_, i) => (
        <div key={`empty-${i}`} className="border border-transparent"></div>
      ))}
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const dayOfMonth = i + 1;
        const cellDate = normalizeDate(new Date(year, month, dayOfMonth));
        const isToday = cellDate.getTime() === today.getTime();

        // Retrieve pre-calculated and sorted events for the day
        const dayEvents = eventsByDay[dayOfMonth] || [];

        const eventBaseStyle = "mt-1 px-1.5 py-0.5 rounded shadow-md shadow-black/40 flex items-center gap-1 text-[10px] md:text-xs font-medium text-white/95 cursor-pointer hover:opacity-80 transition-opacity";

        const cellClass = cn(
          `relative min-h-[80px] md:min-h-[120px] flex flex-col items-center justify-start rounded-lg md:rounded-xl border p-1 md:p-1.5 transition-all duration-300 ease-in-out cursor-pointer`,
          theme==='dark'
            ? 'border-teal-500/20 bg-gray-800/50 shadow-[0_2px_10px_0_rgba(45,212,191,0.1)] hover:bg-gray-700/60 hover:shadow-[0_4px_15px_0_rgba(45,212,191,0.15)] hover:border-teal-500/30'
            : 'border-border bg-card hover:bg-muted'
        );

        return (
          <div
            key={dayOfMonth}
            onClick={() => openAddModal(cellDate)}
            className={cn(cellClass, isToday ? (theme==='dark' ? 'ring-2 md:ring-3 ring-teal-400/70 ring-offset-1 ring-offset-gray-900/80 shadow-[0_0_10px_1px_rgba(45,212,191,0.4)]' : 'ring-2 ring-primary') : '')}
          >
            <span className={cn('font-bold text-sm md:text-base mb-0.5',
              isToday
                ? (theme==='dark' ? 'bg-gradient-to-r from-teal-400 to-green-400 text-transparent bg-clip-text drop-shadow-[0_0_5px_rgba(45,212,191,0.6)]' : 'text-primary')
                : (theme==='dark' ? 'opacity-90' : ''))}>
              {dayOfMonth}
            </span>
            <div className="overflow-y-auto max-h-[calc(100%-1.5rem)] md:max-h-[calc(100%-1.8rem)] w-full px-0.5 space-y-1 scrollbar-thin scrollbar-thumb-teal-400/50 scrollbar-track-transparent">
              {/* Events are already filtered and sorted */}
              {dayEvents.map((event: CalendarEvent) => (
                  <div
                    key={event.id}
                    className={`${eventBaseStyle} bg-gradient-to-r ${event.colorGradient}`}
                    onClick={(e) => { e.stopPropagation(); openEditModal(event); }}
                    title={`${event.title}${event.startTime ? ` (${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''})` : ''} [${event.category}]`}
                  >
                    {event.startTime && <span className="text-[9px] md:text-[10px] opacity-80 font-mono hidden sm:inline">{event.startTime}</span>}
                    <span role="img" aria-label={event.title} className="text-xs md:text-sm">{event.emoji}</span>
                    <span className="truncate flex-1">{event.title}</span>
                    {event.durationDays > 1 && <span className="text-[8px] md:text-[9px] opacity-70 hidden sm:inline">({event.durationDays}d)</span>}
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};