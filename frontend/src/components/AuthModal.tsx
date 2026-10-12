import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  X, Mail, Lock, User, Eye, EyeOff, CheckCircle2,
  AlertCircle, Sparkles, ShieldCheck, Plus, ArrowLeft, LogIn, UserPlus
} from 'lucide-react';

interface PresetGoogleAccount {
  email: string;
  name: string;
  role: string;
  avatar_url: string;
}

const DEFAULT_GOOGLE_ACCOUNTS: PresetGoogleAccount[] = [
  {
    email: 'tranquangthanh3062004@gmail.com',
    name: 'Tran Quang Thanh',
    role: 'AI Engineer & Creator',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Tran%20Quang%20Thanh&backgroundColor=4f46e5'
  },
  {
    email: 'thanh.ailab.research@gmail.com',
    name: 'Thanh T-AIlab Research',
    role: 'Deep Learning Researcher',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Thanh%20AI&backgroundColor=0284c7'
  },
  {
    email: 'learner.chinai.vn@gmail.com',
    name: 'Học Viên AI Mới',
    role: 'Beginner AI Explorer',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Hoc%20Vien&backgroundColor=059669'
  }
];

export const GoogleLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.275c0-.85-.075-1.675-.215-2.475H12v4.685h6.455c-.28 1.5-1.125 2.775-2.395 3.625v3.015h3.875c2.265-2.085 3.555-5.16 3.555-8.85z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.955-1.075 7.94-2.91l-3.875-3.015c-1.075.72-2.45 1.15-4.065 1.15-3.125 0-5.77-2.11-6.715-4.945H1.275v3.11C3.25 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.285 14.28c-.24-.72-.375-1.49-.375-2.28s.135-1.56.375-2.28V6.61H1.275C.465 8.23 0 10.065 0 12s.465 3.77 1.275 5.39l4.01-3.11z"
    />
    <path
      fill="#EA4335"
      d="M12 4.775c1.76 0 3.34.605 4.585 1.795l3.435-3.435C17.95 1.19 15.235 0 12 0 7.31 0 3.25 2.7 1.275 6.61l4.01 3.11c.945-2.835 3.59-4.945 6.715-4.945z"
    />
  </svg>
);

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    user,
    setUser,
    refreshProgress,
    language
  } = useApp();

  const isVi = language === 'vi';

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('AI Explorer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Custom Google account form inside Google Chooser
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Saved Google accounts in localStorage
  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState<PresetGoogleAccount[]>(() => {
    try {
      const raw = localStorage.getItem('chinai_google_accounts');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_GOOGLE_ACCOUNTS;
  });

  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setShowCustomGoogleForm(false);
  }, [authModalTab, authModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModalOpen) closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const saveGoogleAccountToLocalList = (acc: PresetGoogleAccount) => {
    const exists = savedGoogleAccounts.some(a => a.email.toLowerCase() === acc.email.toLowerCase());
    if (!exists) {
      const updated = [acc, ...savedGoogleAccounts];
      setSavedGoogleAccounts(updated);
      localStorage.setItem('chinai_google_accounts', JSON.stringify(updated));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      setLoading(true);
      if (authModalTab === 'register') {
        const res = await api.register(email, fullName || email.split('@')[0], password, role);
        localStorage.setItem('chinai_token', res.access_token);
        setUser(res.user);
        await refreshProgress();
        setSuccessMsg(isVi ? 'Đăng ký thành công! Đang đồng bộ lộ trình học...' : 'Account created! Syncing your learning progress...');
        setTimeout(() => closeAuthModal(), 700);
      } else {
        const res = await api.login(email, password);
        localStorage.setItem('chinai_token', res.access_token);
        setUser(res.user);
        await refreshProgress();
        setSuccessMsg(isVi ? 'Đăng nhập thành công!' : 'Signed in successfully!');
        setTimeout(() => closeAuthModal(), 600);
      }
    } catch (err: any) {
      setError(err.message || (isVi ? 'Đã có lỗi xảy ra' : 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (acc: { email: string; name: string; avatar_url?: string }) => {
    setError(null);
    setSuccessMsg(null);
    try {
      setLoading(true);
      saveGoogleAccountToLocalList({
        email: acc.email,
        name: acc.name,
        role: 'Google Verified',
        avatar_url: acc.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}`
      });

      // If user is already logged in and wants to link an additional Google account
      if (user && user.email.toLowerCase() !== acc.email.toLowerCase()) {
        try {
          await api.linkGoogleAccount(acc.email, acc.name, acc.avatar_url);
        } catch {
          // ignore if linking fails, proceed to switch/login
        }
      }

      const res = await api.loginWithGoogle(acc.email, acc.name, acc.avatar_url);
      localStorage.setItem('chinai_token', res.access_token);
      setUser(res.user);
      await refreshProgress();
      setSuccessMsg(
        isVi
          ? `Đã kết nối với tài khoản Google (${acc.email})!`
          : `Connected with Google Account (${acc.email})!`
      );
      setTimeout(() => closeAuthModal(), 650);
    } catch (err: any) {
      setError(err.message || (isVi ? 'Kết nối Google thất bại' : 'Google sign-in failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError(isVi ? 'Vui lòng nhập địa chỉ email Google hợp lệ (ví dụ: tenban@gmail.com)' : 'Please enter a valid Google email address');
      return;
    }
    const displayName = customGoogleName.trim() || cleanEmail.split('@')[0];
    await handleSelectGoogleAccount({
      email: cleanEmail,
      name: displayName,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=4f46e5`
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Brand */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              CH
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {authModalTab === 'google'
                  ? (isVi ? 'Kết nối Tài khoản Google' : 'Sign in with Google')
                  : authModalTab === 'register'
                  ? (isVi ? 'Tạo Tài Khoản Học Viên AI' : 'Create Your AI Account')
                  : (isVi ? 'Chào mừng trở lại CHINAI' : 'Welcome back to CHINAI')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isVi
                  ? 'Lưu tiến độ 7 lộ trình, điểm XP, chuỗi ngày học & dự án IDE'
                  : 'Sync your 7-track progress, XP, streaks & IDE projects'}
              </p>
            </div>
          </div>

          {/* Mode Tabs (Login / Register / Google) */}
          <div className="grid grid-cols-3 gap-1 p-1 mb-6 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                authModalTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isVi ? 'Đăng nhập' : 'Sign In'}</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                authModalTab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isVi ? 'Đăng ký' : 'Sign Up'}</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('google')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                authModalTab === 'google'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GoogleLogoSvg className="w-3.5 h-3.5" />
              <span>Google</span>
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: GOOGLE ACCOUNT CHOOSER */}
          {authModalTab === 'google' ? (
            <div className="space-y-4">
              {!showCustomGoogleForm ? (
                <>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>
                      {isVi
                        ? 'Chọn tài khoản Google để đăng nhập hoặc liên kết nhanh:'
                        : 'Choose a Google account to sign in or link:'}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {savedGoogleAccounts.map((acc) => {
                      const isCurrent = user?.email.toLowerCase() === acc.email.toLowerCase();
                      const isLinked = user?.connected_google_accounts?.some(
                        (g) => g.email.toLowerCase() === acc.email.toLowerCase()
                      );

                      return (
                        <button
                          key={acc.email}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectGoogleAccount(acc)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition group ${
                            isCurrent
                              ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-indigo-50/40 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={acc.avatar_url}
                              alt={acc.name}
                              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                                <span>{acc.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                                    {isVi ? 'Đang dùng' : 'Active'}
                                  </span>
                                )}
                                {!isCurrent && isLinked && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-semibold">
                                    {isVi ? 'Đã liên kết' : 'Linked'}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {acc.email}
                              </div>
                            </div>
                          </div>
                          <GoogleLogoSvg className="w-4 h-4 shrink-0 opacity-80 group-hover:scale-110 transition" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Use another Google Account button */}
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {isVi
                        ? 'Sử dụng hoặc liên kết một tài khoản Google khác'
                        : 'Use or link another Google account'}
                    </span>
                  </button>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      {isVi
                        ? 'Hỗ trợ chuyển đổi nhiều tài khoản Google và tự động bảo toàn tiến độ học tập.'
                        : 'Supports multi-Google account switching and automatic progress preservation.'}
                    </span>
                  </div>
                </>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleForm(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Quay lại danh sách tài khoản Google' : 'Back to Google accounts'}</span>
                  </button>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isVi ? 'Địa chỉ Gmail / Google Workspace' : 'Gmail / Google Workspace Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="tenban@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isVi ? 'Tên hiển thị trên hồ sơ' : 'Display Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        placeholder={isVi ? 'Ví dụ: Trần Quang Thành' : 'e.g. Alex Nguyen'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition"
                  >
                    <GoogleLogoSvg className="w-4 h-4 bg-white rounded-full p-0.5" />
                    <span>
                      {loading
                        ? (isVi ? 'Đang xác thực với Google...' : 'Connecting Google...')
                        : (isVi ? 'Tiếp tục với tài khoản Google này' : 'Continue with this Google Account')}
                    </span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* VIEW 2: LOGIN OR REGISTER FORM */
            <div className="space-y-4">
              {/* Quick Google One-Tap Button */}
              <button
                type="button"
                onClick={() => openAuthModal('google')}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 shadow-xs transition"
              >
                <GoogleLogoSvg className="w-4 h-4" />
                <span>
                  {isVi ? 'Tiếp tục bằng Tài khoản Google' : 'Continue with Google Account'}
                </span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
                  {isVi ? 'hoặc dùng email' : 'or with email'}
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                {authModalTab === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isVi ? 'Họ và tên của bạn' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isVi ? 'Trần Quang Thành' : 'Your full name'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Địa chỉ Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isVi ? 'Mật khẩu' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isVi ? 'Tối thiểu 6 ký tự' : 'At least 6 characters'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authModalTab === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isVi ? 'Mục tiêu học tập chính của bạn' : 'Your Primary Learning Goal'}
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="Beginner AI Explorer">
                        {isVi ? '🌱 Người mới bắt đầu học AI từ số 0' : '🌱 Complete Beginner learning AI from Zero'}
                      </option>
                      <option value="AI & ML Student">
                        {isVi ? '🎓 Sinh viên CNTT / Khoa học Dữ liệu' : '🎓 CS / Data Science Student'}
                      </option>
                      <option value="Applied AI Engineer">
                        {isVi ? '💻 Kỹ sư Phần mềm & AI Thực chiến' : '💻 Software & Applied AI Engineer'}
                      </option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {loading
                      ? (isVi ? 'Đang xử lý...' : 'Processing...')
                      : authModalTab === 'register'
                      ? (isVi ? 'Tạo Tài Khoản Miễn Phí' : 'Create Free Account')
                      : (isVi ? 'Đăng Nhập Vào Hệ Thống' : 'Sign In')}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
