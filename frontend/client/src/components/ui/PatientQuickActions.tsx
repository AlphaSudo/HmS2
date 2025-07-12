import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  Calendar, 
  FileText, 
  Activity, 
  CreditCard, 
  Stethoscope,
  Brain,
  Heart,
  CalendarPlus,
  TestTube,
  PillBottle,
  UserCheck,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface PatientQuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
  urgent?: boolean;
}

export function PatientQuickActions() {
  const [location, setLocation] = useLocation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const quickActions: PatientQuickAction[] = [
    {
      title: 'My Appointments',
      description: 'View and manage appointments',
      icon: <Calendar className="w-5 h-5" />,
      path: '/patient/appointments',
      color: 'from-blue-500 to-blue-600',
      badge: 'Active'
    },
    {
      title: 'Prescriptions',
      description: 'View medication history',
      icon: <PillBottle className="w-5 h-5" />,
      path: '/patient/prescriptions',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Medical Records',
      description: 'Access your health records',
      icon: <FileText className="w-5 h-5" />,
      path: '/patient/medical-records',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Billing & Invoices',
      description: 'View bills and payments',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/patient/billing',
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Health Assessments',
      description: 'Take health assessments',
      icon: <Activity className="w-5 h-5" />,
      path: '/patient/stroke-assessment',
      color: 'from-red-500 to-red-600',
      badge: 'New'
    },
    {
      title: 'AI Predictions',
      description: 'Health prediction tools',
      icon: <Brain className="w-5 h-5" />,
      path: '/patient/diabetes-prediction',
      color: 'from-teal-500 to-teal-600',
      urgent: true
    }
  ];

  const healthTools = [
    {
      title: 'Stroke Assessment',
      path: '/patient/stroke-assessment',
      icon: <Brain className="w-4 h-4" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Diabetes Prediction',
      path: '/patient/diabetes-prediction',
      icon: <TestTube className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Liver Disease Check',
      path: '/patient/liver-disease-prediction',
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Quick Actions */}
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
                      Priority
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

      {/* Health Assessment Tools */}
      <Card className={cn(theme === 'dark' ? 'bg-gray-800/60 border-purple-500/20' : 'bg-card border')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-500" />
            Health Assessment Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {healthTools.map((tool, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "h-auto p-3 flex items-center gap-3 justify-start transition-all duration-200 hover:scale-105",
                  theme === 'dark' ? 'hover:bg-purple-500/10' : 'hover:bg-purple-50'
                )}
                onClick={() => setLocation(tool.path)}
              >
                <div className={cn("p-2 rounded-lg", tool.color)}>
                  {tool.icon}
                </div>
                <span className="text-sm font-medium">{tool.title}</span>
              </Button>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Regular health assessments can help detect potential issues early and improve your overall well-being.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 