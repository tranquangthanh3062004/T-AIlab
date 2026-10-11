import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Compass, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const DiagnosticView: React.FC = () => {
  const { openLesson, setActiveView, refreshProgress, language } = useApp();
  const isVi = language === 'vi';

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchDiag = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getDiagnosticQuestions();
        setQuestions(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || (isVi ? 'Không thể tải bộ câu hỏi đánh giá năng lực.' : 'Failed to load diagnostic questions.'));
      } finally {
        setLoading(false);
      }
    };
    fetchDiag();
  }, [isVi]);

  const handleSelect = (qid: string, optId: string) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [qid]: optId }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await api.submitDiagnostic(answers);
      setResult(res);
      await refreshProgress();
    } catch (e: any) {
      console.error(e);
      alert((isVi ? 'Lỗi nộp bài đánh giá: ' : 'Failed to submit diagnostic: ') + (e.message || 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">
          {isVi ? 'Đang chuẩn bị bộ câu hỏi đánh giá năng lực...' : 'Preparing diagnostic placement assessment...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-rose-800 dark:text-rose-300">
          {isVi ? 'Không Thể Tải Bài Đánh Giá' : 'Unable to Load Assessment'}
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
        >
          {isVi ? 'Quay lại Trang Chủ' : 'Back to Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-amber-500" />
          <span>{isVi ? 'Đánh Giá Năng Lực & Phân Lớp Học Viên' : 'Adaptive Learner Placement'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          {isVi ? 'Xác Định Điểm Khởi Đầu Phù Hợp Nhất' : 'Find Your Ideal Starting Point'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          {isVi 
            ? 'Trả lời nhanh 4 câu hỏi trắc nghiệm về học máy, không gian vector và tối ưu hóa để hệ thống gợi ý lộ trình chính xác, tránh mất thời gian học lại kiến thức bạn đã nắm vững.'
            : 'Answer 4 quick conceptual questions across ML fundamentals, vector spaces, and optimization. We will calibrate your syllabus so you skip what you already know.'}
        </p>
      </div>

      {/* Result Card if submitted */}
      {result && (
        <div className="p-6 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/60 dark:from-slate-850 dark:to-slate-800 border border-indigo-200/80 dark:border-slate-700 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {isVi ? 'Hoàn Thành Đánh Giá Năng Lực' : 'Diagnostic Evaluation Complete'}
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-indigo-600 text-white">
              {isVi ? 'Điểm: ' : 'Score: '}{result.score_percentage}%
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isVi ? 'Lộ trình được đề xuất:' : 'Recommended Syllabus Track:'}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {result.track_title}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {result.analysis}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => openLesson(result.suggested_starting_lesson_id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <span>{isVi ? 'Bắt Đầu Bài Học Đề Xuất' : 'Start Recommended Lesson'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('learn')}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              {isVi ? 'Xem Toàn Bộ 7 Lộ Trình' : 'Browse Full Syllabus'}
            </button>
          </div>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-5 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs space-y-3"
          >
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isVi ? `Câu hỏi #${idx + 1}` : `Diagnostic #${idx + 1}`}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {q.question}
            </h3>

            <div className="space-y-2">
              {q.options.map((opt: any) => {
                const isSelected = answers[q.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-slate-200/80 dark:border-slate-750 hover:border-indigo-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {opt.text}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length || submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            {submitting 
              ? (isVi ? 'Đang phân tích...' : 'Evaluating...') 
              : (isVi ? 'Nộp Bài & Nhận Lộ Trình Phù Hợp (+30 XP)' : 'Submit Diagnostic Placement (+30 XP)')}
          </button>
        </div>
      )}
    </div>
  );
};
