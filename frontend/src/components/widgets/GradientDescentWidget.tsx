import React, { useState } from 'react';

export const GradientDescentWidget: React.FC = () => {
  // Loss function: L(w) = (w - 2)^2 + 1. Min is at w = 2.0, L = 1.0. Derivative: 2*(w - 2)
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [currentW, setCurrentW] = useState<number>(4.5);
  const [history, setHistory] = useState<number[]>([4.5]);

  const loss = (w: number) => Math.pow(w - 2.0, 2) + 1.0;
  const gradient = (w: number) => 2.0 * (w - 2.0);

  const takeStep = () => {
    const grad = gradient(currentW);
    const nextW = currentW - learningRate * grad;
    // Bound to prevent NaN / infinity in rendering
    const boundedW = Math.max(-1, Math.min(6, nextW));
    setCurrentW(boundedW);
    setHistory(prev => [...prev.slice(-10), boundedW]);
  };

  const reset = () => {
    setCurrentW(4.5);
    setHistory([4.5]);
  };

  const currentLoss = loss(currentW);
  const isDiverging = currentLoss > 20;

  // SVG coordinate mapping: w in [-0.5, 5], loss in [0, 10]
  const mapX = (w: number) => ((w + 0.5) / 5.5) * 100;
  const mapY = (l: number) => 100 - (Math.min(l, 10) / 10) * 90;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 my-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Interactive Simulation: Gradient Descent on Loss Curve
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Target minimum: w = 2.0 (Loss = 1.0). Observe convergence vs oscillation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={takeStep}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            Take Step (w ← w - η·∇L)
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Learning Rate (η):</span>
              <span className={`font-mono font-bold ${learningRate > 0.9 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                {learningRate.toFixed(2)} {learningRate > 0.9 ? '(Divergence Risk!)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0.02"
              max="1.1"
              step="0.02"
              value={learningRate}
              onChange={e => setLearningRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Parameter (w):</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{currentW.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Loss L(w):</span>
              <span className={`font-bold ${Math.abs(currentW - 2.0) < 0.05 ? 'text-emerald-600' : 'text-blue-600'}`}>
                {currentLoss.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gradient ∇L:</span>
              <span className="text-slate-700 dark:text-slate-300">{gradient(currentW).toFixed(4)}</span>
            </div>
          </div>

          {isDiverging && (
            <div className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-lg border border-red-300 dark:border-red-800 font-medium">
              Over-shooting detected! Reduce the learning rate to converge smoothly.
            </div>
          )}
        </div>

        {/* Parabola Plot */}
        <div className="md:col-span-2 flex items-center justify-center">
          <div className="relative w-full max-w-[360px] aspect-[4/3] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Curve path */}
              <path
                d="M 0,90 Q 45,95 100,0"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              {/* Optimal minimum target */}
              <circle cx={mapX(2.0)} cy={mapY(1.0)} r="3" fill="#10b981" />

              {/* History trail */}
              {history.map((h, i) => (
                <circle
                  key={i}
                  cx={mapX(h)}
                  cy={mapY(loss(h))}
                  r={i === history.length - 1 ? 5 : 2.5}
                  fill={i === history.length - 1 ? '#2563eb' : '#93c5fd'}
                  stroke={i === history.length - 1 ? '#ffffff' : 'none'}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
              ))}
            </svg>
            <div className="absolute top-2 right-2 text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
              Min at w=2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
