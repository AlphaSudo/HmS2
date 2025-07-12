import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getStoredLanguage, storeLanguage } from '@/lib/localStorage';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lng: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize from localStorage or i18n current language
    const stored = getStoredLanguage();
    const current = i18n.language as Language;
    return stored ?? current ?? 'en';
  });
  
  const isRTL = language === 'ar';

  const changeLanguage = async (lng: Language) => {
    try {
      // Update i18next
      await i18n.changeLanguage(lng);
      
      // Update local state
      setLanguage(lng);
      
      // Store in localStorage
      storeLanguage(lng);
      
      console.log(`Language changed to: ${lng}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Initialize language on mount
  useEffect(() => {
    const storedLang = getStoredLanguage();
    if (storedLang && storedLang !== language) {
      changeLanguage(storedLang);
    }
  }, []);

  // Sync with i18n language changes
  useEffect(() => {
    const currentLang = i18n.language as Language;
    if (currentLang && currentLang !== language && (currentLang === 'en' || currentLang === 'ar')) {
      setLanguage(currentLang);
      storeLanguage(currentLang);
    }
  }, [i18n.language, language]);

  // Handle RTL/LTR direction and language attribute
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add RTL class for styling purposes
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 