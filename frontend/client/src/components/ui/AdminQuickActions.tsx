import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  Calendar, 
  Users, 
  FileText, 
  CreditCard, 
  UserPlus,
  CalendarPlus,
  Settings,
  Activity,
  BarChart3,
  Shield,
  Database,
  Building,
  Stethoscope,
  Pill,
  Receipt,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface AdminQuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
  urgent?: boolean;
}

export function AdminQuickActions() {
  const [location, setLocation] = useLocation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const quickActions: AdminQuickAction[] = [
    {
      title: 'Appointments',
      description: 'Manage all appointments',
      icon: <Calendar className="w-5 h-5" />,
      path: '/admin/appointments',
      color: 'from-blue-500 to-blue-600',
      badge: 'Active'
    },
    {
      title: 'Doctors',
      description: 'Manage doctors and staff',
      icon: <Stethoscope className="w-5 h-5" />,
      path: '/admin/doctors',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Patients',
      description: 'Manage patient records',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/patients',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Prescriptions',
      description: 'View and manage prescriptions',
      icon: <Pill className="w-5 h-5" />,
      path: '/admin/prescriptions',
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Billing & Invoices',
      description: 'Financial management',
      icon: <Receipt className="w-5 h-5" />,
      path: '/admin/billing',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Analytics',
      description: 'View system analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/admin/analytics',
      color: 'from-teal-500 to-teal-600',
      badge: 'New'
    }
  ];

  const managementTools = [
    {
      title: 'Add Doctor',
      path: '/admin/doctors',
      icon: <UserPlus className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Add Patient',
      path: '/admin/patient-profile',
      icon: <UserCheck className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'System Settings',
      path: '/admin/settings',
      icon: <Settings className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const systemStats = [
    {
      title: 'System Health',
      value: '98.5%',
      trend: 'up',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Server Load',
      value: '45%',
      trend: 'stable',
      icon: <Database className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '234',
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Quick Actions */}
      <Card className={cn(theme === 'dark' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20' : 'bg-card border')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Admin Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                size="lg"
                className={cn(
                  'h-auto p-4 justify-start border-2 transition-all duration-200 hover:scale-105',
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50 hover:bg-gray-800' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  location === action.path && 'border-purple-500 bg-purple-50'
                )}
                onClick={() => setLocation(action.path)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    'p-2 rounded-lg',
                    `bg-gradient-to-r ${action.color}`,
                    'text-white'
                  )}>
                    {action.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{action.title}</span>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      {action.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Tools */}
      <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-card border')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            Management Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {managementTools.map((tool) => (
              <Button
                key={tool.title}
                variant="ghost"
                size="sm"
                className="h-auto p-4 justify-start hover:bg-gray-50"
                onClick={() => setLocation(tool.path)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', tool.color)}>
                    {tool.icon}
                  </div>
                  <span className="font-medium">{tool.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-card border')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemStats.map((stat) => (
              <div key={stat.title} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg bg-gray-100', stat.color)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="font-medium">{stat.title}</p>
                    <p className="text-sm text-muted-foreground">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={cn('w-4 h-4', stat.color)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 