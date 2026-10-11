import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap, Terminal, Newspaper, Sparkles,
  Sun, Moon, BookOpen, Database, Compass, Flame, Zap, Award, Languages
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    mode, setMode,
    theme, toggleTheme,
    language, toggleLanguage, t,
    activeView, setActiveView,
    progress
  } = useApp();

  const streakDays = progress?.streak_days || 3;
  const totalXp = progress?.xp || 150;
  const levelNum = progress?.level || 2;
  const levelTitle = progress?.level_title || 'AI Explorer';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition">
              CH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-lg">
                  {t('brandTitle')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                  OS 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">{t('brandTag')}</p>
            </div>
          </div>

          {/* Mode Switcher Pill */}
          <div className="hidden lg:flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setMode('learn');
                if (activeView === 'workspace' || activeView === 'datasets') setActiveView('learn');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'learn'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t('learnMode')}
            </button>
            <button
              onClick={() => {
                setMode('engineer');
                setActiveView('workspace');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'engineer'
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              {t('engineerMode')}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveView('home')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'home'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => setActiveView('learn')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'learn' || activeView === 'lesson'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t('navCurriculum')}
          </button>
          <button
            onClick={() => setActiveView('diagnostic')}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'diagnostic'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {t('navDiagnostic')}
          </button>
          <button
            onClick={() => {
              setMode('engineer');
              setActiveView('workspace');
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'workspace'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            {t('navIde')}
          </button>
          <button
            onClick={() => setActiveView('datasets')}
            className={`hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'datasets'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            {t('navDatasets')}
          </button>
          <button
            onClick={() => setActiveView('news')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'news'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            {t('navNews')}
          </button>
          <button
            onClick={() => setActiveView('tutor')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeView === 'tutor'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('navTutor')}
          </button>

          {/* Gamification Bar (Duolingo Style: Streak, XP, Level) */}
          <div className="hidden sm:flex items-center gap-2 ml-1.5 pl-2.5 border-l border-slate-200 dark:border-slate-800 text-xs">
            {/* Streak */}
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50/80 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/60" title={`Chuỗi học tập liên tục: ${streakDays} ${t('streakLabel')}`}>
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500 animate-pulse" />
              <span>{streakDays}d</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-bold bg-violet-50/80 dark:bg-violet-950/40 px-2 py-1 rounded-lg border border-violet-200/60 dark:border-violet-800/60" title={`Tổng điểm: ${totalXp} XP`}>
              <Zap className="w-3.5 h-3.5 fill-current text-violet-500" />
              <span>{totalXp}</span>
            </div>

            {/* Level */}
            <div className="hidden lg:flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold bg-sky-50/80 dark:bg-sky-950/40 px-2 py-1 rounded-lg border border-sky-200/60 dark:border-sky-800/60" title={`${t('levelLabel')} ${levelNum} (${levelTitle})`}>
              <Award className="w-3.5 h-3.5 text-sky-500" />
              <span>{t('levelLabel')} {levelNum}</span>
            </div>
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            className="flex items-center gap-1 px-2.5 py-1.5 ml-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Languages className="w-3.5 h-3.5 text-blue-500" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'light' ? (language === 'vi' ? 'Bật chế độ tối (Dark Mode)' : 'Switch to Dark Mode') : (language === 'vi' ? 'Bật chế độ sáng (Light Mode)' : 'Switch to Light Mode')}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
