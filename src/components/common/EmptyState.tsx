import React from 'react';
import { FolderSearch, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  isDark?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  isDark = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10 max-w-sm mx-auto animate-fade-in">
      {/* Visual illustration container */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-[#69818D] border-2 border-black text-white shadow-[3px_3px_0px_#000]">
        {icon || <FolderSearch size={30} strokeWidth={2.4} />}
      </div>

      <h3
        className={`text-lg font-black tracking-tight ${
          isDark ? 'text-white' : 'text-black'
        }`}
      >
        {title}
      </h3>

      <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-slate-500 max-w-[280px]">
        {description}
      </p>

      {actionText && onAction && (
        <div className="mt-5">
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={18} strokeWidth={2.6} />}
            onClick={onAction}
            isDark={isDark}
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
