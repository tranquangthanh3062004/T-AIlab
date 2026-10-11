import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppMode, AppTheme, LearnerProgress } from '../types';
import { api } from '../services/api';
import { translations, type Language } from '../services/i18n';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['vi']) => string;
  activeView: string;
  setActiveView: (view: string) => void;
  activeLessonId: string | null;
  openLesson: (lessonId: string) => void;
  progress: LearnerProgress | null;
  refreshProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>('learn');
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('chinai_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [activeView, setActiveView] = useState<string>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('lesson-foundations-what-is-ai');
  const [progress, setProgress] = useState<LearnerProgress | null>(null);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('chinai_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('chinai_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: keyof typeof translations['vi']): string => {
    return translations[language][key] || translations['vi'][key] || key;
  };

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('chinai_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const refreshProgress = async () => {
    try {
      const p = await api.getProgress();
      setProgress(p);
    } catch (e) {
      console.error('Error fetching progress:', e);
    }
  };

  const openLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveView('lesson');
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        t,
        activeView,
        setActiveView,
        activeLessonId,
        openLesson,
        progress,
        refreshProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
