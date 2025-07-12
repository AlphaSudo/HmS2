import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Check for saved theme preference or default to dark mode
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('cliniva-theme');
    return (savedTheme as ThemeMode) || 'dark';
  });

  // Apply initial theme immediately
  useEffect(() => {
    // Apply theme on mount without waiting for state changes
    const initialTheme = localStorage.getItem('cliniva-theme') || 'dark';
    
    // Remove both classes first to ensure clean state
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    
    // Add the appropriate class
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
    
    // Also set a CSS variable for additional styling support
    document.documentElement.style.setProperty('--current-theme', initialTheme);
    
    console.log('Initial theme applied:', initialTheme);
  }, []); // Run only on mount

  // Update theme when it changes
  useEffect(() => {
    localStorage.setItem('cliniva-theme', theme);
    
    // Remove both classes first to ensure clean state
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    
    // Add the appropriate class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
    
    // Also set a CSS variable for additional styling support
    document.documentElement.style.setProperty('--current-theme', theme);
    
    // Debug log to ensure theme is being applied
    console.log('Theme applied:', theme, 'Classes:', document.documentElement.className);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}