import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { NewsArticle } from '../types';
import {
  Newspaper, ExternalLink, Bookmark, Search,
  RefreshCw, CheckCircle2, ShieldAlert, BookOpen, AlertCircle
} from 'lucide-react';

const CATEGORIES_VI = [
  { id: 'All', label: 'Tất cả chủ đề' },
  { id: 'Research Breakthroughs', label: 'Đột phá Nghiên cứu' },
  { id: 'Model Releases', label: 'Phát hành Mô hình' },
  { id: 'Open Source', label: 'Mã nguồn mở' },
  { id: 'LLMs', label: 'Mô hình Ngôn ngữ Lớn' },
  { id: 'AI Safety & Alignment', label: 'An toàn & Căn chỉnh AI' },
  { id: 'AI Systems & MLOps', label: 'Hệ thống AI & MLOps' }
];

const CATEGORIES_EN = [
  { id: 'All', label: 'All Categories' },
  { id: 'Research Breakthroughs', label: 'Research Breakthroughs' },
  { id: 'Model Releases', label: 'Model Releases' },
  { id: 'Open Source', label: 'Open Source' },
  { id: 'LLMs', label: 'LLMs' },
  { id: 'AI Safety & Alignment', label: 'AI Safety & Alignment' },
  { id: 'AI Systems & MLOps', label: 'AI Systems & MLOps' }
];

export const NewsRadarView: React.FC = () => {
  const { language } = useApp();
  const isVi = language === 'vi';
  const categories = isVi ? CATEGORIES_VI : CATEGORIES_EN;

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ingesting, setIngesting] = useState<boolean>(false);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarksOnly, setBookmarksOnly] = useState<boolean>(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getNews({
        category: selectedCategory,
        search: searchQuery.trim() || undefined,
        bookmarked_only: bookmarksOnly
      });
      setArticles(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || (isVi ? 'Không thể kết nối đến máy chủ Radar Tin tức AI' : 'Could not connect to AI News Radar server'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, bookmarksOnly, isVi]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      const res = await api.toggleBookmark(id);
      setArticles(prev => prev.map(a => a.id === id ? { ...a, bookmarked: res.bookmarked } : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerIngest = async () => {
    try {
      setIngesting(true);
      setIngestStatus(isVi 
        ? 'Đang kết nối tới RSS feeds chính thức (arXiv, OpenAI, DeepMind, Hugging Face)...' 
        : 'Connecting to official RSS feeds (arXiv, OpenAI, DeepMind, Hugging Face)...');
      const res = await api.triggerNewsIngestion();
      setIngestStatus(isVi 
        ? `Quét hoàn tất! Đã tìm thấy: ${res.articles_fetched}, Mới: ${res.new_articles_persisted}, Đã lọc trùng: ${res.duplicates_skipped}` 
        : `Ingestion complete! Fetched: ${res.articles_fetched}, New: ${res.new_articles_persisted}, Skipped: ${res.duplicates_skipped}`);
      await fetchNews();
    } catch (e: any) {
      setIngestStatus(isVi ? `Quét thất bại: ${e.message}` : `Ingestion failed: ${e.message}`);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4 text-amber-500" />
            <span>{isVi ? 'Radar Tin Tức AI & Nghiên Cứu Xác Thực' : 'AI News Radar & Research Intelligence'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {isVi ? 'Tín Hiệu Nghiên Cứu Bám Sát Nguồn Gốc' : 'Source-Grounded AI Ecosystem Signals'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isVi 
              ? 'Thu thập liên tục từ các bài báo khoa học bình duyệt (arXiv), phòng thí nghiệm OpenAI, DeepMind và mô hình mã nguồn mở Hugging Face. Lọc bỏ tin đồn và quảng cáo, chỉ giữ lại giá trị kỹ thuật thực chất.'
              : 'Continuously ingested from peer preprints, official lab publications, and open-source models. Filtered for technical substance with verifiable original citations.'}
          </p>
        </div>

        <button
          onClick={handleTriggerIngest}
          disabled={ingesting}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${ingesting ? 'animate-spin' : ''}`} />
          <span>{ingesting ? (isVi ? 'Đang cập nhật nguồn...' : 'Polling Upstream...') : (isVi ? 'Quét Nguồn Cập Nhật' : 'Poll Live Feeds')}</span>
        </button>
      </div>

      {ingestStatus && (
        <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-800 rounded-xl text-xs font-medium flex items-center justify-between">
          <span>{ingestStatus}</span>
          <button onClick={() => setIngestStatus(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-2">×</button>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold ml-2">×</button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isVi ? 'Tìm kiếm đột phá nghiên cứu, kiến trúc mô hình, tác giả...' : 'Search research breakthroughs, model architectures, authors...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-750 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-slate-800 transition"
          >
            {isVi ? 'Tìm kiếm' : 'Search'}
          </button>
        </form>

        {/* Categories pill strip */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">
            {isVi ? 'Chủ đề:' : 'Category:'}
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={() => setBookmarksOnly(!bookmarksOnly)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
              bookmarksOnly
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{isVi ? 'Đã lưu' : 'Bookmarked'}</span>
          </button>
        </div>
      </div>

      {/* Articles Feed */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">
            {isVi ? 'Đang truy xuất hồ sơ nghiên cứu xác thực...' : 'Retrieving verified intelligence records...'}
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 space-y-2 shadow-xs">
          <Newspaper className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            {isVi ? 'Không tìm thấy bài viết phù hợp bộ lọc' : 'No articles matched your filter criteria'}
          </h3>
          <p className="text-xs text-slate-500">
            {isVi ? 'Hãy thử đặt lại bộ lọc hoặc bấm "Quét Nguồn Cập Nhật" để tải bài mới.' : 'Try resetting filters or poll live RSS feeds to fetch fresh papers.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map(art => (
            <div
              key={art.id}
              className="p-6 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-750 shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {art.source}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500">{art.published_at}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                      {art.category}
                    </span>

                    {/* Claim Verification Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      art.claim_status === 'VERIFIED'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800'
                        : art.claim_status === 'VENDOR_CLAIM'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {art.claim_status === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <ShieldAlert className="w-3 h-3 text-amber-600" />}
                      <span>{art.claim_status === 'VERIFIED' ? (isVi ? 'Đã bình duyệt / Xác thực' : 'Peer/Paper Verified') : (isVi ? 'Công bố từ phòng thí nghiệm' : 'Vendor Benchmark Claim')}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-1 leading-snug">
                    <a
                      href={art.canonical_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1.5 transition"
                    >
                      {art.title}
                      <ExternalLink className="w-4 h-4 text-slate-400 inline shrink-0" />
                    </a>
                  </h2>

                  {art.author && (
                    <div className="text-xs text-slate-400 italic">
                      {isVi ? 'Tác giả:' : 'By'} {art.author}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleToggleBookmark(art.id)}
                  aria-label="Bookmark article"
                  className={`p-2 rounded-xl border transition shrink-0 ${
                    art.bookmarked
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Structured Summary Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isVi ? 'Nội dung cốt lõi:' : 'What Happened:'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{art.summary_what}</p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isVi ? 'Điểm mới & Ý nghĩa khoa học:' : 'What is New & Significant:'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{art.summary_new}</p>
                </div>
              </div>

              {/* Actionable Learning Next Step */}
              <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
                  <BookOpen className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span><strong>{isVi ? 'Đề xuất thực hành:' : 'Next Learning Step:'}</strong> {art.summary_action}</span>
                </div>
                <a
                  href={art.canonical_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-lg font-bold shrink-0 hover:bg-indigo-50 transition shadow-xs text-center"
                >
                  {isVi ? 'Đọc Nguồn Gốc' : 'Open Source'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
