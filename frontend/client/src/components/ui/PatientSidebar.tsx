import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Heart,
  User,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Pill,
  FileText,
  Receipt
} from "lucide-react";

interface PatientSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function PatientSidebar({ isOpen, isCollapsed, setIsCollapsed }: PatientSidebarProps) {
  useLanguage();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { theme } = useTheme();
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: t('patientSidebar.dashboard','Dashboard'),
      icon: Home,
      href: "/patient/dashboard",
      active: location === "/patient/dashboard",
    },
    {
      title: t('patientSidebar.myAppointments','My Appointments'),
      icon: Calendar,
      href: "/patient/appointments",
      active: location === "/patient/appointments",
    },
    {
      title: t('patientSidebar.myPrescriptions','My Prescriptions'),
      icon: Pill,
      href: "/patient/prescriptions",
      active: location === "/patient/prescriptions",
    },
    {
      title: t('patientSidebar.billing','Billing & Invoices'),
      icon: Receipt,
      href: "/patient/billing",
      active: location === "/patient/billing",
    },
    {
      title: t('patientSidebar.healthAssessment','Health Assessment'),
      icon: Activity,
      href: "/patient/stroke-assessment",
      active: location.includes("/patient/stroke-assessment") && !location.includes("-simple"),
    },
    {
      title: t('patientSidebar.liverPrediction', 'Liver Disease Prediction'),
      icon: Heart,
      href: "/patient/liver-disease-prediction",
      active: location === "/patient/liver-disease-prediction",
    },
    {
      title: t('patientSidebar.diabetesPrediction', 'Diabetes Prediction'),
      icon: Activity,
      href: "/patient/diabetes-prediction",
      active: location === "/patient/diabetes-prediction",
    },
    {
      title: t('patientSidebar.medicalProfile','Medical Profile'),
      icon: User,
      href: "/patient/profile/" + user?.id,
      active: location === "/patient/profile/" + user?.id ,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  if (!isOpen) return null;

  const inactiveLink = theme==='dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';

  return (
    <>
      {/* Mobile overlay – only for screens <768px to avoid accidental trigger when
         the browser width shrinks slightly (e.g. when dev-tools is open). */}
      <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 h-full transition-all duration-300 z-50 flex flex-col',
        isRTL ? 'right-0' : 'left-0',
        isCollapsed ? 'w-16' : 'w-64',
        theme==='dark'
          ? 'bg-gradient-to-b from-[#05002E] via-[#1a0a2e] to-[#16213e] border-r border-white/10 text-white'
          : 'bg-white border-r border-gray-200 text-gray-900'
      )}>
        
        {/* Header */}
        <div className={cn('flex items-center justify-between p-4', theme==='dark' ? 'border-b border-white/10' : 'border-b border-gray-200') }>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={cn('font-semibold', theme==='dark' ? 'text-white' : 'text-gray-900')}>{t('patientSidebar.portal','Patient Portal')}</h2>
                <p className={cn('text-xs', theme==='dark' ? 'text-gray-400' : 'text-gray-500')}>{user?.name}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info Card */}
        {!isCollapsed && (
          <div className={cn('p-4 mx-4 mt-4 rounded-2xl', theme==='dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200') }>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'P'}
              </div>
              <div className="flex-1">
                <h3 className={cn('font-medium', theme==='dark' ? 'text-white' : 'text-gray-900')}>{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/10">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-scroll scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                item.active
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-lg'
                  : inactiveLink
              )}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.title}</span>
                  {item.active && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </>
              )}
            </Link>
          ))}
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className={cn('p-4', theme==='dark' ? 'border-t border-white/10' : 'border-t border-gray-200') }>
            <Link href="/patient/appointments">
              <button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white py-3 px-4 rounded-xl font-medium hover:from-[#7C3AED] hover:to-[#0891B2] transition-all duration-200 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('patientSidebar.bookAppointment','Book Appointment')}
              </button>
            </Link>
          </div>
        )}

        {/* Logout */}
        <div className={cn('p-4', theme==='dark' ? 'border-t border-white/10' : 'border-t border-gray-200')}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{t('navigation.logout','Logout')}</span>}
          </button>
        </div>
      </div>
    </>
  );
} 