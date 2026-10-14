import React from 'react';

interface AnimatedLogoProps {
  onClick?: () => void;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  onClick,
  subtitle,
  size = 'md'
}) => {
  const iconBoxSize = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer group select-none"
      role="button"
      tabIndex={0}
      aria-label="T Lab AI Home"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      {/* Animated Orbital Neural Core Emblem */}
      <div className={`relative ${iconBoxSize} flex items-center justify-center shrink-0`}>
        {/* Ambient Pulsing Aura */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 opacity-30 dark:opacity-50 blur-md group-hover:opacity-75 group-hover:blur-lg transition-all duration-500 animate-pulse" />

        {/* Main Glass Container */}
        <div className="relative w-full h-full rounded-2xl bg-slate-950 dark:bg-slate-900 border border-indigo-500/40 shadow-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {/* Animated SVG Neural Atom & T Core */}
          <svg
            viewBox="0 0 48 48"
            className="w-full h-full p-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="tailabGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="tailabGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Outer Rotating Dashed Ring */}
            <g className="origin-center animate-[spin_10s_linear_infinite]">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="url(#tailabGrad1)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeOpacity="0.75"
              />
              <circle cx="24" cy="5" r="2.2" fill="#38bdf8" />
              <circle cx="24" cy="43" r="1.8" fill="#c084fc" />
            </g>

            {/* Inner Counter-Rotating Elliptical Orbit */}
            <g className="origin-center animate-[spin_7s_linear_infinite_reverse]">
              <ellipse
                cx="24"
                cy="24"
                rx="15"
                ry="8.5"
                transform="rotate(-32 24 24)"
                stroke="url(#tailabGrad2)"
                strokeWidth="1.4"
                strokeOpacity="0.8"
              />
              <circle cx="11.5" cy="16" r="2" fill="#34d399" />
            </g>

            {/* Second Tilted Elliptical Orbit */}
            <g className="origin-center animate-[spin_9s_linear_infinite]">
              <ellipse
                cx="24"
                cy="24"
                rx="15"
                ry="8.5"
                transform="rotate(32 24 24)"
                stroke="url(#tailabGrad1)"
                strokeWidth="1.3"
                strokeOpacity="0.65"
              />
              <circle cx="36.5" cy="16" r="1.8" fill="#818cf8" />
            </g>

            {/* Glowing Hexagon Core & Monogram T */}
            <polygon
              points="24,13 33,18.2 33,29.8 24,35 15,29.8 15,18.2"
              fill="url(#tailabGrad1)"
              fillOpacity="0.22"
              stroke="url(#tailabGrad1)"
              strokeWidth="1.4"
            />

            {/* Bold Futuristic "T" Symbol inside the Core */}
            <path
              d="M18.5 19.5H29.5M24 19.5V30.5"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="19.5" r="1.5" fill="#38bdf8" className="animate-ping" />
          </svg>
        </div>

        {/* Live Status Dot */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-900" />
        </span>
      </div>

      {/* Brand Wordmark & Subtitle */}
      <div className="leading-none">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tight text-lg sm:text-xl bg-gradient-to-r from-slate-900 via-indigo-700 to-sky-600 dark:from-white dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
            T Lab AI
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/10 to-sky-500/10 dark:from-indigo-500/20 dark:to-sky-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-700/70">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI OS
          </span>
        </div>
        {subtitle && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
