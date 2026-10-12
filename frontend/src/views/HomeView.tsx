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

  // Filter tracks by the 2 audiences
  const beginnerTracks = tracks.filter(
    (tr) => tr.target_audience === 'beginner' || ['track-ai-foundations', 'track-python-for-ai', 'track-math-for-ai', 'track-classical-ml'].includes(tr.id)
  );
  const engineerTracks = tracks.filter(
    (tr) => tr.target_audience === 'engineer' || ['track-deep-learning', 'track-llm-engineering', 'track-mlops-systems'].includes(tr.id)
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
  const totalLessons = progress?.total_lessons_count || 8;
  const progressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));
  const dailyGoalPercent = Math.min(100, Math.round((todayXp / dailyGoalXp) * 100));

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
                    ? (isVi ? 'Chế độ: Kỹ sư AI Thực chiến (Tracks E–G)' : 'Track: Applied AI Engineer (Tracks E–G)')
                    : (isVi ? 'Chế độ: Người mới bắt đầu từ số 0 (Tracks A–D)' : 'Track: Complete Beginner Path (Tracks A–D)')}
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {persona === 'engineer'
                ? (isVi
                    ? 'Làm chủ Kiến trúc Mạng Nơ-ron, Hệ thống RAG & Tối ưu Độ trễ MLOps'
                    : 'Master Deep Neural Architectures, RAG Vector Search & MLOps Serving')
                : (isVi
                    ? 'Xây dựng Nền tảng AI Vững chắc: Từ Trực quan, Toán học đến Code Thực tế'
                    : 'Build a Rock-Solid AI Foundation: Intuition, Clear Math & Real Datasets')}
            </h1>

            <p className="text-indigo-100/85 text-xs sm:text-sm leading-relaxed max-w-xl">
              {isVi
                ? 'Mỗi bài học đều tích hợp sẵn Bộ dữ liệu Mở chuẩn quốc tế (UCI, StatLib, Hugging Face, MLPerf), Bảng giải nghĩa từng ký hiệu Toán học và Phòng Lab Code Python trực tiếp.'
                : 'Every lesson embeds real open-source datasets (UCI, StatLib, Hugging Face, MLPerf), step-by-step mathematical symbol guides, and an interactive Python Code Lab.'}
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
              <span>{isVi ? 'Xem toàn bộ 7 Lộ trình' : 'Explore All 7 Tracks'}</span>
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
            <div className="text-[11px] font-bold text-slate-400 uppercase">{isVi ? 'Dữ liệu Thực tế' : 'Real Open Datasets'}</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              8 {isVi ? 'Bộ chuẩn Quốc tế' : 'Verified Datasets'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Clear Two-Audience Learning Path Matrix (Beginner vs Applied AI Engineer) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {isVi ? 'Bản Đồ Lộ Trình Học Theo 2 Đối Tượng Rõ Ràng' : 'Structured Learning Roadmap for 2 Distinct Audiences'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isVi
                ? 'Bài kiểm tra năng lực, Bộ dữ liệu thật và Phòng Lab IDE đã được lồng ghép trực tiếp vào từng bài học dưới đây.'
                : 'Diagnostic placement, real open datasets, and Python IDE labs are embedded directly inside each lesson.'}
            </p>
          </div>
          <button
            onClick={() => setActiveView('learn')}
            className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{isVi ? 'Mở trang Lộ trình & Bài kiểm tra đầu vào' : 'Open Full Curriculum & Placement Check'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audience 1: Complete Beginner Path (Tracks A-D) */}
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
                      ? '4 Lộ trình (A → D): Từ khái niệm AI cơ bản, NumPy, Giải tích đến Học máy Cổ điển'
                      : '4 Tracks (A → D): AI Foundations, Vectorized Python, Calculus & Classical ML'}
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
                        Track {String.fromCharCode(65 + i)} &bull; {lessons.length} {isVi ? 'bài học' : 'lessons'}
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

          {/* Audience 2: Applied AI Engineer Path (Tracks E-G) */}
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
                      ? '3 Lộ trình Chuyên sâu (E → G): Deep Learning, LLM RAG Vector Search & MLOps'
                      : '3 Advanced Tracks (E → G): Deep Learning, LLM Vector Search & MLOps Production'}
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
                        Track {String.fromCharCode(69 + i)} &bull; {lessons.length} {isVi ? 'bài học' : 'lessons'}
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
