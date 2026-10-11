import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap, Terminal, Newspaper, ArrowRight,
  Compass, Flame, Award,
  BookOpen, Sparkles
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setMode, setActiveView, openLesson, progress, t, language } = useApp();
  const isVi = language === 'vi';

  const completedSet = new Set(progress?.completed_lesson_ids || []);
  
  // Dynamic next lesson determination
  let nextLessonId = 'lesson-foundations-what-is-ai';
  let nextLessonTitle = isVi 
    ? 'AI là gì? Phân biệt AI, ML, Deep Learning & Generative AI' 
    : 'What is AI? Demystifying AI, ML, Deep Learning & Generative AI';
  let nextTrackTitle = isVi ? 'Track A: Nền tảng AI' : 'Track A: AI Foundations';

  if (!completedSet.has('lesson-foundations-what-is-ai')) {
    nextLessonId = 'lesson-foundations-what-is-ai';
    nextLessonTitle = isVi ? 'AI là gì? Phân biệt AI, ML, Deep Learning & GenAI' : 'What is AI? Demystifying AI, ML, Deep Learning & Generative AI';
    nextTrackTitle = isVi ? 'Track A: Nền tảng AI' : 'Track A: AI Foundations';
  } else if (!completedSet.has('lesson-foundations-generalization')) {
    nextLessonId = 'lesson-foundations-generalization';
    nextLessonTitle = isVi ? 'Tính Tổng quát hóa, Quá khớp (Overfitting) & Dưới khớp' : 'Generalization, Overfitting & Underfitting';
    nextTrackTitle = isVi ? 'Track A: Nền tảng AI' : 'Track A: AI Foundations';
  } else if (!completedSet.has('lesson-python-vectorization')) {
    nextLessonId = 'lesson-python-vectorization';
    nextLessonTitle = isVi ? 'Tính toán Vector hóa: Tại sao vòng lặp Python thất bại trong AI' : 'Vectorized Computing: Why Python Loops Fail in AI';
    nextTrackTitle = isVi ? 'Track B: Python cho AI' : 'Track B: Python for AI';
  } else if (!completedSet.has('lesson-math-gradient-descent')) {
    nextLessonId = 'lesson-math-gradient-descent';
    nextLessonTitle = isVi ? 'Giải mã Gradient Descent: Hạ dốc trên sườn núi mất mát' : 'Gradient Descent Demystified: Stepping Down Loss Landscape';
    nextTrackTitle = isVi ? 'Track C: Toán học cho AI' : 'Track C: Mathematics for AI';
  } else if (!completedSet.has('lesson-ml-decision-trees')) {
    nextLessonId = 'lesson-ml-decision-trees';
    nextLessonTitle = isVi ? 'Cây Quyết Định & Độ Hỗn Loạn Thông Tin (Entropy)' : 'Decision Trees & Information Entropy';
    nextTrackTitle = isVi ? 'Track D: Học máy Cổ điển' : 'Track D: Classical Machine Learning';
  } else if (!completedSet.has('lesson-dl-neural-activations')) {
    nextLessonId = 'lesson-dl-neural-activations';
    nextLessonTitle = isVi ? 'Hàm Kích Hoạt Phi Tuyến: ReLU, Sigmoid & GELU' : 'Non-Linear Activations: ReLU, Sigmoid & GELU';
    nextTrackTitle = isVi ? 'Track E: Học sâu & Mạng nơ-ron' : 'Track E: Deep Learning';
  } else if (!completedSet.has('lesson-llm-embeddings-vector-search')) {
    nextLessonId = 'lesson-llm-embeddings-vector-search';
    nextLessonTitle = isVi ? 'Không Gian Vector Ngữ Nghĩa & Tìm Kiếm Cosine Similarity' : 'Semantic Vector Spaces & Cosine Similarity Search';
    nextTrackTitle = isVi ? 'Track F: Kỹ thuật LLM' : 'Track F: LLM Engineering';
  } else {
    nextLessonId = 'lesson-mlops-latency-profiling';
    nextLessonTitle = isVi ? 'Đo lường Độ trễ P99, Thông lượng & Lượng tử hóa' : 'Inference Latency, Throughput & Quantization';
    nextTrackTitle = isVi ? 'Track G: Hệ thống AI & MLOps' : 'Track G: AI Systems & MLOps';
  }

  const streakDays = progress?.streak_days || 3;
  const currentXp = progress?.xp || 150;
  const todayXp = progress?.today_xp || 30;
  const dailyGoalXp = progress?.daily_goal_xp || 50;
  const levelNum = progress?.level || 2;
  const levelTitle = progress?.level_title || (isVi ? 'Nhà Thám Hiểm AI' : 'AI Explorer');
  const badges = progress?.badges || [];
  const completedLessons = progress?.completed_lesson_ids.length || 0;
  const totalLessons = progress?.total_lessons_count || 7;
  const progressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));
  const dailyGoalPercent = Math.min(100, Math.round((todayXp / dailyGoalXp) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Soft, Calming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50/90 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/30 border border-indigo-150/80 dark:border-slate-800 p-8 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {t('heroHeading')}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('heroSubheading')}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => openLesson(nextLessonId)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition hover:scale-[1.01]"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('btnContinueLearning')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setMode('engineer');
                setActiveView('workspace');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200/90 dark:border-slate-700 shadow-xs transition"
            >
              <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('btnOpenIde')}</span>
            </button>
            {!progress?.diagnostic_completed && (
              <button
                onClick={() => setActiveView('diagnostic')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-800 dark:text-sky-200 font-medium text-sm border border-sky-200/80 dark:border-sky-800 transition"
              >
                <Compass className="w-4 h-4 text-amber-500" />
                <span>{t('btnTakeDiagnostic')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Calming Ambient Circles */}
        <div className="absolute right-[-40px] top-[-40px] w-80 h-80 rounded-full bg-gradient-to-br from-indigo-200/30 to-sky-200/20 dark:from-indigo-900/10 dark:to-sky-900/10 blur-3xl pointer-events-none" />
      </div>

      {/* Gamification Dashboard: Streak, Daily Goal, Level, Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Streak */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/70 dark:border-amber-800/60">
            <Flame className="w-6 h-6 fill-current text-amber-500 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('streakTitle')}</div>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">{streakDays} {t('streakLabel')}</div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{t('streakKeep')}</div>
          </div>
        </div>

        {/* Card 2: Today's XP & Daily Goal */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('dailyGoalTitle')}</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{todayXp}/{dailyGoalXp} {t('xpLabel')}</span>
          </div>
          <div className="my-2 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>{t('dailyGoalTotal')}:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{currentXp} {t('xpLabel')}</span>
          </div>
        </div>

        {/* Card 3: Level & Tier */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/70 dark:border-indigo-800/60 font-black text-lg">
            L{levelNum}
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('levelTitle')}</div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">{levelTitle}</div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{currentXp >= 300 ? (isVi ? 'Cấp Tối đa' : 'Max Tier') : `${300 - currentXp} XP ${isVi ? 'lên cấp mới' : 'to next tier'}`}</div>
          </div>
        </div>

        {/* Card 4: 7 Tracks Overall Progress */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{t('curriculumProgressTitle')}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="my-2 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>{t('completedLabel')}:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{completedLessons}/{totalLessons}</span>
          </div>
        </div>
      </div>

      {/* Recommended Next Lesson Card */}
      <div className="bg-gradient-to-r from-sky-50/70 to-indigo-50/50 dark:from-slate-850 dark:to-slate-800 p-6 rounded-2xl border border-sky-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('recommendedNext')} &bull; {nextTrackTitle}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {nextLessonTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isVi 
              ? 'Hoàn thành bài tập sandbox và trả lời bài trắc nghiệm để nhận +40 XP và giữ vững chuỗi học tập!' 
              : 'Complete sandbox exercises and pass the assessment to earn +40 XP and maintain your streak!'}
          </p>
        </div>
        <button
          onClick={() => openLesson(nextLessonId)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition shrink-0"
        >
          {t('resumeLessonBtn')} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Earned Badges Section */}
      {badges.length > 0 && (
        <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('badgesTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center space-y-1.5 hover:border-indigo-300 dark:hover:border-indigo-600 transition"
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{b.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Three Core Pillars Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('pillarsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div
            onClick={() => setActiveView('learn')}
            className="group cursor-pointer bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-750 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:shadow-sm transition space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {t('pillar1Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar1Desc')}
            </p>
            <div className="pt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              {t('pillar1Action')}
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => {
              setMode('engineer');
              setActiveView('workspace');
            }}
            className="group cursor-pointer bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-750 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs hover:shadow-sm transition space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              {t('pillar2Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar2Desc')}
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {t('pillar2Action')}
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => setActiveView('news')}
            className="group cursor-pointer bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-750 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs hover:shadow-sm transition space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/60 dark:border-sky-800">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
              {t('pillar3Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillar3Desc')}
            </p>
            <div className="pt-2 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              {t('pillar3Action')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
