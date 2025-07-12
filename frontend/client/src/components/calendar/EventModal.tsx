import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { CalendarEvent, EventCategory, eventCategories } from "@/types/calendar";
import { getDaysInMonth } from "@/utils/dateUtils";
import { MONTH_NAMES, EVENT_MODAL_COLOR_OPTIONS, EVENT_MODAL_COMMON_EMOJIS } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onEditEvent: (event: CalendarEvent) => void;
  eventToEdit?: CalendarEvent | null;
  initialDay: number | null; // Day of the month (1-31) or null
  currentMonth: number; // 0-indexed month
  currentYear: number;
}

export const EventModal = ({
  isOpen,
  onClose,
  onAddEvent,
  onEditEvent,
  eventToEdit,
  initialDay,
  currentMonth,
  currentYear
}: EventModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isEditing = !!eventToEdit;

  const [day, setDay] = useState(eventToEdit?.day ?? initialDay ?? 1);
  const [title, setTitle] = useState(eventToEdit?.title ?? '');
  const [emoji, setEmoji] = useState(eventToEdit?.emoji ?? '🎉');
  const [startTime, setStartTime] = useState(eventToEdit?.startTime ?? '');
  const [endTime, setEndTime] = useState(eventToEdit?.endTime ?? '');
  const [durationDays, setDurationDays] = useState(eventToEdit?.durationDays ?? 1);
  const [selectedColor, setSelectedColor] = useState(eventToEdit?.colorGradient ?? EVENT_MODAL_COLOR_OPTIONS[0].value);
  const [category, setCategory] = useState<EventCategory>(eventToEdit?.category as EventCategory ?? 'personal');

  // Update form fields if eventToEdit changes or when opening for adding
  useEffect(() => {
    if (isOpen) {
        const defaultDay = initialDay ?? new Date().getDate(); // Default to today if no initial day
        setDay(eventToEdit?.day ?? defaultDay);
        setTitle(eventToEdit?.title ?? '');
        setEmoji(eventToEdit?.emoji ?? '🎉');
        setStartTime(eventToEdit?.startTime ?? '');
        setEndTime(eventToEdit?.endTime ?? '');
        setDurationDays(eventToEdit?.durationDays ?? 1);
        setSelectedColor(eventToEdit?.colorGradient ?? EVENT_MODAL_COLOR_OPTIONS[0].value);
        setCategory(eventToEdit?.category as EventCategory ?? 'personal');
    }
  }, [eventToEdit, initialDay, isOpen, currentMonth, currentYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !day || day < 1 || day > maxDayInMonth || durationDays < 1) {
        console.error("Validation failed:", { title, day, maxDayInMonth, durationDays });
        // Add user feedback here (e.g., alert, form validation messages)
        return;
    }

    const eventData = {
        day: Number(day),
        month: currentMonth,
        year: currentYear,
        title,
        emoji,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        durationDays: Number(durationDays),
        colorGradient: selectedColor,
        category: category
       };

    if (isEditing && eventToEdit) {
        onEditEvent({ ...eventData, id: eventToEdit.id });
    } else {
        const eventToAdd: Omit<CalendarEvent, 'id'> = eventData;
        onAddEvent(eventToAdd);
    }
    onClose();
  };
  
    // Memoize the calculation for the maximum day in the month
  const maxDayInMonth = useMemo(() => {
    return getDaysInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  if (!isOpen) return null;

  // Shared classes based on theme
  const labelClass = cn("block mb-1 text-sm font-medium", theme === 'dark' ? 'text-teal-300' : 'text-muted-foreground');
  const inputClass = cn("w-full p-2 rounded outline-none", theme === 'dark' ? 'bg-gray-900/70 border border-teal-500/30 focus:ring-2 focus:ring-teal-500 text-white' : 'bg-input border border-border focus:ring-2 focus:ring-primary/50');
  const selectClass = cn(inputClass, "appearance-none capitalize");
  const modalCardClass = cn(
    "p-6 rounded-xl shadow-lg border w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin",
    theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-teal-500/50 text-white scrollbar-thumb-teal-400/50 scrollbar-track-transparent'
      : 'bg-card border-border text-foreground scrollbar-thumb-gray-400/50'
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={modalCardClass}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-5 text-center">{isEditing ? t('calendar.eventModal.editTitle') : t('calendar.eventModal.addTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           {/* Day Input */}
          <div className="mb-4">
            <label htmlFor="day" className={labelClass}>{t('calendar.eventModal.dayOf', { month: t(`months.${MONTH_NAMES[currentMonth].toLowerCase()}`), year: currentYear })}</label>
            <input
              type="number"
              id="day"
              min="1"
              max={maxDayInMonth}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              required
              className={inputClass}
            />
          </div>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className={labelClass}>{t('calendar.eventModal.eventTitle')}</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="startTime" className={labelClass}>{t('calendar.eventModal.startTime')}</label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={cn(inputClass, 'appearance-none', theme === 'dark' ? '' : 'text-foreground')}
                  style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                />
            </div>
            <div>
                <label htmlFor="endTime" className={labelClass}>{t('calendar.eventModal.endTime')}</label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={cn(inputClass, 'appearance-none', theme === 'dark' ? '' : 'text-foreground')}
                  style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                />
            </div>
          </div>
          {/* Duration Input */}
          <div>
            <label htmlFor="durationDays" className={labelClass}>{t('calendar.eventModal.durationDays')}</label>
            <input
              type="number"
              id="durationDays"
              min="1"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
              required
              className={inputClass}
            />
          </div>
          {/* Category Select */}
          <div>
            <label htmlFor="category" className={labelClass}>{t('calendar.eventModal.category')}</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              required
              className={selectClass}
             >
              {eventCategories.map((cat: EventCategory) => (
                <option key={cat} value={cat} className={cn('capitalize', theme === 'dark' ? 'bg-[#1a1440]' : 'bg-background') }>
                  {t(`calendar.categories.${cat}`)}
                </option>
              ))}
            </select>
          </div>
          {/* Emoji Select */}
           <div className="mb-4">
            <label htmlFor="emoji" className={labelClass}>{t('calendar.eventModal.emoji')}</label>
            <select
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className={cn(inputClass, 'appearance-none text-center')}
              style={{ fontSize: '1.5rem', colorScheme: theme === 'dark' ? 'dark' : 'light' }}
            >
              {EVENT_MODAL_COMMON_EMOJIS.map((em: string) => (
                <option key={em} value={em} className={theme === 'dark' ? 'bg-[#1a1440]' : 'bg-background'}>
                  {em}
                </option>
              ))}
            </select>
          </div>
          {/* Color Selection */}
          <div>
            <label className={cn('block mb-2 text-sm font-medium', theme === 'dark' ? 'text-teal-300' : 'text-muted-foreground')}>{t('calendar.eventModal.colorTheme')}</label>
            <div className="grid grid-cols-3 gap-2">
                {EVENT_MODAL_COLOR_OPTIONS.map((color: { id: string; value: string; name: string }) => (
                    <label key={color.value} className={cn('flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all',
                      selectedColor === color.value
                        ? (theme === 'dark' ? 'border-teal-500 bg-teal-900/50' : 'border-primary bg-primary/10')
                        : (theme === 'dark' ? 'border-transparent hover:border-white/30 bg-gray-700/60' : 'border-transparent hover:border-border bg-muted'))}>
                        <input
                            type="radio"
                            name="colorGradient"
                            value={color.value}
                            checked={selectedColor === color.value}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="hidden"
                        />
                        <span className={`block w-4 h-4 rounded-full bg-gradient-to-r ${color.value}`}></span>
                        <span className="text-xs">{t(`calendar.eventModal.colors.${color.id}`)}</span>
                    </label>
                ))}
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={cn('px-4 py-2 rounded transition-colors font-medium', theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-muted hover:bg-muted/80')}>{t('common.cancel')}</button>
            <button type="submit" className={cn('px-4 py-2 rounded bg-gradient-to-r hover:opacity-90 transition-opacity font-semibold', theme === 'dark' ? 'from-teal-500 to-green-600' : 'from-primary to-primary')}>
              {isEditing ? t('calendar.eventModal.saveChanges') : t('calendar.eventModal.addEvent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
