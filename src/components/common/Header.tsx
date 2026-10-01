import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  isDark = false,
}) => {
  return (
    <header
      className={`px-4 py-3 flex items-center justify-between border-b-2 border-black transition-colors select-none ${
        isDark
          ? 'bg-[#0B0F15] text-white'
          : 'bg-white text-black'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-black bg-white dark:bg-[#151D28] text-black dark:text-white shadow-[1px_1px_0px_#000] hover:bg-[#69818D] hover:text-white transition-colors cursor-pointer"
            title="Go back"
            aria-label="Back"
          >
            <ArrowLeft size={18} strokeWidth={2.6} />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-lg font-black tracking-tight truncate leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-semibold truncate text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center gap-1 shrink-0">{rightAction}</div>
      )}
    </header>
  );
};
