import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { TutorResponse } from '../types';
import {
  Bot, X, Send, Sparkles, BookOpen, ExternalLink,
  Maximize2, Minimize2, Code2, Calculator, Compass, CheckCircle2
} from 'lucide-react';

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  responseMeta?: TutorResponse;
  timestamp: string;
}

export const FloatingAgentWidget: React.FC = () => {
  const {
    agentOpen,
    setAgentOpen,
    agentInitialPrompt,
    persona,
    activeLessonId,
    openLesson,
    language
  } = useApp();

  const isVi = language === 'vi';
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AgentMessage[]>(() => [
    {
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: isVi
        ? 'Xin chào! Tôi là **T-AIlab Agent** — Trợ lý Học tập & Kỹ thuật AI cá nhân của bạn.\n\nTôi luôn theo dõi bài học hiện tại của bạn để hỗ trợ:\n- Giải thích trực quan các khái niệm & ký hiệu công thức Toán học.\n- Phân tích bộ dữ liệu thực tế (UCI, StatLib, Hugging Face, MLPerf).\n- Gợi ý & gỡ lỗi (Debug) trực tiếp bài tập lập trình Python.'
        : 'Hello! I am **T-AIlab Agent** — your personal AI Learning & Engineering Assistant.\n\nI stay synced with your active lesson to help you:\n- Break down mathematical formulas and symbols step by step.\n- Analyze real-world open datasets (UCI, StatLib, Hugging Face, MLPerf).\n- Guide and debug your Python code exercises.'
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentOpen]);

  useEffect(() => {
    if (agentInitialPrompt && agentOpen) {
      handleSendPrompt(agentInitialPrompt);
    }
  }, [agentInitialPrompt]);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', content: promptText, timestamp: now }]);
    setQuery('');
    setLoading(true);

    try {
      const modeForApi = persona === 'engineer' ? 'engineer' : 'learn';
      const res = await api.queryTutor(promptText, modeForApi, activeLessonId || undefined);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          responseMeta: res,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isVi
            ? 'Hệ thống Agent đang bận xử lý. Vui lòng thử gửi lại câu hỏi sau giây lát.'
            : 'The AI Agent is temporarily busy. Please try sending your question again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(query);
  };

  const quickAgentActions = isVi
    ? [
        {
          icon: BookOpen,
          label: 'Tóm tắt bài học này',
          prompt: `Hãy tóm tắt ngắn gọn và dễ hiểu nhất các ý chính của bài học ${activeLessonId || 'hiện tại'} cho cấp độ ${persona === 'engineer' ? 'Kỹ sư AI' : 'Người mới bắt đầu'}.`
        },
        {
          icon: Calculator,
          label: 'Giải thích ký hiệu công thức',
          prompt: 'Hãy giải thích chi tiết từng ký hiệu trong công thức Toán học của bài học này kèm ví dụ tính nhẩm bằng số.'
        },
        {
          icon: Code2,
          label: 'Gợi ý giải bài tập Code',
          prompt: 'Hãy hướng dẫn từng bước cách viết hàm Python vượt qua bài kiểm thử (Unit Test) của bài học này.'
        },
        {
          icon: Compass,
          label: 'Lộ trình học tiếp theo',
          prompt: 'Dựa trên mục tiêu học tập của tôi, tôi nên tập trung vào kỹ năng và bài học nào tiếp theo?'
        }
      ]
    : [
        {
          icon: BookOpen,
          label: 'Summarize this lesson',
          prompt: `Summarize the core takeaways of lesson ${activeLessonId || 'current'} for a ${persona} learner.`
        },
        {
          icon: Calculator,
          label: 'Explain formula symbols',
          prompt: 'Explain every mathematical symbol in this lesson formula with a concrete numerical walkthrough.'
        },
        {
          icon: Code2,
          label: 'Hint for code exercise',
          prompt: 'Provide a step-by-step hint to pass the Python unit tests for this lesson.'
        },
        {
          icon: Compass,
          label: 'Next learning step',
          prompt: 'What concept and lesson should I focus on next in my AI curriculum?'
        }
      ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Window */}
      {agentOpen && (
        <div
          className={`mb-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            expanded
              ? 'w-[92vw] sm:w-[560px] h-[78vh] max-h-[720px]'
              : 'w-[90vw] sm:w-[410px] h-[540px] max-h-[78vh]'
          }`}
        >
          {/* Agent Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 flex items-center justify-center shadow-md shrink-0">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight truncate">
                    T-AIlab Agent
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    RAG Verified
                  </span>
                </div>
                <p className="text-[10px] text-indigo-200/80 truncate">
                  {persona === 'engineer'
                    ? (isVi ? 'Chế độ: Trợ lý Kỹ sư AI Thực chiến' : 'Mode: Applied AI Engineer Agent')
                    : (isVi ? 'Chế độ: Trợ lý Hướng dẫn Người mới' : 'Mode: Beginner Mentor Agent')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? 'Thu nhỏ' : 'Mở rộng'}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setAgentOpen(false)}
                title={isVi ? 'Đóng trợ lý' : 'Close assistant'}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Actions Bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickAgentActions.map((act, idx) => {
              const Icon = act.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendPrompt(act.prompt)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold whitespace-nowrap transition shrink-0"
                >
                  <Icon className="w-3 h-3 text-indigo-500" />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 dark:bg-slate-950/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm space-y-2.5 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                  {/* Verified Citations */}
                  {msg.responseMeta && msg.responseMeta.citations.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          {isVi ? 'Nguồn giáo trình đối chiếu' : 'Verified Curriculum Sources'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {msg.responseMeta.citations.slice(0, 2).map((cit) => (
                          <div
                            key={cit.id}
                            onClick={() => {
                              if (cit.type === 'lesson') {
                                openLesson(cit.url_or_ref);
                              } else if (cit.url_or_ref.startsWith('http')) {
                                window.open(cit.url_or_ref, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer flex items-center justify-between gap-2 text-[11px] transition"
                          >
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate">
                              {cit.title}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.responseMeta && msg.responseMeta.suggested_actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.responseMeta.suggested_actions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendPrompt(act)}
                          className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition"
                        >
                          + {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span>{isVi ? 'Agent đang đối chiếu giáo trình & dữ liệu...' : 'Agent is analyzing lesson & datasets...'}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isVi
                  ? 'Hỏi Agent về bài học, công thức Toán hoặc code...'
                  : 'Ask Agent about this lesson, math formula, or code...'
              }
              className="flex-1 bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs transition shrink-0"
              aria-label="Send message to AI Agent"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Bottom-Right Trigger Pill */}
      <button
        type="button"
        onClick={() => setAgentOpen(!agentOpen)}
        aria-label="Toggle T-AIlab Assistant Agent"
        className="group relative flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-xl hover:shadow-indigo-500/30 border border-white/20 transition-all duration-300 hover:scale-105"
      >
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 opacity-35 blur-md group-hover:opacity-60 transition" />
        <div className="relative w-8 h-8 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center">
          {agentOpen ? <X className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600" />
        </div>
        <div className="relative text-left">
          <div className="text-xs font-extrabold leading-none flex items-center gap-1">
            <span>{isVi ? 'Trợ lý AI Agent' : 'AI Agent'}</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <div className="text-[10px] text-indigo-100 font-medium mt-0.5 hidden sm:block">
            {isVi ? 'Hỗ trợ bài học 24/7' : 'Live Lesson Support'}
          </div>
        </div>
      </button>
    </div>
  );
};
