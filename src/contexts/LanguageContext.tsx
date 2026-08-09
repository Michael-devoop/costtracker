'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { t as translate, tStatus as translateStatus, type Locale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tStatus: (status: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
  tStatus: (status: string) => status,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('costtracker-locale') as Locale | null;
    if (saved === 'en' || saved === 'am') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('costtracker-locale', newLocale);
  }, []);

  const t = useCallback((key: string) => translate(key, locale), [locale]);
  const tStatus = useCallback((status: string) => translateStatus(status, locale), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tStatus }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
