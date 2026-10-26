import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { Lesson, CodeExecutionResponse } from '../types';
import { PerceptronWidget } from '../components/widgets/PerceptronWidget';
import { GradientDescentWidget } from '../components/widgets/GradientDescentWidget';
import { FormulaGuide } from '../components/FormulaGuide';
import {
  BookOpen, Clock, Target, Lightbulb, Play, CheckCircle2,
  AlertTriangle, ArrowRight, ArrowLeft, Check, X, Zap,
  Database, ExternalLink, Layers, Bot, Terminal, RotateCcw, Sparkles, Copy
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const {
    activeLessonId,
    openLesson,
    setActiveView,
    refreshProgress,
    t,
    language,
    theme,
    openAgentWithPrompt
  } = useApp();
  const isVi = language === 'vi';

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Code Exercise state
  const [learnerCode, setLearnerCode] = useState<string>('');
  const [executingCode, setExecutingCode] = useState<boolean>(false);
  const [codeResult, setCodeResult] = useState<CodeExecutionResponse | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<any[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [earnedXpToast, setEarnedXpToast] = useState<string | null>(null);
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<number, boolean>>({});
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setReadingProgress(Math.min(100, Math.round((window.scrollY / total) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  useEffect(() => {
    if (!activeLessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        setCodeResult(null);
        setQuizSubmitted(false);
        setSelectedAnswers({});
        setQuizFeedback([]);
        setEarnedXpToast(null);
        setRevealedFlashcards({});

        const data = await api.getLesson(activeLessonId, language);
        setLesson(data);
        if (data.code_exercise) {
          setLearnerCode(data.code_exercise.starter_code);
        }
      } catch (err: any) {
        setError(err.message || (isVi ? 'Không thể tải nội dung bài học' : 'Unable to load lesson content'));
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [activeLessonId, language, isVi]);

  const handleRunCode = async () => {
    if (!lesson?.code_exercise) return;
    try {
      setExecutingCode(true);
      const res = await api.executeCode(learnerCode, lesson.code_exercise.id);
      setCodeResult(res);

      if (res.passed_tests) {
        try {
          await api.submitExercisePass(lesson.id);
          await refreshProgress();
          setEarnedXpToast(
            isVi
              ? '+30 XP: Chúc mừng bạn đã vượt qua toàn bộ kiểm thử bài tập Code!'
              : '+30 XP: Code exercise unit tests passed successfully!'
          );
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err: any) {
      console.error(err);
      setCodeResult({
        success: false,
        stdout: '',
        stderr:
          err.message ||
          (isVi ? 'Lỗi thực thi trong sandbox hoặc mất kết nối mạng.' : 'Execution failed in sandbox or network timeout.'),
        exit_code: 1,
        execution_time_ms: 0,
        security_flagged: false,
        passed_tests: false,
        test_feedback: isVi ? 'Không thể kết nối đến máy chủ thực thi mã nguồn.' : 'Could not connect to sandbox runner.'
      });
    } finally {
      setExecutingCode(false);
    }
  };

  const handleQuizOptionSelect = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleQuizSubmit = async () => {
    if (!lesson) return;
    try {
      const res = await api.submitQuiz(lesson.id, selectedAnswers, language);
      setQuizSubmitted(true);
      setQuizFeedback(res.feedback);
      setQuizScore(res.score_percentage);
      await refreshProgress();

      if (res.passed) {
        setEarnedXpToast(
          res.score_percentage >= 100
            ? isVi
              ? '+40 XP: Đạt 100% điểm Quiz! Mở khóa huy hiệu Bậc Thầy Trắc Nghiệm!'
              : '+40 XP: Perfect 100% Quiz score! Quiz Master badge unlocked!'
            : isVi
            ? '+30 XP: Bạn đã vượt qua bài kiểm tra trắc nghiệm!'
            : '+30 XP: Assessment passed successfully!'
        );
      }
    } catch (err: any) {
      console.error(err);
      alert((isVi ? 'Không thể nộp bài trắc nghiệm: ' : 'Unable to submit quiz: ') + (err.message || 'Error'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">
          {isVi ? 'Đang tải nội dung bài học, công thức Toán và bộ dữ liệu thực tế...' : 'Loading lesson, math guide, and real dataset...'}
        </p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
        <h3 className="font-bold text-rose-800 dark:text-rose-300">
          {isVi ? 'Không Thể Tải Bài Học' : 'Failed to Load Lesson'}
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
          {error || (isVi ? 'Không tìm thấy bài học' : 'Lesson not found')}
        </p>
        <button
          onClick={() => setActiveView('learn')}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
        >
          {t('backToCurriculum')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Toast Notification */}
      {earnedXpToast && (
        <div className="sticky top-20 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-bounce">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>{earnedXpToast}</span>
          </div>
          <button onClick={() => setEarnedXpToast(null)} className="text-emerald-100 hover:text-white ml-3">
            &times;
          </button>
        </div>
      )}

      {/* Sticky Quick-Jump Navigation Bar & Reading Progress */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
          <button
            type="button"
            onClick={() => scrollToSection('section-intuition')}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            📖 {isVi ? 'Lý thuyết' : 'Theory'}
          </button>
          {lesson.formula_guide && (
            <button
              type="button"
              onClick={() => scrollToSection('section-formula')}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 hover:bg-indigo-100 transition"
            >
              📐 {isVi ? 'Công thức' : 'Math'}
            </button>
          )}
          {lesson.real_dataset && (
            <button
              type="button"
              onClick={() => scrollToSection('section-dataset')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 hover:bg-emerald-100 transition"
            >
              📊 {isVi ? 'Dữ liệu thật' : 'Dataset'}
            </button>
          )}
          {lesson.code_exercise && (
            <button
              type="button"
              onClick={() => scrollToSection('section-code-lab')}
              className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800 hover:bg-sky-100 transition"
            >
              💻 {isVi ? 'Phòng Lab Code' : 'Code Lab'}
            </button>
          )}
          {lesson.quiz && (
            <button
              type="button"
              onClick={() => scrollToSection('section-quiz')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 hover:bg-amber-100 transition"
            >
              📝 {isVi ? 'Trắc nghiệm' : 'Quiz'}
            </button>
          )}
          {lesson.source_references && lesson.source_references.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection('section-oer')}
              className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
            >
              📚 {isVi ? 'Nguồn OER' : 'Sources'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 shrink-0 ml-auto">
          <span>{readingProgress}%</span>
          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-150"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveView('learn')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToCurriculum')}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" /> {lesson.estimated_minutes} {t('minuteRead')}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800">
            {lesson.target_audience === 'engineer'
              ? isVi
                ? '💻 Cấp độ Kỹ sư AI'
                : '💻 Applied AI Engineer'
              : isVi
              ? '🌱 Dành cho Người mới'
              : '🌱 Beginner Friendly'}
          </span>
          <button
            type="button"
            onClick={() =>
              openAgentWithPrompt(
                isVi
                  ? `Hãy giải thích chi tiết và trực quan bài học "${lesson.title}" cho tôi.`
                  : `Please explain the lesson "${lesson.title}" intuitively.`
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isVi ? 'Hỏi Trợ lý Agent' : 'Ask AI Agent'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header & Learning Objectives */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {lesson.content_version && (
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              v{lesson.content_version} &bull; {lesson.review_status || 'PUBLISHED'}
            </span>
          )}
          {lesson.last_verified_date && (
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              {isVi ? 'Xác minh:' : 'Verified:'} {lesson.last_verified_date}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {lesson.why_this_matters && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
            <strong className="font-extrabold uppercase tracking-wider text-[11px] text-indigo-600 dark:text-indigo-400 block mb-1">
              {isVi ? 'Tại Sao Chủ Đề Này Quan Trọng (Why This Matters):' : 'Why This Matters in Real Systems:'}
            </strong>
            {lesson.why_this_matters}
          </div>
        )}

        <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 rounded-2xl p-5 space-y-2.5">
          <h3 className="text-xs font-extrabold text-sky-900 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{t('lessonObjectives')}</span>
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 1: Intuitive Explanation */}
      <div id="section-intuition" className="space-y-3 scroll-mt-28">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>{t('section1Intuition')}</span>
        </h2>
        <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          {lesson.intuitive_explanation}
        </div>
      </div>

      {/* Section 1B: Comprehensive Deep-Dive Notes (New Upgraded Content) */}
      {lesson.deep_dive_notes && lesson.deep_dive_notes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>
              {isVi
                ? 'Phân Tích Chuyên Sâu & Kiến Thức Thực Chiến'
                : 'Comprehensive Deep-Dive & Engineering Insights'}
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {lesson.deep_dive_notes.map((note, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Simulation Widget */}
      {lesson.interactive_widget && (
        <div className="space-y-2">
          {lesson.interactive_widget.type === 'perceptron' && <PerceptronWidget />}
          {lesson.interactive_widget.type === 'gradient_descent' && <GradientDescentWidget />}
        </div>
      )}

      {/* Section 2: Formal Formula Guide & Symbol Breakdown */}
      <div id="section-formula" className="space-y-3 scroll-mt-28">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>{t('section2Formal')}</span>
          </h2>
          <button
            type="button"
            onClick={() =>
              openAgentWithPrompt(
                isVi
                  ? `Hãy giải thích từng ký hiệu công thức Toán trong bài "${lesson.title}" và cho thêm 1 ví dụ tính nhẩm.`
                  : `Explain every symbol in the formula of "${lesson.title}" with an extra numerical example.`
              )
            }
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isVi ? 'Nhờ Agent giải thích thêm công thức này' : 'Ask Agent to explain this formula'}</span>
          </button>
        </div>
        <FormulaGuide guide={lesson.formula_guide} fallbackFormal={lesson.formal_explanation} />
      </div>

      {/* Section 2B: Embedded Real Open-Source Dataset Explorer (No Mock Data - Real Authoritative Sources) */}
      {lesson.real_dataset && (
        <div id="section-dataset" className="rounded-3xl bg-white dark:bg-slate-900 border border-emerald-300/80 dark:border-emerald-800/70 overflow-hidden shadow-xs scroll-mt-28">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-sky-50/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-b border-emerald-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  <Database className="w-3 h-3" />
                  {isVi ? 'Bộ Dữ Liệu Thực Tế Mở (Verified Open Dataset)' : 'Real Authoritative Open Dataset'}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  {lesson.real_dataset.source_org}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                  {lesson.real_dataset.license}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {lesson.real_dataset.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={lesson.real_dataset.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition shadow-2xs"
              >
                <span>{isVi ? 'Nguồn Dữ Liệu Gốc' : 'Official Source'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setActiveView('datasets')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isVi ? 'Phân tích EDA' : 'Full EDA'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lesson.real_dataset.description}
            </p>

            {/* Real Sample Rows Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-mono">
                    {lesson.real_dataset.columns.map((col) => (
                      <th key={col} className="py-2.5 px-3.5 font-extrabold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 font-mono">
                  {lesson.real_dataset.sample_rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition text-slate-800 dark:text-slate-200"
                    >
                      {lesson.real_dataset!.columns.map((col) => (
                        <td key={col} className="py-2.5 px-3.5 whitespace-nowrap">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Worked Example Code & Output Analysis */}
      {lesson.worked_example_code && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {t('section3Code')}
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Python 3.13 • Verified Real Data</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs p-5 overflow-x-auto shadow-inner leading-relaxed">
            <pre>
              <code>{lesson.worked_example_code}</code>
            </pre>
          </div>
          {lesson.output_analysis && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <strong className="font-extrabold text-emerald-800 dark:text-emerald-300 block mb-1">
                {isVi ? 'Phân Tích Đầu Ra & Ý Nghĩa Thực Nghiệm (Output Analysis):' : 'Empirical Output Analysis & Interpretation:'}
              </strong>
              {lesson.output_analysis}
            </div>
          )}
          {lesson.guided_practice && lesson.guided_practice.length > 0 && (
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
              <strong className="font-extrabold text-sky-800 dark:text-sky-300 block">
                {isVi ? 'Hướng Dẫn Thực Hành Có Định Hướng (Guided Practice):' : 'Guided Practice Walkthrough:'}
              </strong>
              <ul className="space-y-1">
                {(Array.isArray(lesson.guided_practice) ? lesson.guided_practice : [lesson.guided_practice]).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-sky-600 dark:text-sky-400">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Section 3B: Capstone Project Specification & 5-Dimension Rubric */}
      {lesson.capstone_spec && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white border border-indigo-500/30 space-y-4 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {isVi ? 'Đặc Tả Đồ Án Thực Chiến (Capstone Specification & Rubric)' : 'Production Capstone Specification & Rubric'}
            </span>
            <span className="text-xs font-mono text-emerald-300">
              {lesson.capstone_spec.dataset_and_license}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            {lesson.capstone_spec.problem_statement}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="font-extrabold text-indigo-300 uppercase text-[10px]">
                {isVi ? 'Tiêu Chí Nghiệm Thu & Chỉ Số Đánh Giá:' : 'Acceptance Criteria & Metrics:'}
              </div>
              <ul className="space-y-1 text-slate-200">
                {lesson.capstone_spec.acceptance_criteria.map((item, i) => (
                  <li key={i}>&bull; {item}</li>
                ))}
              </ul>
              {lesson.capstone_spec.evaluation_metrics.length > 0 && (
                <div className="pt-1.5 text-[11px] font-mono text-emerald-300">
                  {lesson.capstone_spec.evaluation_metrics.join(' • ')}
                </div>
              )}
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="font-extrabold text-emerald-300 uppercase text-[10px]">
                {isVi ? 'Thang Điểm Rubric 5 Chiều:' : '5-Dimension Grading Rubric:'}
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                {lesson.capstone_spec.rubric_dimensions.map((dimItem, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-indigo-200">
                      {dimItem.dimension} ({dimItem.weight}):
                    </span>{' '}
                    <span className="text-slate-300">{dimItem.passing_bar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Common Misconceptions & Practical When-To-Use / When-Not-To-Use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lesson.common_misconceptions.length > 0 && (
          <div className="p-5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl space-y-2.5">
            <h3 className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{t('section4Misconceptions')}</span>
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
              {lesson.common_misconceptions.map((misc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold">&bull;</span>
                  <span>{misc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.when_to_use_and_not_use && lesson.when_to_use_and_not_use.length > 0 && (
          <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl space-y-2.5">
            <h3 className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>
                {isVi
                  ? 'Khi Nào Nên Dùng & Không Nên Dùng (Production Trade-offs)'
                  : 'When to Use & When NOT to Use (Production Trade-offs)'}
              </span>
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
              {lesson.when_to_use_and_not_use.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 5: Embedded Monaco IDE Lab inside the Lesson */}
      {lesson.code_exercise && (
        <div id="section-code-lab" className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-500" />
                  <span>{t('section5Exercise')}</span>
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  AST Guard + 5s Timeout Subprocess
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lesson.code_exercise.instructions}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveView('workspace')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isVi ? 'Mở Dự Án IDE Đa Tệp' : 'Open Multi-File IDE'}</span>
              </button>

              <button
                type="button"
                onClick={handleRunCode}
                disabled={executingCode}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{executingCode ? t('verifyingCode') : t('runAndVerify')}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950 shadow-md">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-bold">exercise_solution.py</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyCode(learnerCode)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? (isVi ? 'Đã chép!' : 'Copied!') : (isVi ? 'Chép mã' : 'Copy')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLearnerCode(lesson.code_exercise!.starter_code)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isVi ? 'Khởi tạo lại' : 'Reset'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLearnerCode(lesson.code_exercise!.solution_code)}
                  className="hover:text-indigo-300 text-indigo-400 font-bold transition"
                >
                  {t('loadSolution')}
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'}
                value={learnerCode}
                onChange={(val) => setLearnerCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            </div>
          </div>

          {/* Test Execution Output */}
          {codeResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                codeResult.passed_tests
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {codeResult.passed_tests ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )}
                  {codeResult.passed_tests
                    ? isVi
                      ? 'Toàn bộ Kiểm thử (Unit Tests) đã Vượt qua!'
                      : 'All test assertions passed successfully!'
                    : isVi
                    ? 'Kiểm thử Thất bại hoặc Lỗi Cú pháp'
                    : 'Test assertions failed or syntax error'}
                </span>
                <span className="text-[10px] text-slate-500">{codeResult.execution_time_ms} ms</span>
              </div>
              {codeResult.stdout && <div>stdout: {codeResult.stdout}</div>}
              {codeResult.test_feedback && <div>feedback: {codeResult.test_feedback}</div>}
              {codeResult.stderr && (
                <div className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap">{codeResult.stderr}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section 5B: Active Recall & Spaced Repetition Flashcards */}
      {lesson.flashcards && lesson.flashcards.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {isVi
                  ? 'Thẻ Ghi Nhớ Chủ Động (Active Recall & Spaced Repetition Flashcards)'
                  : 'Active Recall & Spaced Repetition Flashcards'}
              </span>
            </h2>
            <span className="text-[11px] text-slate-500">
              {isVi ? 'Nhấn vào thẻ để lật đáp án' : 'Click card to reveal answer'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lesson.flashcards.map((fc, idx) => {
              const isRevealed = !!revealedFlashcards[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setRevealedFlashcards((prev) => ({ ...prev, [idx]: !prev[idx] }))
                  }
                  className="text-left p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 transition space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      <span>Flashcard #{idx + 1}</span>
                      <span>{isRevealed ? (isVi ? 'Đáp án' : 'Answer') : (isVi ? 'Câu hỏi' : 'Prompt')}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                      {fc.question}
                    </p>
                  </div>
                  {isRevealed ? (
                    <div className="pt-2 mt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      {fc.answer}
                    </div>
                  ) : (
                    <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                      {isVi ? '→ Lật thẻ kiểm tra trí nhớ' : '→ Reveal answer'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 6: Deterministic Knowledge Check Quiz */}
      {lesson.quiz.length > 0 && (
        <div id="section-quiz" className="space-y-5 pt-6 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-28">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>{t('section6Quiz')}</span>
            </h2>
            {quizScore !== null && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  quizScore >= 70
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {isVi ? 'Điểm số: ' : 'Score: '} {quizScore}%{' '}
                {quizScore >= 70 ? (isVi ? '(Đạt)' : '(Passed)') : isVi ? '(Chưa đạt)' : '(Retry)'}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {lesson.quiz.map((q, qIdx) => {
              const fb = quizFeedback.find((f) => f.question_id === q.id);

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs"
                >
                  <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {isVi
                      ? `Câu hỏi ${qIdx + 1} / ${lesson.quiz.length}`
                      : `Question ${qIdx + 1} / ${lesson.quiz.length}`}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt.id;

                      let optStyle =
                        'border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/70 dark:bg-slate-800/60';
                      if (isSelected)
                        optStyle =
                          'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold';
                      if (quizSubmitted) {
                        if (opt.is_correct)
                          optStyle =
                            'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                        else if (isSelected && !opt.is_correct)
                          optStyle =
                            'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                      }

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleQuizOptionSelect(q.id, opt.id)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt.text}</span>
                          {quizSubmitted && opt.is_correct && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {quizSubmitted && isSelected && !opt.is_correct && (
                            <X className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {fb && (
                    <div className="text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {isVi ? 'Giải thích chi tiết: ' : 'Explanation: '}
                      </span>
                      {fb.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 items-center">
            {quizSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizFeedback([]);
                  setQuizScore(null);
                  setSelectedAnswers({});
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isVi ? 'Làm lại bài kiểm tra' : 'Retake Quiz'}
              </button>
            )}
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              {t('submitQuizBtn')}
            </button>
          </div>
        </div>
      )}

      {/* Section 7: Mastery Criteria & Verified OER / Academic Source Provenance */}
      {((lesson.mastery_criteria && lesson.mastery_criteria.length > 0) ||
        (lesson.source_references && lesson.source_references.length > 0)) && (
        <div id="section-oer" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-28">
          {lesson.mastery_criteria && lesson.mastery_criteria.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isVi ? 'Tiêu Chí Đạt Chuẩn Thành Thạo (Mastery Criteria)' : 'Mastery Criteria'}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {lesson.mastery_criteria.map((mc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">&bull;</span>
                    <span>{mc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.source_references && lesson.source_references.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>
                  {isVi
                    ? 'Nguồn Học Liệu Mở & Trích Dẫn Học Thuật (Verified OER)'
                    : 'Verified Academic & OER Source Citations'}
                </span>
              </h3>
              <div className="space-y-2">
                {lesson.source_references.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{src.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {src.organization} &bull; {src.license} &bull; {src.resource_type}
                      </div>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                    >
                      <span>{isVi ? 'Nguồn' : 'Source'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
              {lesson.license_provenance && (
                <p className="text-[10px] text-slate-400 pt-1">{lesson.license_provenance}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary & Prev/Next Lesson Navigation */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
            {t('lessonSummary')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            {lesson.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <button
              onClick={() => openLesson(lesson.prerequisites[0])}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isVi ? 'Bài Tiên Quyết' : 'Prerequisite'}</span>
            </button>
          )}
          {lesson.next_lesson_id && (
            <button
              onClick={() => openLesson(lesson.next_lesson_id!)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <span>{t('nextLessonBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
