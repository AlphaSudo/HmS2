import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';
import { formatDate } from '@/utils/dateUtils';
import { MONTH_NAMES } from '@/utils/constants';

interface ListViewProps {
    events: CalendarEvent[];
    openEditModal: (event: CalendarEvent) => void;
    selectedCategory: string;
    currentDisplayMonth: number;
    currentDisplayYear: number;
}

export const ListView: React.FC<ListViewProps> = ({
    events,
    openEditModal,
    selectedCategory,
    currentDisplayMonth,
    currentDisplayYear,
}) => {
    // const listEvents = events; // Removed redundant variable
    const eventBaseStyle = "px-3 py-2 rounded-lg shadow-md shadow-black/40 flex items-center gap-3 text-sm font-medium text-white/95 cursor-pointer hover:opacity-90 transition-opacity";
    const { theme } = useTheme();

    // Memoize the grouped and sorted events
    const eventsGroupedAndSortedByDate = useMemo(() => {
        const grouped: { [key: string]: CalendarEvent[] } = {};
        events.forEach((event: CalendarEvent) => {
            const startDate = new Date(event.year, event.month, event.day);
            const startDateStr = formatDate(startDate, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            if (!grouped[startDateStr]) {
                grouped[startDateStr] = [];
            }
            grouped[startDateStr].push(event);
        });

        // Sort events within each day group
        Object.keys(grouped).forEach(dateStr => {
            grouped[dateStr].sort((a: CalendarEvent, b: CalendarEvent) =>
                (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
            );
        });

        return grouped;
    }, [events]); // Recalculate only when events array changes

    const groupedEventEntries = Object.entries(eventsGroupedAndSortedByDate);

    return (
        <div className="space-y-4 max-w-3xl mx-auto w-full">
            {groupedEventEntries.length === 0 && (
                <p className={cn('text-center py-10', theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground')}>No events found{selectedCategory !== 'all' ? ` for the '${selectedCategory}' category` : ''} starting from {MONTH_NAMES[currentDisplayMonth]} {currentDisplayYear}.</p>
            )}
            {groupedEventEntries.map(([dateStr, dayEvents]) => (
                <div key={dateStr}>
                    <h3 className={cn('text-lg font-semibold mb-2 sticky top-0 backdrop-blur-sm py-1 px-2 rounded -mx-2 z-10', theme === 'dark' ? 'text-teal-300 bg-gray-900/70' : 'text-primary bg-muted')}>{dateStr}</h3>
                    <div className="space-y-2">
                        {/* Events are already sorted */}
                        {dayEvents.map((event: CalendarEvent) => (
                            <div
                                key={event.id}
                                className={`${eventBaseStyle} bg-gradient-to-r ${event.colorGradient}`}
                                onClick={() => openEditModal(event)}
                                title={`${event.title} [${event.category}]`}
                            >
                                <div className="w-16 text-right font-mono text-xs opacity-80 flex-shrink-0">
                                    {event.startTime ? (
                                        <>
                                            <div>{event.startTime}</div>
                                            {event.endTime && <div className="opacity-70">to {event.endTime}</div>}
                                        </>
                                    ) : (
                                        <div>All Day</div>
                                    )}
                                    {event.durationDays > 1 && <div className="text-[10px] opacity-60">({event.durationDays}d)</div>}
                                </div>
                                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                    <span role="img" aria-label={event.title} className="text-base">{event.emoji}</span>
                                    <span className="truncate">{event.title}</span>
                                </div>
                                <span className="text-xs capitalize opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
                                    {event.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};