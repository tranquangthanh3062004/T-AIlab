import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleLogoSvg } from './AuthModal';
import { api } from '../services/api';
import {
  GraduationCap, Terminal, Newspaper, Sparkles,
  Sun, Moon, BookOpen, Database, Compass, Flame, Zap,
  Languages, LogOut, Plus, CheckCircle2, ChevronDown, Home, UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    mode, setMode,
    theme, toggleTheme,
    language, toggleLanguage, t,
    activeView, setActiveView,
    progress,
    user, setUser, openAuthModal, logout, refreshProgress
  } = useApp();

  const isVi = language === 'vi';
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const streakDays = progress?.streak_days || 3;
  const totalXp = progress?.xp || 150;
  const levelNum = progress?.level || 2;
  const levelTitle = progress?.level_title || 'AI Explorer';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickSwitchGoogle = async (email: string, name: string, avatar?: string) => {
    try {
      const res = await api.loginWithGoogle(email, name, avatar);
      localStorage.setItem('chinai_token', res.access_token);
      setUser(res.user);
      await refreshProgress();
      setProfileMenuOpen(false);
    } catch (err) {
      console.error('Failed to switch Google account:', err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Brand + Mode Pill */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition">
                T
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-base sm:text-lg">
                    T AIlab
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    CHINAI 2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  {t('brandTag')}
                </p>
              </div>
            </div>

            {/* Clean Mode Switcher Pill */}
            <div className="hidden xl:flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => {
                  setMode('learn');
                  if (activeView === 'workspace' || activeView === 'datasets') setActiveView('learn');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  mode === 'learn'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{isVi ? 'Học AI' : 'Learn'}</span>
              </button>
              <button
                onClick={() => {
                  setMode('engineer');
                  setActiveView('workspace');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  mode === 'engineer'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isVi ? 'Kỹ sư IDE' : 'Engineer'}</span>
              </button>
            </div>
          </div>

          {/* Center: Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 dark:bg-slate-800/40 px-2 py-1 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'home'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('navHome')}</span>
            </button>

            <button
              onClick={() => setActiveView('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'learn' || activeView === 'lesson'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('navCurriculum')}</span>
            </button>

            <button
              onClick={() => setActiveView('diagnostic')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'diagnostic'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{isVi ? 'Test Năng lực' : 'Diagnostic'}</span>
            </button>

            <button
              onClick={() => {
                setMode('engineer');
                setActiveView('workspace');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'workspace'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('navIde')}</span>
            </button>

            <button
              onClick={() => setActiveView('datasets')}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'datasets'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isVi ? 'Dữ liệu' : 'Data'}</span>
            </button>

            <button
              onClick={() => setActiveView('news')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'news'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-sky-500" />
              <span>{ isVi ? 'Tin tức AI' : 'News' }</span>
            </button>

            <button
              onClick={() => setActiveView('tutor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'tutor'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isVi ? 'Gia sư AI' : 'AI Tutor'}</span>
            </button>
          </nav>

          {/* Right: Gamification + Language/Theme + Auth / Google Account */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Streak & XP */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <div
                className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50/90 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/60"
                title={`Chuỗi học tập: ${streakDays} ${t('streakLabel')}`}
              >
                <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{streakDays}d</span>
              </div>

              <div
                className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-bold bg-violet-50/90 dark:bg-violet-950/40 px-2 py-1 rounded-lg border border-violet-200/60 dark:border-violet-800/60"
                title={`Tổng điểm: ${totalXp} XP (${levelTitle})`}
              >
                <Zap className="w-3.5 h-3.5 fill-current text-violet-500" />
                <span>{totalXp}</span>
              </div>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={isVi ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title={theme === 'light' ? (isVi ? 'Chế độ tối (Dark Mode)' : 'Dark Mode') : (isVi ? 'Chế độ sáng (Light Mode)' : 'Light Mode')}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Account / Google Connect Button */}
            {!user ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => openAuthModal('google')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-2xs transition"
                >
                  <GoogleLogoSvg className="w-3.5 h-3.5" />
                  <span>Google</span>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition"
                >
                  <span>{isVi ? 'Đăng nhập' : 'Sign In'}</span>
                </button>
              </div>
            ) : (
              <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800" ref={menuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 transition"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                    alt={user.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-indigo-300 dark:border-indigo-600"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate hidden sm:inline">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Profile & Multi-Google Account Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50">
                    {/* Active User Info */}
                    <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full border border-indigo-200 dark:border-indigo-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                          {user.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                          <UserCheck className="w-3 h-3" />
                          <span>{t('levelLabel')} {levelNum} &bull; {levelTitle}</span>
                        </div>
                      </div>
                    </div>

                    {/* Connected Google Accounts Section */}
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <GoogleLogoSvg className="w-3.5 h-3.5" />
                          {isVi ? 'Tài khoản Google đã kết nối' : 'Connected Google Accounts'}
                        </span>
                      </div>

                      {user.connected_google_accounts && user.connected_google_accounts.length > 0 ? (
                        <div className="space-y-1.5">
                          {user.connected_google_accounts.map((gAcc) => {
                            const isCurrent = gAcc.email.toLowerCase() === user.email.toLowerCase();
                            return (
                              <div
                                key={gAcc.email}
                                onClick={() => {
                                  if (!isCurrent) handleQuickSwitchGoogle(gAcc.email, gAcc.name, gAcc.avatar_url);
                                }}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs transition ${
                                  isCurrent
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={gAcc.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(gAcc.name)}`}
                                    alt={gAcc.name}
                                    className="w-6 h-6 rounded-full shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                                      {gAcc.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">{gAcc.email}</div>
                                  </div>
                                </div>
                                {isCurrent ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                                    {isVi ? 'Chuyển' : 'Switch'}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          {isVi ? 'Chưa liên kết tài khoản Google nào.' : 'No Google account linked yet.'}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          openAuthModal('google');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {isVi ? 'Kết nối / Chuyển tài khoản Google khác' : 'Connect / Switch Google Account'}
                        </span>
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className="px-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Đăng xuất tài khoản' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
            activeView === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{isVi ? 'Trang chủ' : 'Home'}</span>
        </button>
        <button
          onClick={() => setActiveView('learn')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
            activeView === 'learn' || activeView === 'lesson' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isVi ? 'Lộ trình' : 'Learn'}</span>
        </button>
        <button
          onClick={() => {
            setMode('engineer');
            setActiveView('workspace');
          }}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
            activeView === 'workspace' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>IDE</span>
        </button>
        <button
          onClick={() => setActiveView('news')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
            activeView === 'news' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>{isVi ? 'Tin AI' : 'News'}</span>
        </button>
        <button
          onClick={() => setActiveView('tutor')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
            activeView === 'tutor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tutor</span>
        </button>
      </nav>
    </>
  );
};
