import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { Track } from '../types';
import {
  Clock, CheckCircle2,
  GraduationCap, AlertCircle, BookOpen, Zap
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const { openLesson, progress, t, language } = useApp();
  const isVi = language === 'vi';

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const data = await api.getTracks();
        setTracks(data);
      } catch (err: any) {
        setError(err.message || (isVi ? 'Không thể tải danh sách lộ trình học' : 'Unable to load syllabus'));
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, [isVi]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">
          {isVi ? 'Đang tải toàn bộ 7 lộ trình đào tạo CHINAI...' : 'Loading 7 CHINAI learning tracks...'}
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Syllabus Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
          <GraduationCap className="w-4 h-4" />
          <span>CHINAI Core Curriculum &bull; {isVi ? '7 Lộ Trình Toàn Diện' : '7 Core Tracks'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          {t('curriculumHeading')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed max-w-3xl">
          {t('curriculumSubheading')}
        </p>
      </div>

      {/* Tracks List */}
      <div className="space-y-8">
        {tracks.map((track) => {
          const trackLessonIds = track.modules.flatMap(m => m.lessons.map(l => l.id));
          const completedInTrack = trackLessonIds.filter(id => progress?.completed_lesson_ids.includes(id)).length;
          const trackPct = trackLessonIds.length > 0 ? Math.round((completedInTrack / trackLessonIds.length) * 100) : 0;

          return (
            <div
              key={track.id}
              className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 p-6 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-750 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                      {track.level}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> ~{track.estimated_hours} {t('hoursLabel')}
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> +{trackLessonIds.length * 50} XP
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                    {track.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {track.tagline}
                  </p>
                </div>

                {/* Track Progress Badge */}
                <div className="sm:text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-500">
                    {isVi ? 'Tiến độ: ' : 'Progress: '}
                    <strong className="text-slate-900 dark:text-slate-100">{completedInTrack}/{trackLessonIds.length}</strong> {isVi ? 'bài' : 'lessons'}
                  </div>
                  <div className="w-28 sm:w-36 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${trackPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Modules & Lessons */}
              <div className="space-y-5">
                {track.modules.map((module) => (
                  <div key={module.id} className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      Module: {module.title}
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      {module.lessons.map((lesson) => {
                        const isCompleted = progress?.completed_lesson_ids.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => openLesson(lesson.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer group ${
                              isCompleted
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
                                : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                                  <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-indigo-600 transition" />
                                </div>
                              )}
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                                  <span>{lesson.estimated_minutes} {t('minuteRead')}</span>
                                  <span>&bull;</span>
                                  <span>{lesson.difficulty}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                                isCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition'
                              }`}>
                                {isCompleted ? (isVi ? 'Ôn tập lại' : 'Review') : (isVi ? 'Bắt đầu học →' : 'Start →')}
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
