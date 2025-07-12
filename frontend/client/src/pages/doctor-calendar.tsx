import React, { useState, useEffect, useMemo } from "react";
import { DoctorSidebar } from "../components/ui/DoctorSidebar";
import { DoctorHeader } from "../components/ui/DoctorHeader";
import { AppWindowIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent, EventCategory, eventCategories } from "../types/calendar";
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    addDays,
    getWeekStartDate,
    formatDate,
    getEventDateRange,
    normalizeDate
} from "../utils/dateUtils";
import { MONTH_NAMES } from "../utils/constants";
import { EventModal } from "../components/calendar/EventModal";
// Import the view components
import { MonthView } from "../components/calendar/views/MonthView";
import { WeekView } from "../components/calendar/views/WeekView";
import { DayView } from "../components/calendar/views/DayView";
import { ListView } from "../components/calendar/views/ListView";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getAppointmentsByDoctorId } from "@/services/appointmentService";
import { fromDTO } from "@/utils/appointmentMapper";
import { Appointment } from "@/components/types/appointment";
import { useToast } from "@/hooks/use-toast";

// --- Main Calendar Page Component ---
export default function DoctorCalendarPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  useLanguage();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null); // Store full date for modal context
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const today = useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
  }, []);

  // State for the *currently displayed* period start date or reference date
  const [currentDate, setCurrentDate] = useState(today);

  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Helper function to convert appointments to calendar events
  const convertAppointmentToCalendarEvent = (appointment: Appointment): CalendarEvent => {
    const appointmentDate = new Date(appointment.date);
    const emoji = appointment.status === 'Completed' ? '✅' : 
                  appointment.status === 'Cancelled' ? '❌' : '🏥';
    const colorGradient = appointment.status === 'Completed' ? 'from-green-500 to-emerald-600' :
                         appointment.status === 'Cancelled' ? 'from-red-500 to-rose-600' :
                         'from-blue-500 to-indigo-600';
    
    return {
      id: `appointment-${appointment.id}`,
      day: appointmentDate.getDate(),
      month: appointmentDate.getMonth(),
      year: appointmentDate.getFullYear(),
      title: `${appointment.patientName} - ${appointment.issue}`,
      emoji,
      startTime: appointment.time,
      durationDays: 1,
      colorGradient,
      category: 'appointments',
    };
  };

  // Initial events data (ensure month is 0-indexed)
  const [staticEvents, setStaticEvents] = useState<CalendarEvent[]>([
     { id: '1', day: 5, month: 4, year: 2025, title: 'George Bday', emoji: '🎉', durationDays: 1, colorGradient: 'from-orange-500 to-red-600', category: 'friends' },
     { id: '2', day: 6, month: 4, year: 2025, title: 'Meeting', emoji: '💼', startTime: "09:00", endTime: "10:30", durationDays: 1, colorGradient: 'from-red-500 to-pink-600', category: 'work' },
     { id: '3', day: 7, month: 4, year: 2025, title: 'Workshop', emoji: '💡', startTime: "13:00", durationDays: 2, colorGradient: 'from-red-500 to-pink-600', category: 'work' },
     { id: '4', day: 16, month: 4, year: 2025, title: '7:30 Berlin', emoji: '✈️', startTime: "07:30", durationDays: 1, colorGradient: 'from-cyan-500 to-blue-600', category: 'travel' },
     { id: '5', day: 19, month: 4, year: 2025, title: 'Return Flight', emoji: '✈️', startTime: "18:00", durationDays: 1, colorGradient: 'from-cyan-500 to-blue-600', category: 'travel' },
     { id: '6', day: 23, month: 4, year: 2025, title: 'Gym', emoji: '💪', durationDays: 1, colorGradient: 'from-purple-600 to-pink-600', category: 'personal' },
     { id: '7', day: 10, month: 5, year: 2025, title: 'Project Due', emoji: '📌', durationDays: 1, colorGradient: 'from-yellow-500 to-amber-600', category: 'important' },
     { id: '8', day: 28, month: 4, year: 2025, title: 'Conference', emoji: '📅', durationDays: 3, colorGradient: 'from-blue-600 to-indigo-700', category: 'work' },
  ]);

  // Combined events (static + appointments)
  const events = useMemo(() => {
    const appointmentEvents = appointments.map(convertAppointmentToCalendarEvent);
    return [...staticEvents, ...appointmentEvents];
  }, [staticEvents, appointments]);

  // --- Derived Date Values based on currentDate ---
  const currentDisplayYear = currentDate.getFullYear();
  const currentDisplayMonth = currentDate.getMonth(); // 0-indexed

  const currentWeekStartDate = useMemo(() => getWeekStartDate(currentDate), [currentDate]);

  // Fetch appointments for the logged-in doctor
  useEffect(() => {
    // If no user or user is not a doctor, don't fetch appointments
    if (!user || user.role !== 'doctor') {
      setAppointmentsLoading(false);
      setAppointments([]);
      return;
    }

    setAppointmentsLoading(true);

    (async () => {
      try {
        // Fetch appointments for the logged-in doctor by their ID
        const doctorAppointments = await getAppointmentsByDoctorId(user.id);
        setAppointments(doctorAppointments.map(fromDTO));
      } catch (error) {
        console.error("Failed to fetch appointments for calendar", error);
        toast({
          title: "Error",
          description: "Failed to load appointments for calendar. Please try again.",
          variant: "destructive",
        });
        setAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    })();
  }, [user, toast]);

  // --- Event Handlers (Add, Edit) ---
  const handleAddEvent = (newEventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
        ...newEventData,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Simple unique ID
    };
    setStaticEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setStaticEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setEditingEvent(null);
  };

  // --- Navigation Handlers ---
  const handlePrevious = () => {
    setCurrentDate(prevDate => {
        switch (currentView) {
            case 'month':
                return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
            case 'week':
                return addDays(prevDate, -7);
            case 'day':
                return addDays(prevDate, -1);
            case 'list': // Example: Go back one month for list view
                 return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
            default:
                return prevDate;
        }
    });
  };

  const handleNext = () => {
     setCurrentDate(prevDate => {
        switch (currentView) {
            case 'month':
                return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
            case 'week':
                return addDays(prevDate, 7);
            case 'day':
                return addDays(prevDate, 1);
            case 'list': // Example: Go forward one month for list view
                 return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
            default:
                return prevDate;
        }
    });
  };

  const goToToday = () => {
    setCurrentDate(today);
  };

  // --- Modal Control ---
  const openAddModal = (date: Date) => {
    setSelectedDateForModal(date); // Store the full date
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    // Set the context date for the modal based on the event being edited
    setSelectedDateForModal(new Date(event.year, event.month, event.day));
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDateForModal(null);
  };

  // --- Filtering Logic ---
  const categoryFilteredEvents = useMemo(() => events.filter(event =>
    selectedCategory === 'all' || event.category === selectedCategory
  ), [events, selectedCategory]);

  const eventsForView = useMemo(() => {
    switch (currentView) {
      case 'month': {
        const monthStart = normalizeDate(new Date(currentDisplayYear, currentDisplayMonth, 1));
        const monthEnd = normalizeDate(new Date(currentDisplayYear, currentDisplayMonth + 1, 1));
        return categoryFilteredEvents.filter(event => {
          const [eventStart, eventEnd] = getEventDateRange(event);
          return eventStart < monthEnd && eventEnd > monthStart;
        });
      }
      case 'week': {
        const weekStart = currentWeekStartDate;
        const weekEnd = addDays(weekStart, 7);
        return categoryFilteredEvents.filter(event => {
          const [eventStart, eventEnd] = getEventDateRange(event);
          return eventStart < weekEnd && eventEnd > weekStart;
        });
      }
      case 'day': {
        const dayStart = normalizeDate(currentDate);
        const dayEnd = addDays(dayStart, 1);
        return categoryFilteredEvents.filter(event => {
          const [eventStart, eventEnd] = getEventDateRange(event);
          return eventStart < dayEnd && eventEnd > dayStart;
        });
      }
      case 'list': {
        const listStartDate = normalizeDate(new Date(currentDisplayYear, currentDisplayMonth, 1));
        return categoryFilteredEvents
            .filter(event => {
                const [eventStart, eventEnd] = getEventDateRange(event);
                return eventStart >= listStartDate;
            })
            .sort((a, b) => {
                 const dateA = new Date(a.year, a.month, a.day).getTime();
                 const dateB = new Date(b.year, b.month, b.day).getTime();
                 return dateA - dateB || (a.startTime || "").localeCompare(b.startTime || "");
            });
      }
      default:
        return [];
    }
  }, [categoryFilteredEvents, currentView, currentDate, currentDisplayYear, currentDisplayMonth, currentWeekStartDate]);


  // --- Helper variables for rendering ---
  const isTodayInView = useMemo(() => {
    const todayTime = today.getTime();
    switch (currentView) {
        case 'month':
            return currentDisplayYear === today.getFullYear() && currentDisplayMonth === today.getMonth();
        case 'week':
            const weekStart = currentWeekStartDate;
            const weekEnd = addDays(weekStart, 7);
            return todayTime >= weekStart.getTime() && todayTime < weekEnd.getTime();
        case 'day':
            return currentDate.getTime() === todayTime;
        case 'list':
             const listStartDate = new Date(currentDisplayYear, currentDisplayMonth, 1);
             listStartDate.setHours(0,0,0,0);
             return todayTime >= listStartDate.getTime();
        default:
            return false;
    }
  }, [currentView, currentDate, currentDisplayYear, currentDisplayMonth, currentWeekStartDate, today]);


  // --- Main Return ---
  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
      <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn('flex-1 flex flex-col transition-all duration-300', isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64'))}>
        <DoctorHeader
            title={t('calendar.title')}
            icon={<AppWindowIcon className="h-8 w-8 text-teal-400" />}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-4 md:p-8 pt-4 md:pt-8 flex flex-col items-center justify-start overflow-y-auto">
          <div className={cn(`w-full max-w-7xl rounded-3xl shadow-2xl p-4 md:p-8 relative`, theme === 'dark' ? 'shadow-teal-500/30 border border-teal-500/50 bg-gray-800/60 backdrop-blur-xl' : 'bg-card border')}>

            {/* --- Top Controls --- */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2 md:px-4">
                <button className={`order-1 px-4 py-2 rounded-xl text-white font-semibold text-sm md:text-base border-2 hover:scale-105 transition-all duration-300 ease-in-out ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-green-600 shadow-lg shadow-teal-500/40 border-white/30 hover:shadow-xl hover:shadow-teal-400/50' : 'bg-primary hover:bg-primary/90 border-transparent'}`}
                    onClick={() => openAddModal(currentDate)}
                >
                  {t('calendar.addEvent')}
                </button>
                <button
                    onClick={goToToday}
                    disabled={isTodayInView && currentView !== 'list'}
                    className={`order-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                        isTodayInView && currentView !== 'list'
                        ? (theme === 'dark' ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm shadow-teal-500/30 cursor-default' : 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/30 cursor-default')
                        : (theme === 'dark' ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30' : 'bg-muted border-border text-muted-foreground hover:bg-muted/80')
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {t('calendar.today')}
                </button>
                <div className={`order-3 flex items-center gap-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-900/60 border-white/20' : 'bg-muted border'}`}>
                    {(['month', 'week', 'day', 'list'] as const).map(view => (
                        <button
                            key={view}
                            onClick={() => setCurrentView(view)}
                            className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium capitalize transition-colors ${
                                currentView === view
                                ? (theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-inner shadow-black/30' : 'bg-primary text-primary-foreground')
                                : (theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-muted-foreground/80')
                            }`}
                        >
                            {t(`calendar.view.${view}`)}
                        </button>
                    ))}
                </div>
                <div className="order-4 md:order-last">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium capitalize transition-colors focus:ring-2 outline-none ${theme === 'dark' ? 'bg-gray-900/60 border-white/20 text-gray-300 focus:ring-teal-500 hover:bg-white/10' : 'bg-input border-border text-foreground focus:ring-primary hover:bg-muted'}`}
                    >
                        <option value="all" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-background'}`}>{t('calendar.categories.all')}</option>
                        <option value="appointments" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-background'} capitalize`}>
                            {t('calendar.categories.appointments', 'Appointments')}
                        </option>
                        {eventCategories.map(cat => (
                            <option key={cat} value={cat} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-background'} capitalize`}>
                                {t(`calendar.categories.${cat}`)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* --- Period Navigation and Title --- */}
            <div className="flex justify-between items-center mb-4 md:mb-6 px-1 md:px-4">
               <button
                 onClick={handlePrevious}
                 className={`p-1 md:p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-teal-300 hover:text-green-400' : 'hover:bg-muted text-primary'}`}
                 aria-label={t('calendar.previousPeriod')}
               >
                 <ChevronLeft size={28} />
               </button>
               <h1 className={`text-center text-xl md:text-2xl lg:text-3xl font-bold py-1 mx-2 flex-grow ${theme === 'dark' ? 'bg-gradient-to-r from-teal-400 via-green-300 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_1px_5px_rgba(0,255,255,0.4)]' : 'text-foreground'}`}>
                    {currentView === 'month' && `${t(`months.${MONTH_NAMES[currentDisplayMonth].toLowerCase()}`)} ${currentDisplayYear}`}
                    {currentView === 'week' && `${t('calendar.weekOf')} ${formatDate(currentWeekStartDate, { month: 'short', day: 'numeric' })}`}
                    {currentView === 'day' && `${formatDate(currentDate, { weekday: 'long', month: 'long', day: 'numeric' })}`}
                    {currentView === 'list' && `${t('calendar.events')} ${selectedCategory !== 'all' ? `(${t(`calendar.categories.${selectedCategory}`)})` : ''} from ${t(`months.${MONTH_NAMES[currentDisplayMonth].toLowerCase()}`)} ${currentDisplayYear}`}
                </h1>
               <button
                 onClick={handleNext}
                 className={`p-1 md:p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-teal-300 hover:text-green-400' : 'hover:bg-muted text-primary'}`}
                 aria-label={t('calendar.nextPeriod')}
               >
                 <ChevronRight size={28} />
               </button>
            </div>

            {/* --- Main View Area --- */}
            <div className="mt-4">
                {currentView === 'month' && (
                    <MonthView
                        year={currentDisplayYear}
                        month={currentDisplayMonth}
                        today={today}
                        events={eventsForView}
                        openAddModal={openAddModal}
                        openEditModal={openEditModal}
                        getDaysInMonth={getDaysInMonth} // Pass utility function
                        getFirstDayOfMonth={getFirstDayOfMonth} // Pass utility function
                    />
                )}
                {currentView === 'week' && (
                    <WeekView
                        weekStartDate={currentWeekStartDate}
                        today={today}
                        events={eventsForView}
                        openAddModal={openAddModal}
                        openEditModal={openEditModal}
                    />
                )}
                {currentView === 'day' && (
                    <DayView
                        currentDate={currentDate}
                        today={today}
                        events={eventsForView}
                        openAddModal={openAddModal}
                        openEditModal={openEditModal}
                    />
                )}
                {currentView === 'list' && (
                    <ListView
                        events={eventsForView}
                        openEditModal={openEditModal}
                        selectedCategory={selectedCategory}
                        currentDisplayMonth={currentDisplayMonth}
                        currentDisplayYear={currentDisplayYear}
                    />
                )}
            </div>

          </div> {/* End Calendar Container */}
        </main>
      </div> {/* End flex-1 flex flex-col */}
      {/* Render the combined modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        eventToEdit={editingEvent}
        initialDay={selectedDateForModal ? selectedDateForModal.getDate() : null}
        currentMonth={selectedDateForModal ? selectedDateForModal.getMonth() : currentDate.getMonth()}
        currentYear={selectedDateForModal ? selectedDateForModal.getFullYear() : currentDate.getFullYear()}
      />
    </div> // End flex min-h-screen
  );
} 