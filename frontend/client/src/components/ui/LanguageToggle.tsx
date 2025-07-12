import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Check } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, changeLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  
  const handleLanguageChange = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    
    setIsChanging(true);
    try {
      await changeLanguage(newLanguage);
      
      // Show success indicator briefly
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChanging(false);
    }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleLanguageChange}
        disabled={isChanging}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-purple-900/30 hover:bg-purple-800/40 border border-purple-700' 
            : 'bg-muted/50 hover:bg-muted border border-border'
        } ${isChanging ? 'opacity-75 cursor-not-allowed' : ''}`}
        title={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
      >
        {isChanging ? (
          <Check className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
        ) : (
          <Globe className={`h-4 w-4 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`} />
        )}
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
          {language === 'en' ? 'العربية' : 'English'}
        </span>
      </button>
    </div>
  );
} 