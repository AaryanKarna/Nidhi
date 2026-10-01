import React from 'react';
import { Bookmark } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  isDark?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  isDark = false,
}) => {
  return (
    <div
      className={`w-full h-full flex flex-col justify-between select-none relative overflow-hidden transition-colors ${
        isDark ? 'bg-[#0B0F19] text-white' : 'bg-[#FFFFFF] text-black'
      }`}
    >
      {/* Top Bar: Logo and NIDHI text removed as requested */}
      <div className="pt-6 px-6 flex items-center justify-between z-20 min-h-[3rem]" />

      {/* Main Content: Exact Recreation of First Page */}
      <div className="flex-1 flex flex-col items-center justify-between px-5 pt-1 pb-6 overflow-y-auto no-scrollbar z-10 max-w-md mx-auto w-full">
        {/* Headline */}
        <div className="text-center pt-2">
          <h1
            className={`text-3xl sm:text-4xl font-black tracking-tight leading-[1.12] ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Too many links.
            <br />
            Too many spaces.
          </h1>
          <p
            className={`text-sm sm:text-base font-semibold mt-3 leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Save. Organize. Find.
          </p>
        </div>

        {/* Central Graphic: Overwhelmed Bookmark Mascot surrounded by scattered saves */}
        <div className="relative w-full max-w-[340px] h-[340px] my-auto flex items-center justify-center">
          {/* Motion swoop arcs */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-20"
            viewBox="0 0 340 340"
            fill="none"
          >
            <path
              d="M 50,195 C 80,165 120,155 160,175"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 270,195 C 240,215 200,235 170,225"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Action marks */}
            <path d="M 45,95 L 35,85" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <path d="M 52,105 L 42,102" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <path d="M 285,195 L 295,205" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <path d="M 292,185 L 302,188" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          </svg>

          {/* Card 1: Top-Left (Instagram) */}
          <div
            className={`absolute top-2 left-2 -rotate-8 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shrink-0">
              <div className="w-4 h-4 rounded-md border-2 border-[#FFCE31] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFCE31]" />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-14">
              <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* Card 2: Top-Right (TikTok) */}
          <div
            className={`absolute top-4 right-2 rotate-6 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
              <span className="text-[#FFCE31] text-xs font-black">♪</span>
            </div>
            <div className="flex flex-col gap-1 w-14">
              <div className="h-1.5 w-14 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-9 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* Card 3: Mid-Left (Browser / Web) */}
          <div
            className={`absolute top-26 -left-2 -rotate-6 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#FFCE31] border border-black flex items-center justify-center shrink-0 text-black font-black text-xs">
              🌐
            </div>
            <div className="flex flex-col gap-1 w-12">
              <div className="h-1.5 w-11 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-7 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* Card 4: Mid-Right (Community) */}
          <div
            className={`absolute top-28 -right-1 rotate-8 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[#FFCE31] shrink-0 font-bold text-xs">
              <span className="text-[11px] font-black">●ᴥ●</span>
            </div>
            <div className="flex flex-col gap-1 w-12">
              <div className="h-1.5 w-11 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-7 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* Card 5: Lower-Left (X / Social) */}
          <div
            className={`absolute bottom-12 left-1 -rotate-6 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 font-bold text-xs">
              𝕏
            </div>
            <div className="flex flex-col gap-1 w-12">
              <div className="h-1.5 w-11 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* Card 6: Lower-Right (Notes / Threads) */}
          <div
            className={`absolute bottom-10 right-2 rotate-6 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#FFCE31] text-black border border-black flex items-center justify-center shrink-0 font-black text-sm">
              @
            </div>
            <div className="flex flex-col gap-1 w-12">
              <div className="h-1.5 w-11 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* Card 7: Bottom (Video / Article) */}
          <div
            className={`absolute -bottom-3 left-10 -rotate-4 px-2.5 py-2 rounded-xl border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_#000] transition-transform hover:scale-105 ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-black text-[#FFCE31] flex items-center justify-center shrink-0 font-black text-sm">
              ▶
            </div>
            <div className="flex flex-col gap-1 w-12">
              <div className="h-1.5 w-11 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-1.5 w-7 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <Bookmark size={15} className="text-black dark:text-[#FFCE31] ml-0.5 fill-[#FFCE31]" />
          </div>

          {/* CENTER MASCOT: Yellow & White with Black Outlines & Solid Hard Shadow (No Blue) */}
          <div className="relative z-10 w-36 h-40 flex items-center justify-center">
            <svg
              viewBox="0 0 160 180"
              className="w-full h-full drop-shadow-md overflow-visible"
            >
              {/* Left Panic Arm */}
              <path
                d="M 45,95 Q 15,85 10,65"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="9" cy="63" r="4.5" fill="#000000" />

              {/* Right Panic Arm */}
              <path
                d="M 115,95 Q 145,88 152,70"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="152" cy="69" r="4.5" fill="#000000" />

              {/* Left Running Foot */}
              <path
                d="M 55,148 Q 45,160 38,166"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Running Foot */}
              <path
                d="M 105,148 Q 115,162 125,164"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Bookmark Body: 3D Hard Solid Shadow layer (Yellow/White theme with Black hard shadow, NO blue) */}
              <path
                d="M 50,26 L 116,26 L 116,142 L 83,124 L 50,142 Z"
                fill="#000000"
              />

              {/* Bookmark Main Body: Golden Yellow */}
              <path
                d="M 44,20 L 110,20 L 110,136 L 77,118 L 44,136 Z"
                fill="#FFCE31"
                stroke="#000000"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* Top punch hole */}
              <circle
                cx="95"
                cy="34"
                r="6.5"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="3.5"
              />

              {/* Silver Paperclip attached through top hole */}
              <path
                d="M 95,30 C 95,15 116,15 116,30 L 116,42 C 116,50 102,50 102,42 L 102,32"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 95,30 C 95,15 116,15 116,30 L 116,42 C 116,50 102,50 102,42 L 102,32"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Worried Eyebrows */}
              <path
                d="M 55,62 Q 62,56 68,60"
                stroke="#000000"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 85,60 Q 91,56 98,62"
                stroke="#000000"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Worried Eyes */}
              <ellipse cx="63" cy="72" rx="7" ry="8" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
              <circle cx="61" cy="69" r="4" fill="#000000" />
              <circle cx="60" cy="67" r="1.5" fill="#FFFFFF" />

              <ellipse cx="90" cy="72" rx="7" ry="8" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
              <circle cx="88" cy="69" r="4" fill="#000000" />
              <circle cx="87" cy="67" r="1.5" fill="#FFFFFF" />

              {/* Distressed Mouth */}
              <path
                d="M 70,88 Q 77,82 84,88 Q 84,98 77,98 Q 70,98 70,88 Z"
                fill="#000000"
              />
              <path
                d="M 73,94 Q 77,91 81,94"
                stroke="#FFCE31"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Blush */}
              <circle cx="52" cy="79" r="3" fill="#F59E0B" opacity="0.6" />
              <circle cx="101" cy="79" r="3" fill="#F59E0B" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Enter CTA Button: strictly only "Enter" as requested */}
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl bg-[#FFCE31] text-black font-black text-lg border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center hover:bg-[#FFD54F]"
        >
          <span>Enter</span>
        </button>
      </div>
    </div>
  );
};
