import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppMode, AppTheme, LearnerPersona, LearnerProgress, UserProfile } from '../types';
import { api } from '../services/api';
import { translations, type Language } from '../services/i18n';

export type AuthModalTab = 'login' | 'register' | 'google';

function inferPersonaFromRole(role?: string): LearnerPersona {
  if (!role) return 'beginner';
  const r = role.toLowerCase();
  if (r.includes('engineer') || r.includes('researcher') || r.includes('kỹ sư') || r.includes('creator')) {
    return 'engineer';
  }
  return 'beginner';
}

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  persona: LearnerPersona;
  setPersona: (persona: LearnerPersona) => void;
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
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  authModalOpen: boolean;
  authModalTab: AuthModalTab;
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  logout: () => void;
  agentOpen: boolean;
  setAgentOpen: (open: boolean) => void;
  agentInitialPrompt: string | null;
  openAgentWithPrompt: (prompt?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem('chinai_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [persona, setPersonaState] = useState<LearnerPersona>(() => {
    const saved = localStorage.getItem('chinai_persona');
    if (saved === 'beginner' || saved === 'engineer') return saved;
    if (user?.role) return inferPersonaFromRole(user.role);
    return 'beginner';
  });

  const [mode, setModeState] = useState<AppMode>(() => (persona === 'engineer' ? 'engineer' : 'learn'));

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
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login');
  const [agentOpen, setAgentOpen] = useState<boolean>(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string | null>(null);

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

  const setPersona = (newPersona: LearnerPersona) => {
    setPersonaState(newPersona);
    localStorage.setItem('chinai_persona', newPersona);
    setModeState(newPersona === 'engineer' ? 'engineer' : 'learn');
  };

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    const mappedPersona: LearnerPersona = newMode === 'engineer' ? 'engineer' : 'beginner';
    setPersonaState(mappedPersona);
    localStorage.setItem('chinai_persona', mappedPersona);
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

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('chinai_user', JSON.stringify(newUser));
      const inferred = inferPersonaFromRole(newUser.role);
      setPersona(inferred);
    } else {
      localStorage.removeItem('chinai_user');
    }
  };

  const openAuthModal = (tab: AuthModalTab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openAgentWithPrompt = (prompt?: string) => {
    if (prompt) {
      setAgentInitialPrompt(prompt);
    }
    setAgentOpen(true);
  };

  const logout = () => {
    localStorage.removeItem('chinai_token');
    localStorage.removeItem('chinai_user');
    setUserState(null);
    refreshProgress();
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
    const token = localStorage.getItem('chinai_token');
    if (token) {
      api.getMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('chinai_token');
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        persona,
        setPersona,
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
        refreshProgress,
        user,
        setUser,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        logout,
        agentOpen,
        setAgentOpen,
        agentInitialPrompt,
        openAgentWithPrompt
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
