import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Organic pacing
        const diff = 100 - prev;
        const step = Math.max(1, Math.floor(diff * 0.12) + Math.floor(Math.random() * 4));
        const next = Math.min(100, prev + step);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Hold 100% briefly, then fade out
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 350);

      // Unmount after transition finishes
      const removeTimer = setTimeout(() => {
        setIsFinished(true);
        if (onComplete) onComplete();
      }, 1050);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress, onComplete]);

  if (isFinished) {
    return null;
  }

  return (
    <div
      aria-label="Loading DOMORA"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-all duration-700 ease-out bg-[#0c241b] ${
        isFadingOut ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient luxury lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,15,10,0.7)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Circular Progress Loader containing the DOMORA Brand Mark */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Subtle ambient backglow */}
          <div className="absolute w-28 h-28 rounded-full bg-amber-500/15 blur-xl pointer-events-none" />

          {/* SVG Circular Loader */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="domoraLoadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="45%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Background circular track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                className="text-emerald-900/40"
              />

              {/* Active animated progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#domoraLoadingGrad)"
                strokeWidth="4"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (263.89 * progress) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-150 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))'
                }}
              />
            </svg>

            {/* Continuous subtle spinner ring for movement feel */}
            <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-amber-400/40 animate-spin pointer-events-none" style={{ animationDuration: '2.5s' }} />

            {/* Centered Brand House Icon inside rounded container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#091a13]/80 border border-emerald-900/50 flex items-center justify-center shadow-inner">
                <svg
                  className="w-8 h-8 text-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 6L6 22H13V40H21V28H27V40H35V22H42L24 6Z"
                    fill="currentColor"
                  />
                  <path
                    d="M31 10H36V18L31 13.5V10Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* DOMORA Brand Name: DOM (White) + ORA (Mint Teal) */}
        <div className="flex items-center justify-center text-3xl sm:text-4xl tracking-tight">
          <span className="font-extrabold text-white tracking-tight">DOM</span>
          <span className="font-light text-[#5eead4] tracking-widest ml-0.5">ORA</span>
        </div>
        <p className="text-xs text-emerald-100/70 font-light mt-2 tracking-wide">
          Mais que imóveis, são sonhos.
        </p>
      </div>
    </div>
  );
};
