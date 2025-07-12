// Utility functions for safe localStorage operations
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const testKey = 'localStorage-test';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

export const getFromLocalStorage = (key: string, defaultValue: string = ''): string => {
  if (!isLocalStorageAvailable()) return defaultValue;
  
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setToLocalStorage = (key: string, value: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to store ${key} in localStorage:`, error);
    return false;
  }
};

export const removeFromLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
    return false;
  }
};

// Language-specific utilities
export const LANGUAGE_STORAGE_KEY = 'hms-language';

export const getStoredLanguage = (): 'en' | 'ar' | null => {
  const stored = getFromLocalStorage(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') {
    return stored;
  }
  return null;
};

export const storeLanguage = (language: 'en' | 'ar'): boolean => {
  return setToLocalStorage(LANGUAGE_STORAGE_KEY, language);
}; 