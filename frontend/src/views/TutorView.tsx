import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { TutorResponse } from '../types';
import { Sparkles, Send, BookOpen, RefreshCw, CheckCircle2 } from 'lucide-react';

export const TutorView: React.FC = () => {
  const { mode, openLesson, language } = useApp();
  const isVi = language === 'vi';

  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const initialGreetingVi = "Xin chào bạn! Tôi là Trợ lý AI Gia Sư của CHINAI. Mọi câu trả lời của tôi đều được trích xuất và kiểm chứng dựa trên 7 Lộ trình học và các bài báo khoa học chính thức (arXiv, DeepMind, OpenAI).\n\nBạn có thể hỏi bất kỳ chủ đề nào: Thuật toán Tối ưu Gradient Descent, Overfitting, Vector Embeddings, Activation Functions, RAG Pipelines hoặc Triển khai MLOps!";
  const initialActionsVi = [
    "Giải thích thuật toán Gradient Descent bằng ví dụ trực quan",
    "Sự khác biệt giữa Supervised và Unsupervised Learning là gì?",
    "Tại sao xảy ra Overfitting và cách phát hiện trên tập Validation?",
    "Vector Embeddings và Cosine Similarity hoạt động ra sao trong RAG?"
  ];

  const initialGreetingEn = "Hello! I am your CHINAI AI Knowledge Tutor. All my explanations are strictly grounded in our 7 Core Curriculum tracks and verified scientific literature (arXiv, DeepMind, OpenAI).\n\nAsk me anything about: Gradient Descent Optimization, Overfitting, Vector Embeddings, Activation Functions, RAG Pipelines, or MLOps Deployment!";
  const initialActionsEn = [
    "Explain Gradient Descent with a clear step-by-step intuition",
    "What is the key difference between Supervised and Unsupervised Learning?",
    "Why does Overfitting occur and how do we detect it on Validation loss?",
    "How do Vector Embeddings and Cosine Similarity power RAG systems?"
  ];

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; citations?: any[]; actions?: string[] }>>([
    {
      role: 'assistant',
      text: isVi ? initialGreetingVi : initialGreetingEn,
      citations: [],
      actions: isVi ? initialActionsVi : initialActionsEn
    }
  ]);

  // Update initial message when language toggles if user hasn't started a deep conversation
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          role: 'assistant',
          text: isVi ? initialGreetingVi : initialGreetingEn,
          citations: [],
          actions: isVi ? initialActionsVi : initialActionsEn
        }
      ]);
    }
  }, [isVi]);

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    const text = userPrompt.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text }]);

    try {
      setLoading(true);
      const res: TutorResponse = await api.queryTutor(text, mode);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.answer,
          citations: res.citations,
          actions: res.suggested_actions
        }
      ]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: isVi ? `Lỗi truy xuất kiến thức nền tảng: ${e.message}` : `Error retrieving grounded knowledge: ${e.message}`,
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{isVi ? 'Trợ Lý AI Gia Sư CHINAI' : 'AI Tutor & Knowledge Retrieval'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isVi
              ? 'Mọi phản hồi được neo chắc chắn vào bài học nền tảng và nghiên cứu khoa học với trích dẫn minh bạch.'
              : 'Strictly grounded in platform lessons and verified research records with verifiable citations.'}
          </p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/60 dark:border-indigo-800 uppercase">
          {mode.toUpperCase()} MODE
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-5 shadow-xs space-y-3 ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-750'
              }`}
            >
              <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                {m.text}
              </div>

              {/* Grounded Citations List */}
              {m.citations && m.citations.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-750 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isVi ? 'Trích Dẫn Căn Cứ Khoa Học:' : 'Grounded In Verified Citations:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.citations.map((cite, cIdx) => (
                      <div
                        key={cIdx}
                        onClick={() => {
                          if (cite.type === 'lesson') openLesson(cite.id);
                          else if (cite.url_or_ref && cite.url_or_ref.startsWith('http')) window.open(cite.url_or_ref, '_blank');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 text-[11px] font-medium cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                      >
                        <BookOpen className="w-3 h-3 text-indigo-500" />
                        <span>[{cite.type.toUpperCase()}] {cite.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Questions / Next Actions */}
              {m.actions && m.actions.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-750 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {isVi ? 'Gợi Ý Câu Hỏi Tiếp Theo:' : 'Suggested Explorations:'}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(act)}
                        className="text-left text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline py-0.5 transition"
                      >
                        &bull; {act}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 flex items-center gap-3 text-xs text-slate-500 shadow-xs">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>{isVi ? 'Đang tra cứu cơ sở kiến thức 7 lộ trình và tin tức khoa học...' : 'Retrieving grounded knowledge from syllabus and research records...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(query);
        }}
        className="flex gap-2 pt-4 border-t border-slate-200/80 dark:border-slate-800"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isVi ? 'Đặt câu hỏi về Gradient Descent, Overfitting, Vector Embeddings...' : 'Ask about Gradient Descent, Overfitting, Vector Embeddings...'}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isVi ? 'Gửi' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
