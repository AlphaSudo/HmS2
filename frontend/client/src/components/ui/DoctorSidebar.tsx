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
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  User,
  ListTodo,
  Pill,
} from "lucide-react";

interface DoctorSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function DoctorSidebar({ isOpen, isCollapsed, setIsCollapsed }: DoctorSidebarProps) {
  useLanguage();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { theme } = useTheme();
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: t('doctorSidebar.dashboard','Dashboard'),
      icon: LayoutDashboard,
      href: "/doctor/dashboard",
      active: location === "/doctor/dashboard",
    },
    {
      title: t('doctorSidebar.appointments','Appointments'),
      icon: Calendar,
      href: "/doctor/appointments",
      active: location === "/doctor/appointments",
    },
    {
      title: t('doctorSidebar.patients','Patients'),
      icon: Users,
      href: "/doctor/patients",
      active: location === "/doctor/patients",
    },
    {
      title: t('doctorSidebar.prescriptions','Prescriptions'),
      icon: Pill,
      href: "/doctor/prescriptions",
      active: location === "/doctor/prescriptions",
    },
    {
      title: t('doctorSidebar.profile', 'Profile'),
      icon: User,
      href: "/doctor/profile",
      active: location === "/doctor/profile",
    },
    {
      title: t('doctorSidebar.calendar', 'Calendar'),
      icon: Calendar,
      href: "/doctor/calendar",
      active: location === "/doctor/calendar",
    },
    {
      title: t('doctorSidebar.tasks', 'Tasks'),
      icon: ListTodo,
      href: "/doctor/tasks",
      active: location === "/doctor/tasks",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  if (!isOpen) return null;

  const inactiveLink = theme==='dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';

  return (
    <>
      {/* Mobile overlay */}
      <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 h-full transition-all duration-300 z-50 flex flex-col',
        isRTL ? 'right-0' : 'left-0',
        isCollapsed ? 'w-16' : 'w-64',
        theme==='dark'
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-teal-500/20 text-white'
          : 'bg-white border-r border-gray-200 text-gray-900'
      )}>
        
        {/* Header */}
        <div className={cn('flex items-center justify-between p-4', theme==='dark' ? 'border-b border-teal-500/20' : 'border-b border-gray-200') }>
          {!isCollapsed && (
            <div key="sidebar-header" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={cn('font-semibold', theme==='dark' ? 'text-white' : 'text-gray-900')}>{t('doctorSidebar.portal','Doctor Portal')}</h2>
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
          <div key="user-info-card" className={cn('p-4 mx-4 mt-4 rounded-2xl', theme==='dark' ? 'bg-black/20 border border-teal-500/20' : 'bg-gray-50 border border-gray-200') }>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div className="flex-1">
                <h3 className={cn('font-medium', theme==='dark' ? 'text-white' : 'text-gray-900')}>{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-teal-500/20">
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
                  ? 'bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-lg'
                  : inactiveLink
              )}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">{item.title}</span>
                  {item.active ? <ChevronRight className="w-4 h-4" /> : null}
                </div>
              )}
            </Link>
          ))}
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </nav>

        {/* Logout */}
        <div className={cn('p-4', theme==='dark' ? 'border-t border-teal-500/20' : 'border-t border-gray-200')}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span key="logout-text" className="font-medium">{t('navigation.logout','Logout')}</span>}
          </button>
        </div>
      </div>
    </>
  );
} 