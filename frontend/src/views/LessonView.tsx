import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { Lesson, CodeExecutionResponse } from '../types';
import { PerceptronWidget } from '../components/widgets/PerceptronWidget';
import { GradientDescentWidget } from '../components/widgets/GradientDescentWidget';
import { FormulaGuide } from '../components/FormulaGuide';
import {
  BookOpen, Clock, Target, Lightbulb, Play, CheckCircle2,
  AlertTriangle, ArrowRight, ArrowLeft, Check, X, Zap
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const { activeLessonId, openLesson, setActiveView, refreshProgress, t, language } = useApp();
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

        const data = await api.getLesson(activeLessonId);
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
  }, [activeLessonId, isVi]);

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
          setEarnedXpToast(isVi 
            ? '+30 XP: Chúc mừng bạn đã hoàn thành bài tập code!' 
            : '+30 XP: Code exercise tests passed successfully!');
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err: any) {
      console.error(err);
      setCodeResult({
        success: false,
        stdout: '',
        stderr: err.message || (isVi ? 'Lỗi thực thi trong sandbox hoặc mất kết nối mạng.' : 'Execution failed in sandbox or network timeout.'),
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
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleQuizSubmit = async () => {
    if (!lesson) return;
    try {
      const res = await api.submitQuiz(lesson.id, selectedAnswers);
      setQuizSubmitted(true);
      setQuizFeedback(res.feedback);
      setQuizScore(res.score_percentage);
      await refreshProgress();

      if (res.passed) {
        setEarnedXpToast(res.score_percentage >= 100 
          ? (isVi ? '+40 XP: Đạt 100% điểm Quiz! Mở khóa huy hiệu Bậc Thầy Trắc Nghiệm!' : '+40 XP: Perfect 100% Quiz score! Quiz Master badge unlocked!') 
          : (isVi ? '+30 XP: Bạn đã vượt qua bài kiểm tra trắc nghiệm!' : '+30 XP: Assessment passed successfully!'));
      }
    } catch (err: any) {
      console.error(err);
      alert((isVi ? 'Không thể nộp bài trắc nghiệm: ' : 'Unable to submit quiz: ') + (err.message || 'Error'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">{isVi ? 'Đang tải bài học...' : 'Loading lesson...'}</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
        <h3 className="font-bold text-rose-800 dark:text-rose-300">{isVi ? 'Không Thể Tải Bài Học' : 'Failed to Load Lesson'}</h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error || (isVi ? 'Không tìm thấy bài học' : 'Lesson not found')}</p>
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

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveView('learn')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t('backToCurriculum')}
        </button>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.estimated_minutes} {t('minuteRead')}</span>
          <span>&bull;</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/60 dark:border-indigo-800">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {lesson.title}
        </h1>

        {/* Learning Objectives */}
        <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 rounded-2xl p-5 space-y-2.5">
          <h3 className="text-xs font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{t('lessonObjectives')}</span>
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-sky-600 dark:text-sky-400 font-bold">&bull;</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 1: Intuitive Explanation */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>{t('section1Intuition')}</span>
        </h2>
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          {lesson.intuitive_explanation}
        </div>
      </div>

      {/* Interactive Simulation Widget */}
      {lesson.interactive_widget && (
        <div className="space-y-2">
          {lesson.interactive_widget.type === 'perceptron' && <PerceptronWidget />}
          {lesson.interactive_widget.type === 'gradient_descent' && <GradientDescentWidget />}
        </div>
      )}

      {/* Section 2: Formal Formula Guide & Symbol Breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span>{t('section2Formal')}</span>
        </h2>
        <FormulaGuide
          guide={lesson.formula_guide}
          fallbackFormal={lesson.formal_explanation}
        />
      </div>

      {/* Section 3: Worked Example Code */}
      {lesson.worked_example_code && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('section3Code')}
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Python 3.13 Contiguous</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs p-4 overflow-x-auto shadow-inner">
            <pre><code>{lesson.worked_example_code}</code></pre>
          </div>
        </div>
      )}

      {/* Section 4: Common Misconceptions */}
      {lesson.common_misconceptions.length > 0 && (
        <div className="p-5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl space-y-2.5">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t('section4Misconceptions')}</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
            {lesson.common_misconceptions.map((misc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span>&bull;</span>
                <span>{misc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 5: Practical In-Browser Exercise */}
      {lesson.code_exercise && (
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-500" />
                <span>{t('section5Exercise')}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lesson.code_exercise.instructions}
              </p>
            </div>
            <button
              onClick={handleRunCode}
              disabled={executingCode}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              {executingCode ? t('verifyingCode') : t('runAndVerify')}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950 shadow-inner">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>exercise_solution.py</span>
              <button
                onClick={() => setLearnerCode(lesson.code_exercise!.solution_code)}
                className="hover:text-indigo-400 text-indigo-400 font-semibold transition"
              >
                {t('loadSolution')}
              </button>
            </div>
            <textarea
              value={learnerCode}
              onChange={(e) => setLearnerCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 focus:outline-hidden resize-y"
            />
          </div>

          {/* Test Execution Output */}
          {codeResult && (
            <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
              codeResult.passed_tests
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {codeResult.passed_tests ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                  {codeResult.passed_tests 
                    ? (isVi ? 'Toàn bộ Kiểm thử đã Vượt qua!' : 'All test assertions passed successfully!') 
                    : (isVi ? 'Kiểm thử Thất bại hoặc Lỗi Cú pháp' : 'Test assertions failed or syntax error')}
                </span>
                <span className="text-[10px] text-slate-500">{codeResult.execution_time_ms} ms</span>
              </div>
              {codeResult.stdout && <div>stdout: {codeResult.stdout}</div>}
              {codeResult.test_feedback && <div>feedback: {codeResult.test_feedback}</div>}
              {codeResult.stderr && <div className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap">{codeResult.stderr}</div>}
            </div>
          )}
        </div>
      )}

      {/* Section 6: Deterministic Knowledge Check Quiz */}
      {lesson.quiz.length > 0 && (
        <div className="space-y-5 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>{t('section6Quiz')}</span>
            </h2>
            {quizScore !== null && (
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                quizScore >= 70 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {isVi ? 'Điểm số: ' : 'Score: '} {quizScore}% {quizScore >= 70 ? (isVi ? '(Đạt)' : '(Passed)') : (isVi ? '(Chưa đạt)' : '(Retry)')}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {lesson.quiz.map((q, qIdx) => {
              const fb = quizFeedback.find(f => f.question_id === q.id);

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 space-y-3 shadow-xs"
                >
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {isVi ? `Câu hỏi ${qIdx + 1} / ${lesson.quiz.length}` : `Question ${qIdx + 1} / ${lesson.quiz.length}`}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt.id;

                      let optStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-800';
                      if (isSelected) optStyle = 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-semibold';
                      if (quizSubmitted) {
                        if (opt.is_correct) optStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                        else if (isSelected && !opt.is_correct) optStyle = 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                      }

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleQuizOptionSelect(q.id, opt.id)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt.text}</span>
                          {quizSubmitted && opt.is_correct && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                          {quizSubmitted && isSelected && !opt.is_correct && <X className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                        </div>
                      );
                    })}
                  </div>

                  {fb && (
                    <div className="text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
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

          <div className="flex justify-end">
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

      {/* Summary & Next Lesson Navigation */}
      <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {t('lessonSummary')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            {lesson.summary}
          </p>
        </div>

        {lesson.next_lesson_id && (
          <button
            onClick={() => openLesson(lesson.next_lesson_id!)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            {t('nextLessonBtn')} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
