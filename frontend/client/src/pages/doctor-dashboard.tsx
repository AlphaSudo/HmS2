import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { DoctorSidebar } from "@/components/ui/DoctorSidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MoreVertical, 
  Phone, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard, 
  Users, 
  Calendar,
  Clock,
  Activity,
  Heart,
  RefreshCw,
  Eye,
  UserPlus,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  BarChart3,
  CalendarDays,
  Stethoscope,
  FileText,
  UserCheck
} from 'lucide-react';
import { DoctorHeader } from "@/components/ui/DoctorHeader";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { useLocation } from 'wouter';
import { QuickActions } from "@/components/ui/QuickActions";

const getStatusColor = (status: string, theme: 'dark' | 'light') => {
  const isDark = theme === 'dark';
  switch (status.toLowerCase()) {
    case 'completed':
    case 'stable':
    case 'active':
      return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'scheduled':
      return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'critical':
      return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
    case 'confirmed':
    case 'recovering':
      return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const StatCard = ({ title, value, change, icon, trend, onClick }: any) => {
  const { theme } = useTheme();
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-teal-500/20 hover:border-teal-400/40' 
          : 'bg-gradient-to-br from-white to-gray-50 border hover:border-teal-200 hover:shadow-teal-100/50'
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          theme === 'dark' ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          {value}
        </div>
        {change && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <p className={cn(
              "text-xs",
              trend === 'up' ? 'text-emerald-500' : 'text-red-500'
            )}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function DoctorDashboard() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { dashboardStats, doctorInfo, isLoading, refreshData } = useDoctorDashboard();

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", 
        theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900' : 'bg-background'
      )}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-500" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Completed', value: dashboardStats.monthlyStats.completed, color: '#10b981' },
    { name: 'Pending', value: dashboardStats.monthlyStats.pending, color: '#f59e0b' },
    { name: 'Cancelled', value: dashboardStats.monthlyStats.cancelled, color: '#ef4444' },
    { name: 'Rescheduled', value: dashboardStats.monthlyStats.rescheduled, color: '#3b82f6' },
  ];

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
      <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
        <DoctorHeader 
          title={t('doctorDashboard.title','Doctor Dashboard')} 
          subtitle={t('doctorDashboard.subtitle','Your central hub for patient management')} 
          icon={<LayoutDashboard className={cn('w-5 h-5', theme==='dark' ? 'text-white' : 'text-primary')} />}
          actions={
            <Button 
              onClick={refreshData}
              variant="outline" 
              size="sm"
              className="border-teal-500/50 hover:bg-teal-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          }
        />
        
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Welcome Banner */}
          <div className={cn(
            "relative overflow-hidden rounded-2xl p-6",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30'
              : 'bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200'
          )}>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, Dr. {doctorInfo?.firstName || user?.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your practice today
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl" />
          </div>

          {/* Top Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Today's Appointments"
              value={dashboardStats.todayAppointments}
              change="+12% from yesterday"
              trend="up"
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => setLocation('/doctor/appointments')}
            />
            <StatCard
              title="Total Patients"
              value={dashboardStats.totalPatients}
              change={`+${dashboardStats.newPatients} this month`}
              trend="up"
              icon={<Users className="w-5 h-5" />}
              onClick={() => setLocation('/doctor/patients')}
            />
            <StatCard
              title="Weekly Appointments"
              value={dashboardStats.weeklyAppointments}
              change="+8% from last week"
              trend="up"
              icon={<CalendarDays className="w-5 h-5" />}
              onClick={() => setLocation('/doctor/calendar')}
            />
            <StatCard
              title="Avg. Consultation"
              value={dashboardStats.avgConsultationTime}
              change="2m faster than avg"
              trend="up"
              icon={<Timer className="w-5 h-5" />}
              onClick={() => setLocation('/doctor/tasks')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Performance */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-teal-500/20' : 'bg-card border')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-teal-500" />
                      Weekly Performance
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setLocation('/doctor/appointments')}>
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardStats.weeklyPerformance}>
                        <defs>
                          <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                        <Tooltip
                          contentStyle={{
                            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            border: `1px solid ${theme === 'dark' ? 'rgba(45, 212, 191, 0.2)' : 'rgba(45, 212, 191, 0.3)'}`,
                            borderRadius: '0.5rem',
                            backdropFilter: 'blur(8px)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Patients"
                          stroke="#2dd4bf"
                          fillOpacity={1}
                          fill="url(#colorPatients)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="Consultations"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorConsultations)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Patients */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-teal-500/20' : 'bg-card border')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-teal-500" />
                      Recent Patients
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setLocation('/doctor/patients')}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardStats.recentPatients.map((patient, index) => (
                      <div 
                        key={patient.id} 
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setLocation(`/doctor/patient-profile`)}
                      >
                        <Avatar className="h-12 w-12 border-2 border-teal-500/30">
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{patient.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getStatusColor(patient.status, theme)}>
                              {patient.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {patient.gender}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Doctor Profile Card */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-teal-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-500" />
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 border-4 border-teal-500">
                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-lg">
                      {doctorInfo?.firstName?.[0]}{doctorInfo?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mt-4">
                    Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}
                  </h3>
                  <p className="text-muted-foreground">{doctorInfo?.specialization?.replace(/_/g, ' ')}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span>{doctorInfo?.experienceYears} years exp.</span>
                    <span>•</span>
                    <span>License: {doctorInfo?.licenseNumber}</span>
                  </div>
                  <Button 
                    className="mt-4 w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                    onClick={() => setLocation('/doctor/profile')}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Statistics */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-teal-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-500" />
                    Monthly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-teal-500/20' : 'bg-card border')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-teal-500" />
                      Today's Schedule
                    </CardTitle>
                    <Badge variant="outline" className="border-teal-500/50 text-teal-600">
                      {dashboardStats.todaySchedule.length} appointments
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {dashboardStats.todaySchedule.length > 0 ? (
                      dashboardStats.todaySchedule.map((apt, index) => (
                        <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="w-1 bg-gradient-to-b from-teal-500 to-blue-500 h-12 rounded-full" />
                          <div className="flex-1">
                            <p className="font-medium">{apt.time}</p>
                            <p className="text-sm text-muted-foreground">{apt.patient}</p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(apt.status, theme)}>
                            {apt.type}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No appointments scheduled for today</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-teal-500/50 hover:bg-teal-500/10 hover:border-teal-500"
                    onClick={() => setLocation('/doctor/appointments')}
                  >
                    View All Appointments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions Section */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
} 