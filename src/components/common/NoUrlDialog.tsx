import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NoUrlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const NoUrlDialog: React.FC<NoUrlDialogProps> = ({
  isOpen,
  onClose,
  isDark = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog matching Screenshot */}
      <div
        className="relative z-10 w-full max-w-[285px] rounded-3xl p-6 text-center border-2 border-black shadow-[6px_6px_0px_#000] bg-white animate-scale-up"
      >
        {/* Warning Icon: Orange/Amber Alert Circle */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#FF9F00]">
            <AlertCircle size={52} strokeWidth={2.4} />
          </div>
        </div>

        {/* Title: No URL in black font */}
        <h3 className="text-xl font-black tracking-tight mb-1 text-black">
          No URL
        </h3>

        {/* Description */}
        <p className="text-sm font-semibold text-slate-500 mb-6">
          Please enter a link to save
        </p>

        {/* Golden Yellow OK Button matching Screenshot 4 */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#FFCE31] hover:bg-[#FFD54F] text-black font-extrabold text-base border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  );
};
