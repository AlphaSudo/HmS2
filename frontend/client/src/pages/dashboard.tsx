import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Sidebar } from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard, 
  Users, 
  Calendar,
  Activity,
  RefreshCw,
  DollarSign,
  Stethoscope,
  Building,
  Pill,
  Receipt,
  BarChart3,
  Target,
} from 'lucide-react';
import { Header } from "@/components/ui/Header";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useLocation } from 'wouter';
import { AdminQuickActions } from "@/components/ui/AdminQuickActions";
import { ChartGradients } from "@/utils/chart-gradients";
import { DashboardCard } from '@/components/ui/dashboard-card';

export default function Dashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { dashboardStats, isLoading, refreshData } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", 
        theme === 'dark' ? 'bg-[#040223] via-[#1a0a2e] to-[#040223]' : 'bg-background'
      )}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
          <span className="text-lg">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const appointmentStatusData = dashboardStats.appointmentStatusChart;
  const revenueData = dashboardStats.revenueChart;
  const departmentData = dashboardStats.departmentStats;
  const monthlyData = dashboardStats.monthlyAppointments;

  return (
    <div className={cn("flex h-screen overflow-hidden", theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground')}>
      <ChartGradients />
      <Sidebar isOpen={sidebarOpen} />
      <div className={cn("flex-1 flex flex-col overflow-y-auto", theme === 'dark' ? 'bg-[#05002E] ' : 'bg-background')}>
        <Header
          title={t('dashboard.title', 'Admin Dashboard')}
          icon={<LayoutDashboard className={cn('w-5 h-5', theme==='dark' ? 'text-white' : 'text-primary')} />}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="fixed top-24 right-8 z-40">
          <Button 
            onClick={refreshData}
            variant="outline" 
            size="sm"
            className="border-purple-500/50 hover:bg-purple-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <div className="flex-1 px-8 py-8 pt-24 overflow-y-auto custom-scrollbar">
          <div className={cn(
            "relative overflow-hidden rounded-2xl p-6 mb-8",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30'
              : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
          )}>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name || 'Admin'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's your hospital management overview for today
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">
            {/* Only show cards with real data */}
            {dashboardStats.totalAppointments > 0 && (
              <div onClick={() => setLocation('/admin/appointments')} className="cursor-pointer">
                <DashboardCard
                  title="Total Appointments"
                  value={dashboardStats.totalAppointments}
                  icon={<Calendar className="w-5 h-5 text-white" />}
                  gradient="blue"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> {`+${dashboardStats.appointmentGrowth}% this month`}
                    </div>
                  }
                />
              </div>
            )}
            {dashboardStats.totalPatients > 0 && (
              <div onClick={() => setLocation('/admin/patients')} className="cursor-pointer">
                <DashboardCard
                  title="Total Patients"
                  value={dashboardStats.totalPatients}
                  icon={<Users className="w-5 h-5 text-white" />}
                  gradient="orange"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> {`+${dashboardStats.patientGrowth}% this month`}
                    </div>
                  }
                />
              </div>
            )}
            {dashboardStats.totalDoctors > 0 && (
              <div onClick={() => setLocation('/admin/doctors')} className="cursor-pointer">
                <DashboardCard
                  title="Total Doctors"
                  value={dashboardStats.totalDoctors}
                  icon={<Stethoscope className="w-5 h-5 text-white" />}
                  gradient="purple"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> +2 this month
                    </div>
                  }
                />
              </div>
            )}
            {dashboardStats.totalRevenue > 0 && (
              <div onClick={() => setLocation('/admin/billing')} className="cursor-pointer">
                <DashboardCard
                  title="Total Revenue"
                  value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
                  icon={<DollarSign className="w-5 h-5 text-white" />}
                  gradient="blue"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> {`+${dashboardStats.revenueGrowth}% this month`}
                    </div>
                  }
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">
            {/* Only show cards with real data */}
            {dashboardStats.todayAppointments > 0 && (
              <div onClick={() => setLocation('/admin/appointments')} className="cursor-pointer">
                <DashboardCard
                  title="Today's Appointments"
                  value={dashboardStats.todayAppointments}
                  icon={<Calendar className="w-5 h-5 text-white" />}
                  gradient="teal"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> +5 from yesterday
                    </div>
                  }
                />
              </div>
            )}
            {dashboardStats.totalPrescriptions > 0 && (
              <div onClick={() => setLocation('/admin/prescriptions')} className="cursor-pointer">
                <DashboardCard
                  title="Active Prescriptions"
                  value={dashboardStats.totalPrescriptions}
                  icon={<Pill className="w-5 h-5 text-white" />}
                  gradient="green"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> +12 this week
                    </div>
                  }
                />
              </div>
            )}
            {dashboardStats.pendingPayments > 0 && (
              <div onClick={() => setLocation('/admin/billing')} className="cursor-pointer">
                <DashboardCard
                  title="Pending Payments"
                  value={`$${dashboardStats.pendingPayments.toLocaleString()}`}
                  icon={<Receipt className="w-5 h-5 text-white" />}
                  gradient="pink"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingDown className="text-red-400" /> -8% from last month
                    </div>
                  }
                />
              </div>
            )}
            {dashboardStats.totalInvoices > 0 && (
              <div onClick={() => setLocation('/admin/billing')} className="cursor-pointer">
                <DashboardCard
                  title="Total Invoices"
                  value={dashboardStats.totalInvoices}
                  icon={<Receipt className="w-5 h-5 text-white" />}
                  gradient="red"
                  extras={
                    <div className={cn("text-xs font-medium flex items-center gap-1 mt-1", theme === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
                      <TrendingUp className="text-emerald-400" /> +15.2% this month
                    </div>
                  }
                />
              </div>
            )}
          </div>

          {/* Only show charts if there's real appointment data */}
          {dashboardStats.totalAppointments > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className={cn(theme === 'dark' ? 'bg-[#05002E] border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Monthly Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="appointments" fill="#8884d8" />
                      <Bar dataKey="completed" fill="#82ca9d" />
                      <Bar dataKey="cancelled" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={cn(theme === 'dark' ? 'bg-[#05002E] border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Appointment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Only show revenue chart if there's real revenue data */}
          {dashboardStats.totalRevenue > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
              <Card className={cn(theme === 'dark' ? 'bg-[#05002E] border-purple-500/20' : 'bg-card border')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Revenue & Profit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="profit" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Only show recent activity if there's real data */}
          {(dashboardStats.recentAppointments.length > 0 || dashboardStats.recentPatients.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {dashboardStats.recentAppointments.length > 0 && (
                <Card className={cn(theme === 'dark' ? 'bg-[#05002E] border-purple-500/20' : 'bg-card border')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Recent Appointments
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation('/admin/appointments')}
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardStats.recentAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {appointment.patientName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-muted-foreground">{appointment.doctorName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{appointment.date}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {dashboardStats.recentPatients.length > 0 && (
                <Card className={cn(theme === 'dark' ? 'bg-[#05002E] border-purple-500/20' : 'bg-card border')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        Recent Patients
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation('/admin/patients')}
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardStats.recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">{patient.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{patient.status}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(patient.lastVisit).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Only show department overview if there's patient data */}
          {dashboardStats.totalPatients > 0 && (
            <Card className={cn(theme === 'dark' ? 'bg-[#05002E] border-purple-500/20' : 'bg-card border', 'mb-8')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-500" />
                  Department Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentData.map((dept) => (
                    <div key={dept.department} className="p-4 rounded-lg border">
                      <h3 className="font-semibold mb-2">{dept.department}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Patients</span>
                          <span className="font-medium">{dept.patients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Appointments</span>
                          <span className="font-medium">{dept.appointments}</span>
                        </div>
                        <Progress value={(dept.patients / dashboardStats.totalPatients) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <AdminQuickActions />
        </div>
      </div>
    </div>
  );
}
