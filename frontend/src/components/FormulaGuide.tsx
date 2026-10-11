import React, { useState } from 'react';
import type { FormulaGuide as FormulaGuideType } from '../types';
import { useApp } from '../context/AppContext';
import { Calculator, HelpCircle, Binary, CheckCircle, Info } from 'lucide-react';

interface FormulaGuideProps {
  guide?: FormulaGuideType;
  fallbackFormal?: string;
}

export const FormulaGuide: React.FC<FormulaGuideProps> = ({ guide, fallbackFormal }) => {
  const { language } = useApp();
  const isVi = language === 'vi';
  const [activeSymbolIndex, setActiveSymbolIndex] = useState<number | null>(null);

  if (!guide) {
    if (!fallbackFormal) return null;
    return (
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        {fallbackFormal}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Main Formula Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
              <Calculator className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {guide.title}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100/80 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>{isVi ? 'Công thức Toán học Chuẩn hóa' : 'Standard Mathematical Formulation'}</span>
          </span>
        </div>

        {/* Big Mathematical Equation Box */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 shadow-inner flex flex-col items-center justify-center text-center space-y-3">
          <div className="inline-block px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 font-mono text-base sm:text-xl font-bold text-indigo-900 dark:text-indigo-200 tracking-wider select-all shadow-xs">
            {guide.latex_expression}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl leading-relaxed">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-1.5 inline-flex items-center gap-1">
              <Info className="w-3.5 h-3.5 inline" />
              {isVi ? 'Ý nghĩa trực quan:' : 'Intuitive meaning:'}
            </span>
            {guide.plain_english}
          </div>
        </div>
      </div>

      {/* 2. Detailed Symbol-by-Symbol Breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <span>{isVi ? 'Bảng Giải Nghĩa Chi Tiết Từng Ký Hiệu' : 'Symbol-by-Symbol Breakdown Table'}</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {isVi ? 'Nhấp vào ký hiệu để xem nhanh' : 'Click a symbol to highlight'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guide.symbols.map((sym, idx) => {
            const isSelected = activeSymbolIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveSymbolIndex(isSelected ? null : idx)}
                className={`p-3.5 rounded-xl transition cursor-pointer shadow-xs flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-mono font-black text-sm border border-indigo-200 dark:border-indigo-700 shadow-xs">
                      {sym.symbol}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {sym.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sym.meaning}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {isVi ? 'Giá trị minh họa:' : 'Sample value:'}
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800">
                    {sym.sample_value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Concrete Numerical Walkthrough */}
      <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Binary className="w-4 h-4 text-emerald-500" />
          <span>{isVi ? 'Bài Toán Tính Nhẩm Từng Bước Bằng Số Thật' : 'Step-by-Step Arithmetic Calculation with Real Numbers'}</span>
        </div>

        <div className="space-y-2.5">
          {guide.steps.map((st) => (
            <div
              key={st.step_number}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs border border-emerald-200 dark:border-emerald-800 shadow-xs">
                  {st.step_number}
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {st.title}
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-300 mt-0.5 select-all">
                    {st.calculation}
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200/60 dark:border-emerald-800">
                  {st.result_meaning}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
