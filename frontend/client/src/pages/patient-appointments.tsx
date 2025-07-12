import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/components/types/appointment";
import { initialAppointments } from "@/assets/data/initialAppointments";
import {
  getAppointmentsByPatientId,
  createAppointment,
  updateAppointment as updateAppointmentApi,
} from "@/services/appointmentService";
import { getPatientByUserId } from "@/services/patientService";
import { fromDTO, toCreateDTO, toUpdateDTO } from "@/utils/appointmentMapper";
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Calendar, Clock, User, MapPin, Heart, AlertCircle, CheckCircle, XCircle, X } from "lucide-react";
import { PatientHeader } from "@/components/ui/PatientHeader";

// helper moved inside component

export default function PatientAppointmentsPage() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookingData, setBookingData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments for current patient (revert to working version)
  useEffect(() => {
    (async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getAppointmentsByPatientId(user.id);
        const mapped = data.map(fromDTO);
        setAppointments(mapped);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const getFilteredAppointments = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(apt => 
          apt.date >= today && apt.status !== 'Cancelled' && apt.status !== 'Completed'
        );
      case 'past':
        return appointments.filter(apt => 
          apt.date < today || apt.status === 'Completed'
        );
      default:
        return appointments;
    }
  };

  const handleCancelRequest = async (appointmentId: number) => {
    try {
      await updateAppointmentApi(appointmentId, toUpdateDTO({ status: 'Cancelled' }));
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt));
      toast({
        title: "Cancellation Requested",
        description: "Your appointment has been cancelled.",
        className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to cancel appointment.",
        variant: "destructive",
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!bookingData.doctor || !bookingData.date || !bookingData.time || !bookingData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Ensure user is authenticated and derive a valid profile email
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please login to book an appointment.",
        variant: "destructive",
      });
      return;
    }
    const profileEmail = user.email && user.email.trim() !== ''
      ? user.email
      : `${user.name || 'patient'}@example.com`;

    const convertTo24 = (time12: string) => {
      const [time, modifier] = time12.split(" ");
      let [hours, minutes] = time.split(":");
      if (modifier === "PM" && hours !== "12") {
        hours = String(Number(hours) + 12);
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }
      return `${hours}:${minutes}:00`;
    };

    // Use the same logic as in the effect to get patient ID
    const appointmentPatientId = user.id;
    
    if (!appointmentPatientId) {
      toast({
        title: "Patient ID not available",
        description: "Please wait for patient data to load and try again.",
        variant: "destructive",
      });
      return;
    }

    const newAppointmentPartial: Partial<Appointment> = {
      patientName: user.name,
      patientId: Number(appointmentPatientId), // Use the correct patient ID
      doctor: bookingData.doctor.replace('Dr. ', '').split(' - ')[0],
      gender: 'MALE',
      date: bookingData.date,
      time: convertTo24(bookingData.time),
      phone: (user as any)?.phone || '+1-555-123-4567',
      issue: bookingData.reason,
      email: profileEmail,
      status: 'Scheduled',
      visitType: 'New Patient',
    };

    try {
      const createdDto = await createAppointment(toCreateDTO(newAppointmentPartial));
      const created = fromDTO(createdDto);
      setAppointments(prev => [...prev, created]);

      // success toast
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${bookingData.doctor} has been scheduled successfully.`,
        className: "bg-[#05002E] border border-[#5D0A72]/20 text-white",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to book appointment.",
        variant: "destructive",
      });
    }

    // Reset form and close modal
    setBookingData({
      doctor: '',
      date: '',
      time: '',
      reason: ''
    });
    setIsBookingModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    const color = (dark: string, light: string) => (theme === 'dark' ? dark : light);
    switch (status) {
      case 'Scheduled':
        return <Clock className={cn('w-4 h-4', color('text-blue-400', 'text-blue-600'))} />;
      case 'Completed':
        return <CheckCircle className={cn('w-4 h-4', color('text-green-400', 'text-green-600'))} />;
      case 'Cancelled':
        return <XCircle className={cn('w-4 h-4', color('text-red-400', 'text-red-600'))} />;
      default:
        return <AlertCircle className={cn('w-4 h-4', color('text-yellow-400', 'text-yellow-600'))} />;
    }
  };

  const getStatusColor = (status: string, theme: 'dark' | 'light') => {
    const isDark = theme==='dark';
    switch (status) {
      case 'Scheduled':
        return isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completed':
        return isDark ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-300';
      case 'Cancelled':
        return isDark ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-800 border-red-300';
      default:
        return isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getVisitTypeColor = (visitType: string, theme: 'dark' | 'light') => {
    const isDark = theme === 'dark';
    switch (visitType) {
      case 'New Patient':
        return isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Follow-Up':
        return isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return isDark ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] text-white' : 'bg-background text-foreground')}>
      <PatientSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')} p-8`}>
        <PatientHeader 
            title={t('patientAppointments.title', 'My Appointments')} 
            subtitle={t('patientAppointments.subtitle', 'View and manage your appointments')} 
            icon={<Calendar className="w-5 h-5 text-white" />} 
         />

        <div className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={cn('backdrop-blur-sm rounded-2xl p-6 border', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-card border')}>
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-700')}>{t('patientAppointments.stats.upcoming','Upcoming')}</p>
                <p className={cn("text-3xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                  {appointments.filter(apt => {
                    const today = new Date().toISOString().split('T')[0];
                    return apt.date >= today && apt.status === 'Scheduled';
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Calendar className={cn('w-6 h-6', theme==='dark' ? 'text-blue-400' : 'text-blue-600')} />
              </div>
            </div>
          </div>
          
          <div className={cn('backdrop-blur-sm rounded-2xl p-6 border', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-card border')}>
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-700')}>{t('patientAppointments.stats.completed','Completed')}</p>
                <p className={cn("text-3xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>
                  {appointments.filter(apt => apt.status === 'Completed').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className={cn('w-6 h-6', theme==='dark' ? 'text-green-400' : 'text-green-600')} />
              </div>
            </div>
          </div>
          
          <div className={cn('backdrop-blur-sm rounded-2xl p-6 border', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-card border')}>
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-700')}>{t('patientAppointments.stats.total','Total')}</p>
                <p className={cn("text-3xl font-bold", theme === 'dark' ? 'text-white' : 'text-foreground')}>{appointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Heart className={cn('w-6 h-6', theme==='dark' ? 'text-purple-400' : 'text-purple-600')} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={cn('flex gap-1 p-1 rounded-xl mb-8 backdrop-blur-sm border', theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-muted border')}>
          {(['upcoming', 'past', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-lg'
                  : cn(theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')
              }`}
            >
              {t(`patientAppointments.tabs.${tab}`,`${tab.charAt(0).toUpperCase()+tab.slice(1)} Appointments`)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className={cn('w-8 h-8 animate-spin', theme==='dark' ? 'text-purple-400' : 'text-purple-600')} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Loading appointments...</h3>
              <p className={cn('text-sm', theme==='dark' ? 'text-gray-400' : 'text-gray-700')}>
                Please wait while we fetch your appointments.
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className={cn('w-8 h-8', theme==='dark' ? 'text-gray-400' : 'text-gray-600')} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('patientAppointments.empty.noAppointments','No appointments found')}</h3>
              <p className={cn('mb-6', theme==='dark' ? 'text-gray-400' : 'text-gray-700')}>
                {activeTab === 'upcoming' && t('patientAppointments.empty.upcoming','You don\'t have any upcoming appointments.')}
                {activeTab === 'past' && t('patientAppointments.empty.past','You don\'t have any past appointments.')}
                {activeTab === 'all' && t('patientAppointments.empty.all','You don\'t have any appointments yet.')}
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:from-[#7C3AED] hover:to-[#0891B2] transition-all duration-200 font-medium inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {t('patientAppointments.buttons.bookNew','Book New Appointment')}
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={cn('backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300', theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-card border hover:bg-muted/50')}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Appointment Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Dr. {appointment.doctor}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status, theme)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className={cn("w-5 h-5", theme === 'dark' ? "text-blue-400" : "text-blue-600")} />
                        <span className={cn(theme === 'dark' ? "text-gray-300" : "text-gray-700")}>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock className={cn("w-5 h-5", theme === 'dark' ? "text-green-400" : "text-green-600")} />
                        <span className={cn(theme === 'dark' ? "text-gray-300" : "text-gray-700")}>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <MapPin className={cn("w-5 h-5", theme === 'dark' ? "text-purple-400" : "text-purple-600")} />
                        <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium border ${getVisitTypeColor(appointment.visitType, theme)}`}>
                          {appointment.visitType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <AlertCircle className={cn("w-5 h-5", theme === 'dark' ? "text-yellow-400" : "text-yellow-600")} />
                        <span className={cn(theme === 'dark' ? "text-gray-300" : "text-gray-700")}>{appointment.issue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {appointment.status === 'Scheduled' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleCancelRequest(appointment.id)}
                        className="px-6 py-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 font-medium"
                      >
                        {t('patientAppointments.buttons.requestCancellation','Request Cancellation')}
                      </button>
                      <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:from-[#7C3AED] hover:to-[#0891B2] transition-all duration-200 font-medium">
                        {t('patientAppointments.buttons.viewDetails','View Details')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          >
            <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Booking Modal */}
        {isBookingModalOpen && (
          <div className={cn('fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm', theme === 'dark' ? 'bg-black/50' : 'bg-black/30')}>
            <div className={cn('rounded-2xl p-6 w-full max-w-md border', theme === 'dark' ? 'bg-[#05002E] border-white/10 text-white' : 'bg-card border text-foreground')}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{t('patientAppointments.modal.title','Book New Appointment')}</h2>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className={cn('w-5 h-5', theme==='dark' ? 'text-gray-400' : 'text-gray-600')} />
                </button>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground')}>
                    {t('patientAppointments.modal.selectDoctor','Select Doctor')}
                  </label>
                  <select 
                    value={bookingData.doctor}
                    onChange={(e) => setBookingData({...bookingData, doctor: e.target.value})}
                    className={cn('w-full px-3 py-3 rounded-xl focus:ring-2 focus:border-transparent', theme === 'dark' ? 'bg-[#1a0a2e] border-white/20 text-white focus:ring-purple-500' : 'bg-input border border-input text-foreground focus:ring-primary')}
                  >
                    <option value=""> {t('patientAppointments.chooseDoctor','Choose a doctor')}</option>
                    <option value="Dr. Smith - Cardiology">Dr. Smith - Cardiology</option>
                    <option value="Dr. Johnson - Neurology">Dr. Johnson - Neurology</option>
                    <option value="Dr. Williams - Orthopedics">Dr. Williams - Orthopedics</option>
                    <option value="Dr. Davis - Dermatology">Dr. Davis - Dermatology</option>
                    <option value="Dr. Brown - Pediatrics">Dr. Brown - Pediatrics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('patientAppointments.modal.preferredDate','Preferred Date')}
                  </label>
                  <input 
                    type="date" 
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className={cn('w-full px-3 py-3 rounded-xl focus:ring-2 focus:border-transparent', theme === 'dark' ? 'bg-[#1a0a2e] border-white/20 text-white focus:ring-purple-500' : 'bg-input border-input text-foreground focus:ring-primary')}
                    style={{
                      colorScheme: theme === 'dark' ? 'dark' : 'light'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('patientAppointments.modal.preferredTime','Preferred Time')}
                  </label>
                  <select 
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className={cn('w-full px-3 py-3 rounded-xl focus:ring-2 focus:border-transparent', theme === 'dark' ? 'bg-[#1a0a2e] border-white/20 text-white focus:ring-purple-500' : 'bg-input border-input text-foreground focus:ring-primary')}
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">2:00 PM</option>
                    <option value="03:00 PM">3:00 PM</option>
                    <option value="04:00 PM">4:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('patientAppointments.modal.reason', 'Reason for Visit')} <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    className={cn('w-full px-3 py-3 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none', theme === 'dark' ? 'bg-[#1a0a2e] border-white/20 text-white' : 'bg-input border-input text-foreground')}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingData({
                        doctor: '',
                        date: '',
                        time: '',
                        reason: ''
                      });
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-200"
                  >
                    {t('common.cancel','Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:from-[#7C3AED] hover:to-[#0891B2] transition-all duration-200 font-medium"
                  >
                    {t('patientAppointments.buttons.book','Book Appointment')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 