import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MoreVertical, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard, 
  Calendar,
  PillBottle,
  Activity,
  Heart,
  RefreshCw,
  Eye,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText,
  ArrowRight,
  Stethoscope,
  Brain,
  Shield,
  Zap,
  Star,
  Target,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { PatientHeader } from "@/components/ui/PatientHeader";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";
import { useLocation } from 'wouter';
import { PatientQuickActions } from "@/components/ui/PatientQuickActions";

const getStatusColor = (status: string, theme: 'dark' | 'light') => {
  const isDark = theme === 'dark';
  switch (status.toLowerCase()) {
    case 'dispensed':
    case 'completed':
    case 'paid':
      return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'scheduled':
      return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'overdue':
      return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
    case 'partially_dispensed':
    case 'confirmed':
      return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const StatCard = ({ title, value, change, icon, trend, onClick, subtitle }: any) => {
  const { theme } = useTheme();
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/20 hover:border-purple-400/40' 
          : 'bg-gradient-to-br from-white to-gray-50 border hover:border-purple-200 hover:shadow-purple-100/50'
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
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

const HealthScoreCard = ({ score, theme }: { score: number, theme: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{ value: score }, { value: 100 - score }]}
            dataKey="value"
            innerRadius={40}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
            cornerRadius={8}
          >
            <Cell fill={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} />
            <Cell fill={theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB'} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold", getScoreColor(score))}>{score}</span>
        <span className="text-xs text-muted-foreground">{getScoreDescription(score)}</span>
      </div>
    </div>
  );
};

export default function PatientDashboard() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { dashboardStats, patientProfile, isLoading, refreshData } = usePatientDashboard();

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", 
        theme === 'dark' ? 'bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728]' : 'bg-background'
      )}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
          <span className="text-lg">Loading your health dashboard...</span>
        </div>
      </div>
    );
  }

  const appointmentStatusData = dashboardStats.appointmentHistory.map(item => ({
    name: item.name,
    'Completed': item.completed,
    'Scheduled': item.scheduled,
    'Cancelled': item.cancelled
  }));

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] text-white' : 'bg-background text-foreground')}>
      <PatientSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}`}>
        <PatientHeader 
          title={t('patientDashboard.title','My Health Dashboard')} 
          subtitle={t('patientDashboard.subtitle','Your personal health overview and insights')} 
          icon={<LayoutDashboard className={cn('w-5 h-5', theme==='dark' ? 'text-white' : 'text-primary')} />}
          actions={
            <Button 
              onClick={refreshData}
              variant="outline" 
              size="sm"
              className="border-purple-500/50 hover:bg-purple-500/10"
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
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30'
              : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
          )}>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}! 🌟
              </h1>
              <p className="text-muted-foreground">
                {dashboardStats.nextAppointment 
                  ? `Your next appointment is on ${new Date(dashboardStats.nextAppointment.date).toLocaleDateString()} at ${dashboardStats.nextAppointment.time}`
                  : "You're all caught up! Schedule your next checkup when ready."
                }
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
          </div>

          {/* Health Score & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Health Score Card */}
            <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20 col-span-1' : 'bg-card border col-span-1')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <HealthScoreCard score={dashboardStats.healthScore} theme={theme} />
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Based on appointments and medication compliance
                </p>
                <Button variant="ghost" size="sm" className="mt-2 text-purple-500 hover:text-purple-600">
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Upcoming Appointments"
                value={dashboardStats.upcomingAppointments}
                subtitle={`${dashboardStats.totalAppointments} total appointments`}
                change="Next in 3 days"
                trend="up"
                icon={<Calendar className="w-5 h-5" />}
                onClick={() => setLocation('/patient/appointments')}
              />
              <StatCard
                title="Active Prescriptions"
                value={dashboardStats.activePrescriptions}
                subtitle={`${dashboardStats.totalPrescriptions} total prescriptions`}
                change="2 expiring soon"
                trend="down"
                icon={<PillBottle className="w-5 h-5" />}
                onClick={() => setLocation('/patient/prescriptions')}
              />
              <StatCard
                title="Outstanding Balance"
                value={`$${dashboardStats.outstandingBalance.toFixed(2)}`}
                subtitle={`$${dashboardStats.totalPaid.toFixed(2)} paid this year`}
                change={dashboardStats.outstandingBalance > 0 ? "Payment due" : "All paid up!"}
                trend={dashboardStats.outstandingBalance > 0 ? "down" : "up"}
                icon={<DollarSign className="w-5 h-5" />}
                onClick={() => setLocation('/patient/billing')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appointment History */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      Appointment History (6 Months)
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setLocation('/patient/appointments')}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={appointmentStatusData}>
                        <defs>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
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
                            border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)'}`,
                            borderRadius: '0.5rem',
                            backdropFilter: 'blur(8px)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Completed"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorCompleted)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="Scheduled"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#colorScheduled)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Trend */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-500" />
                      Billing Trend (6 Months)
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setLocation('/patient/billing')}>
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardStats.billingTrend}>
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
                            border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)'}`,
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="billed" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          name="Billed"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="paid" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Paid"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Patient Profile Card */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-purple-500" />
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 border-4 border-purple-500">
                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold mt-3">{user?.name}</h3>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 w-full text-sm">
                    {dashboardStats.quickStats.age && (
                      <div>
                        <p className="text-muted-foreground">Age</p>
                        <p className="font-semibold">{dashboardStats.quickStats.age}</p>
                      </div>
                    )}
                    {dashboardStats.quickStats.bloodGroup && (
                      <div>
                        <p className="text-muted-foreground">Blood Type</p>
                        <p className="font-semibold">{dashboardStats.quickStats.bloodGroup}</p>
                      </div>
                    )}
                    {dashboardStats.quickStats.bmi && (
                      <div>
                        <p className="text-muted-foreground">BMI</p>
                        <p className="font-semibold">{dashboardStats.quickStats.bmi}</p>
                      </div>
                    )}
                    {dashboardStats.quickStats.lastVisit && (
                      <div>
                        <p className="text-muted-foreground">Last Visit</p>
                        <p className="font-semibold">{dashboardStats.quickStats.lastVisit}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Prescriptions */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <PillBottle className="w-5 h-5 text-purple-500" />
                      Recent Prescriptions
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setLocation('/patient/prescriptions')}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {dashboardStats.recentPrescriptions.length > 0 ? (
                      dashboardStats.recentPrescriptions.map((prescription, index) => (
                        <div key={prescription.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="w-1 bg-gradient-to-b from-purple-500 to-blue-500 h-12 rounded-full" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{prescription.title}</p>
                            <p className="text-xs text-muted-foreground">{prescription.doctor}</p>
                            <p className="text-xs text-muted-foreground">{new Date(prescription.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(prescription.status, theme)}>
                            {prescription.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <PillBottle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No prescriptions found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Health Metrics */}
              <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-500" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Checkup</span>
                      <span className="text-sm font-medium">{dashboardStats.healthMetrics.lastCheckup}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vital Signs</span>
                      <span className="text-sm font-medium">{dashboardStats.healthMetrics.vitalSigns} recorded</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lab Results</span>
                      <span className="text-sm font-medium">{dashboardStats.healthMetrics.labResults} available</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Known Allergies</span>
                      <span className="text-sm font-medium">{dashboardStats.healthMetrics.allergies}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500"
                    onClick={() => setLocation('/patient/medical-records')}
                  >
                    View Full Records
                  </Button>
                </CardContent>
              </Card>

              {/* Next Appointment */}
              {dashboardStats.nextAppointment && (
                <Card className={cn(theme === 'dark' ? 'bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      Next Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">{dashboardStats.nextAppointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{dashboardStats.nextAppointment.type}</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{new Date(dashboardStats.nextAppointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{dashboardStats.nextAppointment.time}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => setLocation('/patient/appointments')}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Actions Section */}
          <PatientQuickActions />
        </main>
      </div>
    </div>
  );
} 