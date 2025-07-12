import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button 
        className={`theme-toggle ${theme === 'light' ? 'theme-toggle-active' : ''}`}
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <div className="theme-toggle-slider"></div>
        <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
          <Sun className={`h-3.5 w-3.5 transition-colors ${theme === 'light' ? 'text-yellow-400' : 'text-white/50'}`} />
          <Moon className={`h-3.5 w-3.5 transition-colors ${theme === 'dark' ? 'text-blue-300' : 'text-white/50'}`} />
        </div>
        <span className="sr-only">
          Current theme: {theme}. Click to switch to {theme === 'dark' ? 'light' : 'dark'} mode.
        </span>
      </button>
    </div>
  );
}