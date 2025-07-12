import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Bell, Mail, Maximize2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface PatientHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ title, icon, subtitle, actions }) => {
  const { theme } = useTheme();
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex justify-between items-center h-16 px-6 backdrop-blur-md',
        theme === 'dark'
          ? 'bg-[#05002E]/80 border-b border-white/10 text-white'
          : 'bg-white/80 border-b border-gray-200 text-gray-900'
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <div>
          <h1 className={cn('text-2xl font-bold', theme==='dark' ? 'text-white' : 'text-gray-900')}>{title}</h1>
          {subtitle && (
            <p className={cn('text-sm mt-0.5', theme==='dark' ? 'text-gray-400' : 'text-gray-500')}>{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <ThemeToggle />
        <LanguageToggle />
        <button
          className={cn(
            'relative p-2 rounded-full transition-colors',
            theme==='dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          )}
        >
          <Bell className={cn('w-5 h-5', theme==='dark' ? 'text-gray-300' : 'text-gray-600')} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-[#12072e]"></span>
        </button>
        <button
          className={cn(
            'relative p-2 rounded-full transition-colors',
            theme==='dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          )}
        >
          <Mail className={cn('w-5 h-5', theme==='dark' ? 'text-gray-300' : 'text-gray-600')} />
        </button>
        <button
          onClick={handleToggleFullScreen}
          className={cn(
            'p-2 rounded-full transition-colors',
            theme==='dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          )}
        >
          <Maximize2 className={cn('w-5 h-5', theme==='dark' ? 'text-gray-300' : 'text-gray-600')} />
        </button>
      </div>
    </header>
  );
}; 