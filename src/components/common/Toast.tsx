import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
  isDark?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  duration = 2600,
  isDark = false,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 w-auto max-w-sm pointer-events-none">
      <div
        role="status"
        onClick={onClose}
        className={`pointer-events-auto cursor-pointer flex items-center justify-center px-6 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] animate-slide-up ${
          isDark
            ? 'bg-[#131B2E] text-white'
            : 'bg-[#FFCE31] text-black'
        }`}
      >
        <span className="text-xs sm:text-sm font-extrabold tracking-tight truncate select-none">
          {message}
        </span>
      </div>
    </div>
  );
};

