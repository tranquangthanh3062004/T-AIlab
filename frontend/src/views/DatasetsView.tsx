import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { DatasetSummary, ExperimentRun } from '../types';
import { Database, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';

export const DatasetsView: React.FC = () => {
  const { language } = useApp();
  const isVi = language === 'vi';

  const [activeTab, setActiveTab] = useState<'dataset' | 'experiments'>('dataset');
  const [dataset, setDataset] = useState<DatasetSummary | null>(null);
  const [experiments, setExperiments] = useState<ExperimentRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ds, exps] = await Promise.all([
          api.getDatasetSummary(),
          api.getExperiments()
        ]);
        setDataset(ds);
        setExperiments(exps);
      } catch (e: any) {
        console.error(e);
        setError(e.message || (isVi ? 'Không thể tải dữ liệu tập huấn luyện và thí nghiệm.' : 'Unable to load dataset and experiment records.'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isVi]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">
          {isVi ? 'Đang tải tập dữ liệu và chỉ số mô hình...' : 'Loading dataset distributions and run telemetry...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="font-bold text-rose-800 dark:text-rose-300">
          {isVi ? 'Lỗi Tải Dữ Liệu' : 'Data Loading Error'}
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
        >
          {isVi ? 'Thử Lại' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{isVi ? 'Tập Dữ Liệu & Đo Lường Thí Nghiệm' : 'Datasets & Experiment Tracking'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isVi 
              ? 'Kiểm tra phân phối đặc trưng huấn luyện, xử lý giá trị khuyết và đối chiếu chỉ số siêu tham số mô hình.' 
              : 'Inspect training feature distributions, analyze missingness, and compare model hyperparameter performance.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dataset'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isVi ? 'Kiểm Tra Dữ Liệu CSV' : 'Dataset Inspector'}</span>
          </button>
          <button
            onClick={() => setActiveTab('experiments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'experiments'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isVi ? `Thử Nghiệm Huấn Luyện (${experiments.length})` : `Model Runs (${experiments.length})`}</span>
          </button>
        </div>
      </div>

      {activeTab === 'dataset' && dataset && (
        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {isVi ? 'Tên Tập Dữ Liệu' : 'Dataset Name'}
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono truncate">
                {dataset.name}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {isVi ? 'Tổng Số Mẫu (Hàng)' : 'Total Rows'}
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {dataset.rows} {isVi ? 'dòng' : 'Rows'}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {isVi ? 'Số Lượng Đặc Trưng (Cột)' : 'Feature Columns'}
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {dataset.columns.length} {isVi ? 'đặc trưng' : 'Features'}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {isVi ? 'Giá Trị Khuyết Thiếu' : 'Missing Values'}
              </span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {isVi ? '0 giá trị khuyết (Sạch)' : '0 Missing (Clean)'}
              </div>
            </div>
          </div>

          {/* Column Schema Specs */}
          <div className="p-5 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isVi ? 'Kiểu Dữ Liệu & Lược Đồ Thuộc Tính' : 'Column Data Types & Schema'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {dataset.columns.map(col => (
                <div key={col} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{col}</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">{dataset.column_types[col]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabular Preview */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-750 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {isVi ? 'Xem Trước Dữ Liệu Mẫu (20 bản ghi đầu tiên)' : 'Sample Row Preview (First 20 records)'}
              </span>
              <span className="text-slate-400 font-mono">CSV Source</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-750">
                  <tr>
                    {dataset.columns.map(col => (
                      <th key={col} className="p-3 font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dataset.sample_data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      {dataset.columns.map(col => (
                        <td key={col} className="p-3 text-slate-700 dark:text-slate-300">
                          {row[col]}
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

      {activeTab === 'experiments' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-750">
                <tr>
                  <th className="p-3.5">{isVi ? 'Tên Thử Nghiệm' : 'Run Name'}</th>
                  <th className="p-3.5">{isVi ? 'Kiến Trúc Mô Hình' : 'Model Architecture'}</th>
                  <th className="p-3.5">{isVi ? 'Siêu Tham Số' : 'Hyperparameters'}</th>
                  <th className="p-3.5">{isVi ? 'Độ Chính Xác' : 'Accuracy'}</th>
                  <th className="p-3.5">{isVi ? 'Mất Mát (Log Loss)' : 'Log Loss'}</th>
                  <th className="p-3.5">{isVi ? 'Trạng Thái' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {experiments.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {exp.name}
                    </td>
                    <td className="p-3.5 text-indigo-600 dark:text-indigo-400">
                      {exp.model_name}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {JSON.stringify(exp.hyperparameters)}
                    </td>
                    <td className="p-3.5 text-emerald-600 font-bold">
                      {exp.metrics.accuracy ? `${(exp.metrics.accuracy * 100).toFixed(1)}%` : '-'}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">
                      {exp.metrics.log_loss ?? '-'}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
