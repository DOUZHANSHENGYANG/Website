import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '../utils/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = 'blog_language';

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLang?: Language;
}

const resolveLang = (lang?: string): Language => (lang === 'en' ? 'en' : 'zh');

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLang }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const fromStorage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return resolveLang(fromStorage || initialLang || 'zh');
  });

  useEffect(() => {
    if (initialLang) {
      const nextLang = resolveLang(initialLang);
      setLangState(nextLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    }
  }, [initialLang]);

  const setLang = (newLang: Language) => {
    const nextLang = resolveLang(newLang);
    setLangState(nextLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[lang];
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
