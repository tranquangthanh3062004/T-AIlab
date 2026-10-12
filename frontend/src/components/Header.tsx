import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleLogoSvg } from './AuthModal';
import { AnimatedLogo } from './AnimatedLogo';
import { api } from '../services/api';
import {
  Newspaper, Sun, Moon, BookOpen, Flame, Zap,
  Languages, LogOut, Plus, CheckCircle2, ChevronDown, Home,
  UserCheck, SlidersHorizontal, Sprout, Code2, Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    persona, setPersona,
    theme, setTheme,
    language, setLanguage, t,
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
  const dailyGoalXp = progress?.daily_goal_xp || 100;
  const todayXp = progress?.today_xp || 50;
  const dailyPct = Math.min(100, Math.round((todayXp / dailyGoalXp) * 100));

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
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* 1. Left: Impressive Animated Brand Logo */}
          <AnimatedLogo
            onClick={() => setActiveView('home')}
            subtitle={t('brandTag')}
          />

          {/* 2. Center: Minimalist 3-Item Primary Navigation (Overview, Curriculum, AI News) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/60"
          >
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'home'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{isVi ? 'Tổng quan' : 'Overview'}</span>
            </button>

            <button
              onClick={() => setActiveView('learn')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'learn' || activeView === 'lesson' || activeView === 'diagnostic' || activeView === 'workspace' || activeView === 'datasets'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isVi ? 'Bài học & Lộ trình' : 'Curriculum'}</span>
            </button>

            <button
              onClick={() => setActiveView('news')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'news'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Newspaper className="w-4 h-4 text-sky-500" />
              <span>{isVi ? 'Tin tức AI' : 'AI News'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </nav>

          {/* 3. Right: User Profile & Unified Preferences Menu (Points, Language, Theme, Persona, Google Auth) */}
          <div className="flex items-center gap-2.5 shrink-0" ref={menuRef}>
            {!user && (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition"
              >
                <span>{isVi ? 'Đăng nhập / Đăng ký' : 'Sign In / Sign Up'}</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                aria-label="User menu and settings"
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 transition"
              >
                {user ? (
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-xl object-cover border border-indigo-300 dark:border-indigo-600"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 max-w-[120px] truncate leading-tight">
                    {user ? user.full_name : (isVi ? 'Tùy chọn Học viên' : 'Learner Menu')}
                  </div>
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span>{persona === 'engineer' ? (isVi ? '💻 Kỹ sư AI' : '💻 Engineer') : (isVi ? '🌱 Người mới' : '🌱 Beginner')}</span>
                    <span>&bull;</span>
                    <span>{totalXp} XP</span>
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Unified User Control Center Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-4">
                  {/* Section 1: User Account Header or Guest CTA */}
                  {user ? (
                    <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                        alt={user.full_name}
                        className="w-11 h-11 rounded-2xl border border-indigo-200 dark:border-indigo-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                          {user.full_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300">
                          <UserCheck className="w-3 h-3" />
                          <span>{user.role || levelTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60 space-y-2.5">
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {isVi ? 'Đồng bộ lộ trình & cấp độ học AI của bạn' : 'Sync your AI learning path & persona'}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {isVi
                          ? 'Đăng ký tài khoản để hệ thống tự động thiết lập lộ trình (Người mới hoặc Kỹ sư AI) và lưu điểm XP.'
                          : 'Sign in or register to personalize your track (Beginner vs Engineer) and save XP.'}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            openAuthModal('login');
                          }}
                          className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                        >
                          {isVi ? 'Đăng nhập / ĐK' : 'Sign In / Up'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            openAuthModal('google');
                          }}
                          className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <GoogleLogoSvg className="w-3.5 h-3.5" />
                          <span>Google</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section 2: Gamification Points, Streak & Level (Moved into User Menu as requested) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        {isVi ? 'Điểm thưởng & Chuỗi học tập' : 'Points & Learning Streak'}
                      </span>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {t('levelLabel')} {levelNum} &bull; {levelTitle}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-amber-900/50">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
                          <Flame className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 dark:text-white">{streakDays} {isVi ? 'ngày' : 'days'}</div>
                          <div className="text-[10px] text-slate-500">{isVi ? 'Chuỗi liên tục' : 'Active Streak'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-violet-200/70 dark:border-violet-900/50">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-500">
                          <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 dark:text-white">{totalXp} XP</div>
                          <div className="text-[10px] text-slate-500">{isVi ? 'Tổng kinh nghiệm' : 'Total XP'}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                        <span>{isVi ? 'Mục tiêu hôm nay' : 'Daily XP Goal'}</span>
                        <span>{todayXp} / {dailyGoalXp} XP ({dailyPct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${dailyPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Registered Learning Persona (Beginner vs Engineer) */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {isVi ? 'Lộ trình Đối tượng Học tập' : 'Registered Learning Persona'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setPersona('beginner')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                          persona === 'beginner'
                            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Sprout className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Người mới (A–D)' : 'Beginner (A–D)'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersona('engineer')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                          persona === 'engineer'
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Kỹ sư AI (E–G)' : 'AI Engineer (E–G)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 4: Language & Theme Controls (Moved into User Menu as requested) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Language Selector */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Languages className="w-3 h-3 text-indigo-500" />
                        {isVi ? 'Ngôn ngữ' : 'Language'}
                      </span>
                      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setLanguage('vi')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition ${
                            language === 'vi'
                              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Tiếng Việt
                        </button>
                        <button
                          type="button"
                          onClick={() => setLanguage('en')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition ${
                            language === 'en'
                              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        {theme === 'light' ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-indigo-400" />}
                        {isVi ? 'Giao diện' : 'Appearance'}
                      </span>
                      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition ${
                            theme === 'light'
                              ? 'bg-white text-amber-600 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Sun className="w-3 h-3" />
                          <span>{isVi ? 'Sáng' : 'Light'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition ${
                            theme === 'dark'
                              ? 'bg-slate-900 text-indigo-300 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Moon className="w-3 h-3" />
                          <span>{isVi ? 'Tối' : 'Dark'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Connected Google Accounts (when logged in) */}
                  {user && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <GoogleLogoSvg className="w-3.5 h-3.5" />
                          {isVi ? 'Tài khoản Google đã kết nối' : 'Connected Google Accounts'}
                        </span>
                      </div>

                      {user.connected_google_accounts && user.connected_google_accounts.length > 0 && (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
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
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            openAuthModal('google');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Thêm Google' : 'Add Google'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Đăng xuất' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (3 Primary Items) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold ${
            activeView === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{isVi ? 'Tổng quan' : 'Overview'}</span>
        </button>
        <button
          onClick={() => setActiveView('learn')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold ${
            activeView === 'learn' || activeView === 'lesson' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isVi ? 'Bài học' : 'Curriculum'}</span>
        </button>
        <button
          onClick={() => setActiveView('news')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold ${
            activeView === 'news' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>{isVi ? 'Tin tức AI' : 'AI News'}</span>
        </button>
      </nav>
    </>
  );
};
