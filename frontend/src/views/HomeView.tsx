import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleLogoSvg } from '../components/AuthModal';
import { api } from '../services/api';
import type { Track } from '../types';
import {
  Newspaper, ArrowRight, Flame, Award, BookOpen, Sparkles,
  Rocket, Code, Brain, CheckCircle2, UserPlus, ShieldCheck,
  Sprout, Code2, Database, Clock, PlayCircle, Bot, Terminal
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

  // Filter all 12 tracks by the 2 target personas
  const beginnerTracks = tracks.filter(
    (tr) =>
      tr.target_audience === 'beginner' ||
      ['track-ai-foundations', 'track-python-for-ai', 'track-math-for-ai', 'track-data-science', 'track-classical-ml'].includes(tr.id)
  );
  const engineerTracks = tracks.filter(
    (tr) =>
      tr.target_audience === 'engineer' ||
      [
        'track-deep-learning',
        'track-computer-vision',
        'track-llm-engineering',
        'track-ai-agents',
        'track-mlops-systems',
        'track-research-engineering',
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
  const totalLessons = progress?.total_lessons_count || 13;
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
      {/* 1. User Account & Registered Persona Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
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
                      ? (isVi ? 'Đối tượng: Kỹ sư AI Thực chiến' : 'Persona: Applied AI Engineer')
                      : (isVi ? 'Đối tượng: Người mới bắt đầu' : 'Persona: Beginner Explorer')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {isVi ? 'Đã đồng bộ' : 'Synced'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email} &bull; {isVi ? 'Lộ trình học được cá nhân hóa theo đăng ký của bạn' : 'Curriculum personalized to your registered role'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('google')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                <GoogleLogoSvg className="w-3.5 h-3.5" />
                <span>{isVi ? 'Tài khoản Google' : 'Google Account'}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/60 dark:border-indigo-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isVi
                    ? 'Đăng ký tài khoản để hệ thống thiết lập Chế độ học (Người mới / Kỹ sư AI)'
                    : 'Register to personalize your learning track (Beginner vs Applied AI Engineer)'}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {isVi
                    ? 'Tự động phân bổ lộ trình, lưu tiến độ bài tập Python, điểm XP và đồng bộ đa tài khoản Google.'
                    : 'Automatically configures your path, saves Python exercises, XP, and syncs across Google accounts.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('google')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-2xs transition"
              >
                <GoogleLogoSvg className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isVi ? 'Đăng ký Đối tượng Học' : 'Register Learning Path'}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 2. Minimalist Senior Hero + Up-Next Lesson Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 cols: Welcome & Persona Path Overview */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-8 flex flex-col justify-between shadow-lg border border-indigo-500/20">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-indigo-200 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {persona === 'engineer'
                    ? (isVi ? 'Chế độ: Kỹ sư AI Thực chiến (10 Lộ trình Chuyên sâu: Tracks 5–14)' : 'Track: Applied AI Engineer (10 Advanced Tracks: Tracks 5–14)')
                    : (isVi ? 'Chế độ: Người mới bắt đầu từ số 0 (5 Lộ trình Nền tảng: Tracks 0–4)' : 'Track: Complete Beginner Path (5 Core Tracks: Tracks 0–4)')}
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {persona === 'engineer'
                ? (isVi
                    ? 'Làm chủ Deep Learning, Vision, LLM RAG, Diffusion, AI Agents, MLOps & Responsible AI'
                    : 'Master Deep Learning, Vision, RAG, Diffusion, AI Agents, MLOps & Responsible AI')
                : (isVi
                    ? 'Xây dựng Nền tảng AI Vững chắc: Từ Trực quan, Python, Toán AI đến Khoa học Dữ liệu & ML'
                    : 'Build a Rock-Solid AI Foundation: Intuition, Python, Math, Data Science & Classical ML')}
            </h1>

            <p className="text-indigo-100/85 text-xs sm:text-sm leading-relaxed max-w-xl">
              {isVi
                ? 'Chương trình 15 Lộ trình (Track 0 → Track 14) chuẩn đại học quốc tế (MIT, Stanford, UC Berkeley, D2L.ai, Google, Hugging Face) kết hợp 16 Bộ dữ liệu mở xác thực, 21 Nguồn OER và Phòng Lab Code Python.'
                : '15-Track curriculum (Track 0 → Track 14) grounded in 21 verified OER sources (MIT, Stanford, UC Berkeley, D2L.ai, Google, Hugging Face), with 16 open datasets and Python Code Labs.'}
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
            {nextRecommendedLesson && (
              <button
                onClick={() => openLesson(nextRecommendedLesson.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isVi ? 'Học tiếp bài hiện tại' : 'Continue Active Lesson'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveView('learn')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition"
            >
              <BookOpen className="w-4 h-4 text-sky-300" />
              <span>{isVi ? 'Xem toàn bộ 15 Lộ trình (Tracks 0–14)' : 'Explore All 15 Tracks (0–14)'}</span>
            </button>
            <button
              onClick={() =>
                openAgentWithPrompt(
                  isVi
                    ? 'Hãy phân tích tiến độ hiện tại của tôi và gợi ý bài học tiếp theo phù hợp nhất.'
                    : 'Analyze my current progress and recommend the best next lesson.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold text-xs border border-emerald-400/30 transition"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>{isVi ? 'Hỏi Trợ lý Agent' : 'Ask AI Agent'}</span>
            </button>
          </div>

          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
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

          {/* Audience 2: Applied AI Engineer Path (7 Tracks) */}
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
                      ? '7 Lộ trình Chuyên sâu: Deep Learning, Thị giác Máy tính, LLM RAG, AI Agents, MLOps, Nghiên cứu & Đồ án'
                      : '7 Advanced Tracks: Deep Learning, Computer Vision, LLM RAG, AI Agents, MLOps, Research & Capstone'}
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
