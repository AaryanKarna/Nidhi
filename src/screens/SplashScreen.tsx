import React, { useEffect } from 'react';
import { Bookmark, ShieldCheck, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  isDark?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDark = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`flex-1 flex flex-col items-center justify-between p-6 select-none cursor-pointer transition-colors relative overflow-hidden ${
        isDark ? 'bg-[#0B0F19] text-white' : 'bg-[#FFFFFF] text-black'
      }`}
    >
      {/* Top Offline / Private Pill */}
      <div className="pt-6 animate-fade-in">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black tracking-wider uppercase ${
            isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
          <span>OFFLINE FIRST • PRIVATE</span>
        </div>
      </div>

      {/* Center Branding Block */}
      <div className="flex flex-col items-center justify-center text-center my-auto animate-scale-up">
        {/* Yellow Vault / Logo Box */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-3xl bg-[#FFCE31] border-[3px] border-black shadow-[5px_5px_0px_#000] flex items-center justify-center text-black transition-transform hover:scale-105 active:scale-95">
            <Bookmark size={46} strokeWidth={2.6} className="fill-black text-black" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
            <ShieldCheck size={18} strokeWidth={2.8} />
          </div>
        </div>

        {/* Title: NIDHI */}
        <div className="flex items-center gap-1.5 mb-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase">
            NIDHI
          </h1>
          <span className="w-3 h-3 rounded-full bg-[#FFCE31] border-2 border-black shadow-[1px_1px_0px_#000]" />
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-300 max-w-[240px] leading-snug">
          Save once. Find anytime.
        </p>

        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
          Personal Link Vault
        </span>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="pb-6 flex flex-col items-center gap-3 animate-fade-in">
        <div
          className={`w-5 h-5 border-2 ${
            isDark ? 'border-white' : 'border-black'
          } border-t-transparent rounded-full animate-spin`}
        />
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
          Tap anywhere to continue
        </span>
      </div>
    </div>
  );
};
