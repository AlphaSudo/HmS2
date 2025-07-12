import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  Calendar, 
  Users, 
  FileText, 
  Stethoscope, 
  Clock, 
  UserPlus,
  CalendarPlus,
  MessageSquare,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
  urgent?: boolean;
}

export function QuickActions() {
  const [location, setLocation] = useLocation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const quickActions: QuickAction[] = [
    {
      title: 'Schedule Appointment',
      description: 'Book a new patient appointment',
      icon: <CalendarPlus className="w-5 h-5" />,
      path: '/doctor/appointments',
      color: 'from-blue-500 to-blue-600',
      badge: 'Quick'
    },
    {
      title: 'View Patients',
      description: 'Manage your patient list',
      icon: <Users className="w-5 h-5" />,
      path: '/doctor/patients',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Prescriptions',
      description: 'Write and manage prescriptions',
      icon: <FileText className="w-5 h-5" />,
      path: '/doctor/prescriptions',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Calendar View',
      description: 'See your schedule overview',
      icon: <Calendar className="w-5 h-5" />,
      path: '/doctor/calendar',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Patient Records',
      description: 'Access patient medical history',
      icon: <Activity className="w-5 h-5" />,
      path: '/doctor/patients',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'My Tasks',
      description: 'View pending tasks and reminders',
      icon: <Clock className="w-5 h-5" />,
      path: '/doctor/tasks',
      color: 'from-amber-500 to-amber-600',
      urgent: true
    }
  ];

  return (
    <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-teal-500/20' : 'bg-card border')}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "h-auto p-4 flex flex-col items-start gap-2 border-2 border-dashed transition-all duration-300 hover:scale-105",
                theme === 'dark' 
                  ? 'border-gray-600 hover:border-teal-500/50 hover:bg-teal-500/5' 
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50',
                action.urgent && 'animate-pulse'
              )}
              onClick={() => setLocation(action.path)}
            >
              <div className="flex items-center justify-between w-full">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-r",
                  action.color
                )}>
                  {action.icon}
                </div>
                {action.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
                {action.urgent && (
                  <Badge variant="destructive" className="text-xs animate-bounce">
                    Urgent
                  </Badge>
                )}
              </div>
              <div className="text-left">
                <h4 className="font-medium text-sm">{action.title}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 