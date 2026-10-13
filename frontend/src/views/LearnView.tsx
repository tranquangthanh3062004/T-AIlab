import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { Track, OERResourceSchema } from '../types';
import {
  Clock, CheckCircle2, GraduationCap, AlertCircle, BookOpen,
  Zap, Search, Sprout, Code2, Compass, Database, Calculator,
  Terminal, ChevronDown, ChevronUp, Sparkles, ArrowRight,
  ExternalLink, ShieldCheck
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const { openLesson, progress, refreshProgress, persona, setPersona, t, language } = useApp();
  const isVi = language === 'vi';

  const [tracks, setTracks] = useState<Track[]>([]);
  const [oerResources, setOerResources] = useState<OERResourceSchema[]>([]);
  const [governanceAudit, setGovernanceAudit] = useState<any | null>(null);
  const [oerOpen, setOerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [audienceTab, setAudienceTab] = useState<'beginner' | 'engineer' | 'all'>(persona);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Embedded Diagnostic Assessment State
  const [diagOpen, setDiagOpen] = useState<boolean>(false);
  const [diagQuestions, setDiagQuestions] = useState<any[]>([]);
  const [diagAnswers, setDiagAnswers] = useState<Record<string, string>>({});
  const [diagSubmitting, setDiagSubmitting] = useState<boolean>(false);
  const [diagResult, setDiagResult] = useState<any | null>(null);

  useEffect(() => {
    setAudienceTab(persona);
  }, [persona]);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const [trackData, qData, oerData, govData] = await Promise.all([
          api.getTracks(language),
          api.getDiagnosticQuestions(language).catch(() => []),
          api.getOerResources().catch(() => []),
          api.getGovernanceAudit(language).catch(() => null)
        ]);
        setTracks(trackData);
        setDiagQuestions(qData);
        setOerResources(oerData);
        setGovernanceAudit(govData);
      } catch (err: any) {
        setError(err.message || (isVi ? 'Không thể tải danh sách lộ trình học' : 'Unable to load syllabus'));
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, [language, isVi]);

  const handleDiagnosticSubmit = async () => {
    try {
      setDiagSubmitting(true);
      const res = await api.submitDiagnostic(diagAnswers, language);
      setDiagResult(res);
      if (res.recommended_persona === 'engineer' || res.recommended_persona === 'beginner') {
        setPersona(res.recommended_persona);
        setAudienceTab(res.recommended_persona);
      }
      await refreshProgress();
    } catch (e) {
      console.error(e);
    } finally {
      setDiagSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">
          {isVi ? 'Đang tải lộ trình đào tạo 12 Tracks chuẩn hóa và bộ dữ liệu thực tế...' : 'Loading 12-Track structured curriculum and real datasets...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-rose-800 dark:text-rose-300">
          {isVi ? 'Lỗi Tải Lộ Trình' : 'Failed to Load Tracks'}
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
      </div>
    );
  }

  const isBeginnerTrack = (tr: Track) =>
    tr.target_audience === 'beginner' ||
    ['track-ai-foundations', 'track-python-for-ai', 'track-math-for-ai', 'track-data-science', 'track-classical-ml'].includes(tr.id);

  const filteredTracks = tracks.filter((track) => {
    if (audienceTab === 'beginner' && !isBeginnerTrack(track)) return false;
    if (audienceTab === 'engineer' && isBeginnerTrack(track)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTrack =
        track.title.toLowerCase().includes(q) ||
        track.tagline.toLowerCase().includes(q) ||
        track.description.toLowerCase().includes(q);
      const matchLesson = track.modules.some((m) =>
        m.lessons.some(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            (l.real_dataset?.name || '').toLowerCase().includes(q)
        )
      );
      return matchTrack || matchLesson;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Syllabus Header & Clear 2-Audience Path Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>
                {isVi
                  ? 'Hệ Thống Giáo Trình Phân Tầng • Dữ Liệu Thực Tế & IDE Lồng Ghép'
                  : 'Tiered AI Curriculum • Real Open Datasets & Embedded IDE'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {t('curriculumHeading')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {isVi
                ? 'Chọn đúng đối tượng học tập của bạn. Mỗi bài học tích hợp sẵn: Giải nghĩa ký hiệu Toán học, Bộ dữ liệu mở quốc tế (UCI/StatLib/HuggingFace/MLPerf) và Phòng Lab Code Python.'
                : 'Select your target persona. Every lesson embeds mathematical symbol breakdowns, verified open datasets, and an in-browser Python IDE Lab.'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? 'Tìm bài học, bộ dữ liệu...' : 'Search lessons, datasets...'}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 2-Audience Prominent Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              setPersona('beginner');
              setAudienceTab('beginner');
            }}
            className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
              audienceTab === 'beginner'
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isVi ? '1. Người Mới Bắt Đầu (5 Lộ Trình)' : '1. Complete Beginner (5 Tracks)'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {isVi ? 'AI Foundations, Python, Giải tích, Data Science & ML' : 'Foundations, Python, Calculus, Data Science & ML'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setPersona('engineer');
              setAudienceTab('engineer');
            }}
            className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
              audienceTab === 'engineer'
                ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isVi ? '2. Kỹ Sư AI Thực Chiến (7 Lộ Trình)' : '2. Applied AI Engineer (7 Tracks)'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {isVi ? 'DL, Computer Vision, LLM RAG, Agents, MLOps & Đồ án' : 'DL, Vision, LLM RAG, Agents, MLOps, Research & Capstone'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAudienceTab('all')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
              audienceTab === 'all'
                ? 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-sky-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                {isVi ? 'Tất Cả 12 Lộ Trình Chuẩn Hóa' : 'All 12 Curriculum Tracks'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {isVi ? 'Đồ thị tiên quyết DAG & Học liệu mở OER' : 'Full Prerequisite DAG & Verified OER'}
              </p>
            </div>
          </button>
        </div>

        {/* 2B. Authoritative OER, University & GitHub Source Governance Registry */}
        {oerResources.length > 0 && (
          <div className="rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 overflow-hidden">
            <div
              onClick={() => setOerOpen(!oerOpen)}
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/60 dark:hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                    <span>
                      {isVi
                        ? 'Danh Mục Học Liệu Mở (OER), Đại Học & GitHub Đã Xác Thực Bản Quyền'
                        : 'Verified OER, University & GitHub Source Provenance Registry'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {oerResources.length} {isVi ? 'Nguồn Chuẩn Quốc Tế' : 'Verified Sources'}
                    </span>
                    {governanceAudit?.dag_integrity?.is_valid_dag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                        DAG: {governanceAudit.passed_blocking_gates_count}/{governanceAudit.total_lessons} PASS ({governanceAudit.average_rubric_score}/10)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isVi
                      ? 'MIT 6.036, Stanford CS229/CS231n, UC Berkeley CS188, D2L.ai, MML Book, Karpathy micrograd/nanoGPT — Đầy đủ giấy phép SPDX & trạng thái vòng đời.'
                      : 'MIT 6.036, Stanford CS229/CS231n, UC Berkeley CS188, D2L.ai, MML Book, Karpathy micrograd/nanoGPT — Full SPDX licenses & lifecycle states.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span>{oerOpen ? (isVi ? 'Thu gọn' : 'Hide') : (isVi ? 'Xem Nguồn OER' : 'Inspect Registry')}</span>
                {oerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {oerOpen && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                {oerResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                          {res.source_org}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {res.lifecycle_state}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {res.license_spdx}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {res.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {res.pedagogical_summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                      <span className="font-mono text-slate-400">{res.usage_classification}</span>
                      <a
                        href={res.canonical_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>{isVi ? 'Mở Nguồn Gốc' : 'Canonical Source'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Embedded Diagnostic Placement Assessment Banner (Lồng ghép trực tiếp vào Lộ trình bài học) */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-50/80 via-indigo-50/50 to-sky-50/70 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-indigo-950/40 border border-amber-200/80 dark:border-slate-700 overflow-hidden">
          <div
            onClick={() => setDiagOpen(!diagOpen)}
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>
                    {isVi
                      ? 'Chưa rõ nên bắt đầu từ đâu? Làm Bài Kiểm Tra Định Vị Năng Lực (2 phút)'
                      : 'Not sure where to start? Take the 2-Minute Diagnostic Placement Check'}
                  </span>
                  {progress?.diagnostic_completed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {isVi ? 'Đã hoàn thành' : 'Completed'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isVi
                    ? 'Trả lời 4 câu hỏi nhanh ngay tại đây để hệ thống phân bổ lộ trình Người mới hoặc Kỹ sư AI chính xác nhất.'
                    : 'Answer 4 quick questions right here to automatically configure your Beginner or Engineer track.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
              <span>{diagOpen ? (isVi ? 'Thu gọn' : 'Hide') : (isVi ? 'Mở bài test' : 'Start Test')}</span>
              {diagOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {diagOpen && (
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
              {diagResult ? (
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>
                        {isVi ? 'Kết quả Định vị:' : 'Placement Result:'} {diagResult.overall_level} ({diagResult.score_percentage}%)
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                      {diagResult.recommended_persona === 'engineer'
                        ? (isVi ? 'Đề xuất: Kỹ sư AI Thực chiến (E–G)' : 'Recommended: AI Engineer (E–G)')
                        : (isVi ? 'Đề xuất: Người mới bắt đầu (A–D)' : 'Recommended: Beginner Path (A–D)')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {diagResult.rationale}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => openLesson(diagResult.recommended_lesson_id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                    >
                      <span>{isVi ? 'Học ngay bài được đề xuất' : 'Start Recommended Lesson'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDiagResult(null);
                        setDiagAnswers({});
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      {isVi ? 'Làm lại bài test' : 'Retake test'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {diagQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                      >
                        <div className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                          {isVi ? `Câu ${idx + 1}` : `Q${idx + 1}`} &bull; {q.category}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {q.question}
                        </div>
                        <div className="space-y-1.5">
                          {q.options.map((opt: any) => {
                            const selected = diagAnswers[q.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setDiagAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                                  selected
                                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                }`}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={diagSubmitting || Object.keys(diagAnswers).length < diagQuestions.length}
                      onClick={handleDiagnosticSubmit}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition"
                    >
                      {diagSubmitting
                        ? (isVi ? 'Đang phân tích năng lực...' : 'Evaluating...')
                        : (isVi ? 'Xem Kết Quả & Phân Bổ Lộ Trình' : 'Get My Personalized Path')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Tracks & Lessons List */}
      <div className="space-y-6">
        {filteredTracks.map((track) => {
          const trackLessonIds = track.modules.flatMap((m) => m.lessons.map((l) => l.id));
          const completedInTrack = trackLessonIds.filter((id) => progress?.completed_lesson_ids.includes(id)).length;
          const trackPct = trackLessonIds.length > 0 ? Math.round((completedInTrack / trackLessonIds.length) * 100) : 0;
          const isBeginner = isBeginnerTrack(track);

          return (
            <div
              key={track.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isBeginner
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      {isBeginner
                        ? (isVi ? '🌱 Dành cho Người mới' : '🌱 Beginner Track')
                        : (isVi ? '💻 Dành cho Kỹ sư AI' : '💻 Engineer Track')}{' '}
                      &bull; {track.level}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> ~{track.estimated_hours} {t('hoursLabel')}
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> +{trackLessonIds.length * 50} XP
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1.5">
                    {track.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {track.description}
                  </p>
                </div>

                {/* Track Progress Badge */}
                <div className="sm:text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-500">
                    {isVi ? 'Hoàn thành: ' : 'Completed: '}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {completedInTrack}/{trackLessonIds.length}
                    </strong>{' '}
                    {isVi ? 'bài' : 'lessons'}
                  </div>
                  <div className="w-28 sm:w-36 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${trackPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Modules & Lessons */}
              <div className="space-y-5">
                {track.modules.map((module) => (
                  <div key={module.id} className="space-y-2.5">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{module.title}</span>
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {module.lessons.map((lesson) => {
                        const isCompleted = progress?.completed_lesson_ids.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => openLesson(lesson.id)}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition cursor-pointer group gap-3 ${
                              isCompleted
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
                                : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                                  <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-indigo-600 transition" />
                                </div>
                              )}
                              <div className="space-y-1.5">
                                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                  {lesson.title}
                                </h4>

                                {/* Embedded Capabilities Pills (Dataset, Math Formula, Python IDE) */}
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                  <span className="font-mono text-slate-500 dark:text-slate-400">
                                    {lesson.estimated_minutes} {t('minuteRead')}
                                  </span>

                                  {lesson.real_dataset && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                                      <Database className="w-3 h-3" />
                                      <span>{lesson.real_dataset.name}</span>
                                    </span>
                                  )}

                                  {lesson.formula_guide && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                                      <Calculator className="w-3 h-3" />
                                      <span>{isVi ? 'Giải nghĩa Công thức' : 'Math Guide'}</span>
                                    </span>
                                  )}

                                  {lesson.code_exercise && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200/60 dark:border-sky-800/60">
                                      <Terminal className="w-3 h-3" />
                                      <span>{isVi ? 'Phòng Lab IDE' : 'Python IDE Lab'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 shrink-0">
                              <span
                                className={`text-xs font-bold px-3.5 py-2 rounded-xl ${
                                  isCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-indigo-600 text-white shadow-2xs group-hover:bg-indigo-700 transition'
                                }`}
                              >
                                {isCompleted
                                  ? (isVi ? 'Ôn tập bài học' : 'Review Lesson')
                                  : (isVi ? 'Vào bài học →' : 'Start Lesson →')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
