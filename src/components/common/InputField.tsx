import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isDark?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  hint,
  icon,
  rightElement,
  isDark = false,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          className={`text-xs font-black uppercase tracking-wider flex items-center justify-between ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          <span>{label}</span>
          {props.required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div
            className={`absolute left-3.5 flex items-center pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {icon}
          </div>
        )}

        <input
          {...props}
          className={`w-full py-3 px-3.5 rounded-2xl text-sm font-semibold transition-all outline-none border-2 border-black shadow-[2px_2px_0px_#000] ${
            icon ? 'pl-10' : ''
          } ${rightElement ? 'pr-12' : ''} ${
            error
              ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-400'
              : isDark
              ? 'bg-[#151D28] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#69818D]'
              : 'bg-white text-black placeholder-slate-400 focus:ring-2 focus:ring-[#69818D]'
          } ${className}`}
        />

        {rightElement && (
          <div className="absolute right-2.5 flex items-center">{rightElement}</div>
        )}
      </div>

      {error ? (
        <span className="text-xs font-bold text-red-500">{error}</span>
      ) : hint ? (
        <span className="text-xs font-medium text-slate-500">{hint}</span>
      ) : null}
    </div>
  );
};
