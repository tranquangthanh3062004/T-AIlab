import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleLogoSvg } from '../components/AuthModal';
import { api } from '../services/api';
import type { Track } from '../types';
import {
  Newspaper, ArrowRight, Flame, Award, BookOpen, Sparkles,
  Rocket, Code, Brain, CheckCircle2, UserPlus,
  Sprout, Code2, Database, Clock, PlayCircle, Bot, Terminal, XCircle
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    persona, setPersona,
    setActiveView, openLesson,
    progress, t, language,
    user, openAuthModal,
    openAgentWithPrompt
  } = useApp();
  const isVi = language === 'vi';

  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    api.getTracks(language)
      .then((data) => setTracks(data))
      .catch(() => {});
  }, [language]);

  const completedSet = new Set(progress?.completed_lesson_ids || []);

  // Filter all 15 tracks by the 2 target personas
  const beginnerTracks = tracks.filter(
    (tr) =>
      tr.target_audience === 'beginner' ||
      ['track-foundations', 'track-python', 'track-math', 'track-data-science', 'track-ml'].includes(tr.id)
  );
  const engineerTracks = tracks.filter(
    (tr) =>
      tr.target_audience === 'engineer' ||
      [
        'track-dl',
        'track-computer-vision',
        'track-llm',
        'track-generative-multimodal',
        'track-ai-agents',
        'track-mlops',
        'track-responsible-ai-security',
        'track-research-engineering',
        'track-applied-specializations',
        'track-capstone-portfolio'
      ].includes(tr.id)
  );

  const activeAudienceTracks = persona === 'engineer' ? engineerTracks : beginnerTracks;
  const allLessonsInPersona = activeAudienceTracks.flatMap((tr) => tr.modules.flatMap((m) => m.lessons));
  const nextRecommendedLesson =
    allLessonsInPersona.find((l) => !completedSet.has(l.id)) ||
    allLessonsInPersona[0] ||
    tracks[0]?.modules[0]?.lessons[0];

  const streakDays = progress?.streak_days || 3;
  const currentXp = progress?.xp || 150;
  const todayXp = progress?.today_xp || 30;
  const dailyGoalXp = progress?.daily_goal_xp || 50;
  const levelNum = progress?.level || 2;
  const levelTitle = progress?.level_title || (isVi ? 'Nhà Thám Hiểm AI' : 'AI Explorer');
  const badges = progress?.badges || [];
  const completedLessons = progress?.completed_lesson_ids.length || 0;
  const totalLessons = progress?.total_lessons_count || 16;
  const progressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));
  const dailyGoalPercent = Math.min(100, Math.round((todayXp / dailyGoalXp) * 100));
  const masteryDims = progress?.mastery_dimensions;
  const adaptiveRecs = progress?.recommendations || [];

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-5 h-5 ${unlocked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Rocket':
        return <Rocket className={cls} />;
      case 'Award':
        return <Award className={cls} />;
      case 'Code':
        return <Code className={cls} />;
      case 'Flame':
        return <Flame className={cls} />;
      case 'Brain':
        return <Brain className={cls} />;
      case 'Terminal':
        return <Terminal className={cls} />;
      default:
        return <Sparkles className={cls} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-7 space-y-8">
      {/* 1. Marketing Trust & Social Proof Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/80 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-slate-900/90 border border-indigo-200/60 dark:border-indigo-800/40 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <strong className="text-indigo-700 dark:text-indigo-300 font-extrabold uppercase tracking-wider">
            T Lab AI
          </strong>
          <span>• {isVi ? '100% Học Miễn Phí Trên Dữ Liệu Thật' : '100% Free Hands-on AI with Real Data'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">⚡ Monaco Sandbox</span>
          <span className="flex items-center gap-1">🎓 21 OER Sources (Stanford/MIT/Google)</span>
          <span className="flex items-center gap-1">🛡️ 15 Tracks DAG</span>
        </div>
      </div>

      {/* 2. User Account & Frictionless Persona Activation Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        {user ? (
          <>
            <div className="flex items-center gap-3.5">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                alt={user.full_name}
                className="w-11 h-11 rounded-2xl border-2 border-indigo-500/30 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {isVi ? `Xin chào, ${user.full_name}!` : `Welcome back, ${user.full_name}!`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                    {persona === 'engineer' ? <Code2 className="w-3 h-3" /> : <Sprout className="w-3 h-3" />}
                    {persona === 'engineer'
                      ? (isVi ? 'Đối tượng: Kỹ sư AI Thực chiến' : 'Role: Applied AI Engineer')
                      : (isVi ? 'Đối tượng: Người mới bắt đầu' : 'Role: Beginner Explorer')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {isVi ? 'Đã lưu tiến độ' : 'Synced'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email} &bull; {isVi ? 'Tiến độ học và mã nguồn Python đã được lưu trữ an toàn' : 'Progress & Python code saved securely'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('google')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                <GoogleLogoSvg className="w-3.5 h-3.5" />
                <span>{isVi ? 'Đổi tài khoản Google' : 'Google Account'}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {isVi
                    ? 'Đăng nhập 1-Click để lưu tiến độ, mở khóa 15 Phòng Lab Python & nhận Huy hiệu AI'
                    : '1-Click Login to sync your 15 Python Labs, XP streak & official Capstone certificate'}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isVi
                    ? 'Hoàn toàn miễn phí, không yêu cầu thẻ tín dụng. Tự động cá nhân hóa lộ trình phù hợp với bạn.'
                    : '100% Free, no credit card required. Instantly tailors your learning roadmap.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('google')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-100 font-extrabold text-xs border border-slate-300 dark:border-slate-700 shadow-2xs transition"
              >
                <GoogleLogoSvg className="w-4 h-4" />
                <span>Google Sign-in</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isVi ? 'Tạo tài khoản miễn phí' : 'Start Free'}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. High-Converting Hero Banner + Active Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 cols: Marketing Value Hook & Personas */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-7 sm:p-9 flex flex-col justify-between shadow-xl border border-indigo-500/30">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-xs text-xs font-extrabold text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {persona === 'engineer'
                    ? (isVi ? 'Lộ trình: Kỹ Sư AI Thực Chiến (Tracks 5–14)' : 'Path: Applied AI Engineer (Tracks 5–14)')
                    : (isVi ? 'Lộ trình: Người Mới Bắt Đầu Từ Số 0 (Tracks 0–4)' : 'Path: Complete Beginner Core (Tracks 0–4)')}
                </span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                ✓ 100% Real Datasets
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {persona === 'engineer'
                ? (isVi
                    ? 'Làm Chủ Deep Learning, Vision, LLM RAG, AI Agents & MLOps Sản Xuất'
                    : 'Master Deep Learning, Vision, LLM RAG, AI Agents & Production MLOps')
                : (isVi
                    ? 'Học Trí Tuệ Nhân Tạo Từ Số 0 — Thực Hành Trực Tiếp Trên Dữ Liệu Thật'
                    : 'Master AI From Zero — 100% Hands-On Code with Real Datasets')}
            </h1>

            <p className="text-indigo-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
              {isVi
                ? 'Không học vẹt lý thuyết, không dữ liệu giả lập. Giáo trình 15 Chặng chuẩn đại học hàng đầu (Stanford, MIT, UC Berkeley, Google), phòng Lab Monaco IDE thực thi Python an toàn ngay trên trình duyệt và trợ lý AI Socratic đồng hành 24/7.'
                : 'No dry theory, zero mock data. A rigorous 15-track curriculum grounded in Stanford, MIT, and Google research, featuring browser Python sandboxes and 24/7 Socratic AI mentoring.'}
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
            {nextRecommendedLesson && (
              <button
                onClick={() => openLesson(nextRecommendedLesson.id)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isVi ? '🚀 Bắt Đầu Học Thử Miễn Phí' : '🚀 Start Free Lesson'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveView('learn')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              <BookOpen className="w-4 h-4 text-sky-300" />
              <span>{isVi ? 'Khám phá 15 Lộ trình' : 'Browse 15 Tracks'}</span>
            </button>
            <button
              onClick={() =>
                openAgentWithPrompt(
                  isVi
                    ? 'Chào bạn, tôi muốn bắt đầu học AI tại T Lab AI. Hãy tư vấn lộ trình học phù hợp nhất cho tôi.'
                    : 'Hi! I want to master AI on T Lab AI. Please recommend the best learning pathway for me.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold text-xs border border-emerald-400/30 transition"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>{isVi ? 'Hỏi Trợ lý T Lab AI' : 'Ask AI Tutor'}</span>
            </button>
          </div>

          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
        </div>

        {/* Right 5 cols: Active Lesson & Real Dataset Spotlight Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {isVi ? 'Bài học Đề xuất Tiếp theo' : 'Up Next in Your Path'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {nextRecommendedLesson?.estimated_minutes || 20} {isVi ? 'phút' : 'min'}
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
              {nextRecommendedLesson?.title ||
                (isVi
                  ? 'AI là gì? Phân biệt AI, Học máy (ML), Học sâu (DL) & AI Tạo sinh'
                  : 'What is AI? Demystifying AI, ML, Deep Learning & Generative AI')}
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {nextRecommendedLesson?.intuitive_explanation ||
                (isVi
                  ? 'Khám phá trực quan sự khác biệt giữa lập trình truyền thống và Học máy thông qua dữ liệu thực tế.'
                  : 'Discover the core difference between deterministic rules and data-driven Machine Learning.')}
            </p>

            {nextRecommendedLesson?.real_dataset && (
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Database className="w-3 h-3" />
                  <span>{isVi ? 'Bộ dữ liệu thực tế tích hợp trong bài:' : 'Real Open Dataset Included:'}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {nextRecommendedLesson.real_dataset.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {nextRecommendedLesson.real_dataset.source_org} &bull; {nextRecommendedLesson.real_dataset.license}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              {isVi ? 'Đã hoàn thành:' : 'Completed:'}{' '}
              <strong className="text-slate-900 dark:text-white">
                {completedLessons}/{totalLessons} {isVi ? 'bài học' : 'lessons'}
              </strong>
            </div>
            <button
              onClick={() => openLesson(nextRecommendedLesson?.id || 'lesson-foundations-what-is-ai')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 text-white font-bold text-xs transition"
            >
              <span>{isVi ? 'Vào học ngay' : 'Open Lesson'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Key Metrics Strip (Clean 4-Card Summary) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-200/60 dark:border-emerald-800/50">
            {progressPercent}%
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Tiến độ Giáo trình' : 'Syllabus Mastery'}</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {completedLessons}/{totalLessons} {isVi ? 'Bài học' : 'Lessons'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/50">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Chuỗi ngày học' : 'Learning Streak'}</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {streakDays} {isVi ? 'ngày liên tiếp' : 'days active'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-black text-sm border border-indigo-200/60 dark:border-indigo-800/50">
            L{levelNum}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">{levelTitle}</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {currentXp} XP ({dailyGoalPercent}% {isVi ? 'hôm nay' : 'today'})
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200/60 dark:border-sky-800/50">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Dữ liệu & Nguồn OER' : 'Datasets & OER'}</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              16 {isVi ? 'Datasets & 21 OER' : 'Datasets & 21 OER'}
            </div>
          </div>
        </div>
      </div>

      {/* 3B. Learning Science: 4-Dimensional Mastery Separation & Explainable Adaptive Recommendations */}
      {masteryDims && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 4-Dimensional Mastery Separation */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {isVi
                      ? 'Phân Tách 4 Chiều Năng Lực (Learning Science Mastery Model)'
                      : '4-Dimensional Mastery Separation (Learning Science Engine)'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {masteryDims.confidence_note ||
                    (isVi
                      ? 'Tách biệt rõ Tiến độ hoàn thành, Điểm bài kiểm tra, Độ thành thạo ước lượng và Kỹ năng thực hành code.'
                      : 'Strictly separates Completion Rate, Assessment Performance, Estimated Mastery, and Demonstrated Project Skill.')}
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {isVi ? 'Độ tin cậy:' : 'Confidence:'} {masteryDims.confidence_level}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    {isVi ? '1. Tỷ lệ Hoàn thành (Completion)' : '1. Completion Rate'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {masteryDims.completion_rate}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, masteryDims.completion_rate || 0)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    {isVi ? '2. Điểm Đánh giá (Assessment)' : '2. Assessment Performance'}
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-extrabold">
                    {masteryDims.assessment_performance}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, masteryDims.assessment_performance || 0)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    {isVi ? '3. Độ Thành thạo Ước lượng' : '3. Estimated Concept Mastery'}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                    {masteryDims.estimated_mastery}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, masteryDims.estimated_mastery || 0)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    {isVi ? '4. Kỹ năng Thực hành & Dự án' : '4. Demonstrated Project Skill'}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                    {masteryDims.demonstrated_project_skill}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, masteryDims.demonstrated_project_skill || 0)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Explainable Adaptive Recommendations */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-3.5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {isVi ? 'Đề Xuất Học Thích Ứng Có Giải Thích' : 'Explainable Adaptive Recommendations'}
                  </span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {adaptiveRecs.slice(0, 2).map((rec, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLesson(rec.lesson_id)}
                    className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200/60 dark:border-slate-700 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {rec.recommendation_type} &bull; {rec.priority}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {rec.lesson_title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {rec.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                {isVi
                  ? 'Đồ thị điều kiện tiên quyết 15 Lộ trình (Prerequisite DAG): Hợp lệ'
                  : '15-Track Prerequisite DAG Status: Verified Acyclic'}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
        </div>
      )}

      {/* 4. Clear Two-Audience Learning Path Matrix (Beginner vs Applied AI Engineer) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {isVi ? 'Bản Đồ 15 Lộ Trình Học Theo 2 Đối Tượng (Tracks 0–14)' : '15-Track Learning Roadmap for 2 Distinct Audiences (Tracks 0–14)'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isVi
                ? 'Bài kiểm tra năng lực, Bộ dữ liệu thật, Nguồn học liệu OER, Flashcards và Phòng Lab IDE đã được lồng ghép trực tiếp vào từng bài học.'
                : 'Diagnostic placement, real open datasets, OER citations, flashcards, and Python IDE labs are embedded directly inside each lesson.'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('learn')}
            className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{isVi ? 'Mở trang 15 Lộ trình & 21 Nguồn Học liệu Mở OER' : 'Open Full 15-Track Curriculum & 21-Source OER Registry'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audience 1: Complete Beginner Path (5 Tracks) */}
          <div
            className={`rounded-3xl border p-6 space-y-4 transition ${
              persona === 'beginner'
                ? 'bg-white dark:bg-slate-900 border-emerald-400/80 dark:border-emerald-700 shadow-sm'
                : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {isVi ? 'Đối tượng 1: Người Mới Bắt Đầu' : 'Path 1: Complete Beginner'}
                    </h3>
                    {persona === 'beginner' && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {isVi ? 'Lộ trình của bạn' : 'Active Path'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isVi
                      ? '5 Lộ trình Nền tảng: Khái niệm AI, Python Vector hóa, Giải tích, Khoa học Dữ liệu & Học máy Cổ điển'
                      : '5 Core Tracks: AI Foundations, Vectorized Python, Calculus, Data Science & Classical ML'}
                  </p>
                </div>
              </div>

              {persona !== 'beginner' && (
                <button
                  onClick={() => setPersona('beginner')}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 transition shrink-0"
                >
                  {isVi ? 'Chọn lộ trình này' : 'Switch to Beginner'}
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {beginnerTracks.map((tr, i) => {
                const lessons = tr.modules.flatMap((m) => m.lessons);
                const doneCount = lessons.filter((l) => completedSet.has(l.id)).length;
                const firstLesson = lessons[0];
                return (
                  <div
                    key={tr.id}
                    onClick={() => firstLesson && openLesson(firstLesson.id)}
                    className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 cursor-pointer transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                        Beginner Track {i + 1} &bull; {lessons.length} {isVi ? 'bài học' : 'lessons'}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {tr.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{tr.tagline}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                        {doneCount}/{lessons.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audience 2: Applied AI Engineer Path (10 Tracks) */}
          <div
            className={`rounded-3xl border p-6 space-y-4 transition ${
              persona === 'engineer'
                ? 'bg-white dark:bg-slate-900 border-indigo-400/80 dark:border-indigo-700 shadow-sm'
                : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {isVi ? 'Đối tượng 2: Kỹ Sư AI Thực Chiến' : 'Path 2: Applied AI Engineer'}
                    </h3>
                    {persona === 'engineer' && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {isVi ? 'Lộ trình của bạn' : 'Active Path'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isVi
                      ? '10 Lộ trình Chuyên sâu (Tracks 5–14): Deep Learning, Thị giác Máy tính, LLM RAG, Khuếch tán Multimodal, AI Agents, MLOps, AI Có trách nhiệm, Nghiên cứu Ablation, Chuỗi thời gian & Đồ án Capstone'
                      : '10 Advanced Tracks (Tracks 5–14): Deep Learning, Vision, LLM RAG, Diffusion, AI Agents, MLOps, Responsible AI, Research Ablations, Time-Series & Capstone'}
                  </p>
                </div>
              </div>

              {persona !== 'engineer' && (
                <button
                  onClick={() => setPersona('engineer')}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 transition shrink-0"
                >
                  {isVi ? 'Chọn lộ trình này' : 'Switch to Engineer'}
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {engineerTracks.map((tr, i) => {
                const lessons = tr.modules.flatMap((m) => m.lessons);
                const doneCount = lessons.filter((l) => completedSet.has(l.id)).length;
                const firstLesson = lessons[0];
                return (
                  <div
                    key={tr.id}
                    onClick={() => firstLesson && openLesson(firstLesson.id)}
                    className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 cursor-pointer transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                        Engineer Track {i + 1} &bull; {lessons.length} {isVi ? 'bài học' : 'lessons'}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {tr.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{tr.tagline}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                        {doneCount}/{lessons.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick News Radar Preview inside Engineer Card */}
            <div
              onClick={() => setActiveView('news')}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-indigo-50/60 dark:from-slate-800/80 dark:to-indigo-950/30 border border-sky-200/70 dark:border-slate-700 cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isVi
                    ? 'Radar Tin tức AI: Cập nhật trực tiếp từ arXiv, OpenAI, DeepMind, Hugging Face'
                    : 'Live AI News Radar: Real-time feeds from arXiv, OpenAI, DeepMind & Hugging Face'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* 4.5 Marketing Value Proposition & Comparison Matrix ("Tại Sao Chọn T Lab AI?") */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isVi ? 'Tại Sao Nên Chọn T Lab AI?' : 'Why Choose T Lab AI?'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {isVi
              ? 'Khác Biệt Hoàn Toàn Với Cách Học AI Truyền Thống'
              : 'Fundamentally Different From Passive AI Tutorials'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isVi
              ? 'Không chỉ là xem video thụ động. T Lab AI mang đến một Hệ điều hành học tập hoàn chỉnh — kết hợp giữa giáo trình cấu trúc chuẩn đại học, thực hành code trên dữ liệu thực tế và AI Mentor đồng hành.'
              : 'Not just another video course. T Lab AI gives you a full learning operating system — combining university-grade syllabus, browser Python IDE with real datasets, and 24/7 AI mentoring.'}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Khóa học Video Truyền thống */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold uppercase text-rose-400 tracking-wider">
                {isVi ? 'Khóa Học Video Truyền Thống' : 'Passive Video Courses'}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Xem video thụ động, dễ nản và nhanh quên' : 'Passive watching, low retention rate'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Dữ liệu mock giả lập, không sát thực tế doanh nghiệp' : 'Synthetic toy datasets disconnected from production'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Tốn hàng giờ cài đặt môi trường Python bị lỗi' : 'Painful local setup hurdles and dependency conflicts'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Học phí đắt đỏ ($50 - $500/khóa)' : 'Costly subscription fees ($50-$500/course)'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: T Lab AI - The Winner Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-900/90 to-indigo-950 border-2 border-indigo-400/80 space-y-3 flex flex-col justify-between relative shadow-lg shadow-indigo-950/50">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-500 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
              {isVi ? 'Lựa chọn tối ưu' : 'Recommended'}
            </div>
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>T Lab AI Learning OS</span>
              </div>
              <ul className="space-y-2.5 text-xs text-white">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold">{isVi ? '15 Lộ trình chuẩn Stanford / MIT / Google' : '15 Tracks aligned with Stanford & MIT curricula'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold">{isVi ? '100% dữ liệu thực tế từ 21 nguồn OER mở' : '100% real-world open datasets from 21 OER sources'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold">{isVi ? 'Monaco IDE Sandbox chạy Python trực tiếp trên web' : 'Browser Monaco IDE with safe Python AST sandbox'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold">{isVi ? 'Trợ lý AI Socratic 24/7 & 100% Miễn phí trọn đời' : '24/7 Socratic AI mentor, 100% Free forever'}</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => (nextRecommendedLesson ? openLesson(nextRecommendedLesson.id) : setActiveView('learn'))}
              className="w-full mt-2 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isVi ? 'Bắt Đầu Trải Nghiệm Ngay' : 'Get Started Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Tự Prompt Chatbot đơn thuần */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                {isVi ? 'Chỉ Tự Prompt Chatbot' : 'Ad-hoc Chatbot Prompting'}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Không có lộ trình thứ tự, dễ bị hổng kiến thức gốc' : 'No structured prerequisite knowledge graph'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Dễ bị ảo giác (hallucination) trong thuật toán toán học' : 'Prone to mathematical and architectural hallucinations'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Không có môi trường chạy code đa file và trực quan hóa' : 'No multi-file code execution or interactive graphs'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isVi ? 'Không theo dõi chuỗi ngày học (streak) và lưu tiến độ' : 'No learning streak or verified project portfolio'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 5. Earned Achievements & Badges */}
      {badges.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('badgesTitle')}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {badges.filter((b) => b.unlocked).length}/{badges.length} {isVi ? 'đã mở khóa' : 'unlocked'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border flex flex-col items-center text-center space-y-1.5 transition ${
                  b.unlocked
                    ? 'bg-indigo-50/40 dark:bg-slate-800 border-indigo-200/80 dark:border-indigo-800/60'
                    : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    b.unlocked
                      ? 'bg-white dark:bg-slate-900 shadow-2xs border border-indigo-100 dark:border-indigo-900'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {renderBadgeIcon(b.icon, b.unlocked)}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{b.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
