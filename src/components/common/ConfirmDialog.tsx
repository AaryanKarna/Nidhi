import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDark?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isDark = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 border-2 border-black shadow-[4px_4px_0px_#000] transition-all animate-scale-up ${
          isDark
            ? 'bg-[#131B2E] text-white'
            : 'bg-white text-black'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-2xl border border-black shadow-[1px_1px_0px_#000] flex items-center justify-center shrink-0 ${
              isDangerous
                ? 'bg-red-100 text-red-600'
                : 'bg-[#FFCE31] text-black'
            }`}
          >
            {isDangerous ? <Trash2 size={20} strokeWidth={2.4} /> : <AlertTriangle size={20} strokeWidth={2.4} />}
          </div>
          <h3 className="text-lg font-black tracking-tight">{title}</h3>
        </div>

        <p className="text-sm font-semibold leading-relaxed mb-6 text-black">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
            isDark={isDark}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isDark={isDark}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
