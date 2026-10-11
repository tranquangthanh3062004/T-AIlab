import React, { useState } from 'react';

export const PerceptronWidget: React.FC = () => {
  const [w1, setW1] = useState<number>(0.6);
  const [w2, setW2] = useState<number>(-0.8);
  const [bias, setBias] = useState<number>(0.1);

  // Sample 2D points: [x1, x2, label (1 = blue, 0 = red)]
  const points = [
    { x1: 0.2, x2: 0.8, label: 1 },
    { x1: 0.4, x2: 0.7, label: 1 },
    { x1: 0.7, x2: 0.9, label: 1 },
    { x1: 0.8, x2: 0.6, label: 1 },
    { x1: 0.2, x2: 0.2, label: 0 },
    { x1: 0.5, x2: 0.3, label: 0 },
    { x1: 0.8, x2: 0.2, label: 0 },
    { x1: 0.9, x2: 0.4, label: 0 },
  ];

  // Evaluate accuracy
  const correctCount = points.filter(p => {
    const score = w1 * p.x1 + w2 * p.x2 + bias;
    const pred = score >= 0 ? 1 : 0;
    return pred === p.label;
  }).length;

  const accuracyPct = Math.round((correctCount / points.length) * 100);

  // Compute 2 boundary points for line w1*x1 + w2*x2 + b = 0 => x2 = (-w1*x1 - b) / w2
  const calcX2 = (x1: number) => {
    if (Math.abs(w2) < 0.001) return 0.5;
    return (-w1 * x1 - bias) / w2;
  };

  const lineY0 = Math.max(0, Math.min(1, calcX2(0)));
  const lineY1 = Math.max(0, Math.min(1, calcX2(1)));

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 my-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            Interactive Simulation: 2D Linear Decision Boundary
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust weights and bias to rotate and translate the decision hyperplane.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Accuracy:</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
            accuracyPct === 100 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
          }`}>
            {accuracyPct}% ({correctCount}/{points.length} Correct)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Weight 1 (w₁):</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{w1.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.05"
              value={w1}
              onChange={e => setW1(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Weight 2 (w₂):</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{w2.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.05"
              value={w2}
              onChange={e => setW2(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Bias (b):</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{bias.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.05"
              value={bias}
              onChange={e => setBias(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
            z = ({w1.toFixed(2)})·x₁ + ({w2.toFixed(2)})·x₂ + ({bias.toFixed(2)})
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="md:col-span-2 flex items-center justify-center">
          <div className="relative w-full max-w-[320px] aspect-square bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Grid axes */}
              <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />

              {/* Separating Decision Boundary Line */}
              <line
                x1="0"
                y1={100 - lineY0 * 100}
                x2="100"
                y2={100 - lineY1 * 100}
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />

              {/* Points */}
              {points.map((pt, idx) => {
                const score = w1 * pt.x1 + w2 * pt.x2 + bias;
                const isCorrect = (score >= 0 ? 1 : 0) === pt.label;
                const cx = pt.x1 * 100;
                const cy = 100 - pt.x2 * 100;

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill={pt.label === 1 ? '#3b82f6' : '#ef4444'}
                    stroke={isCorrect ? '#10b981' : '#f59e0b'}
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Class 1</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Class 0</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-emerald-500"></span> Correctly Classified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
