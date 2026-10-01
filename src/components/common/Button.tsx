import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
  isDark?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  isDark = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-xl min-h-[44px]',
    lg: 'px-6 py-3.5 text-base rounded-2xl min-h-[50px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#69818D] hover:bg-[#5A717D] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] disabled:opacity-50 disabled:shadow-none',
    secondary: isDark
      ? 'bg-[#151D28] hover:bg-[#1E2938] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-bold active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50'
      : 'bg-white hover:bg-slate-50 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-bold active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50',
    danger:
      'bg-red-500 hover:bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_#000] font-bold active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50',
    ghost: isDark
      ? 'hover:bg-[#151D28] text-slate-300 hover:text-white font-bold'
      : 'hover:bg-slate-100 text-slate-800 hover:text-black font-bold',
    outline: isDark
      ? 'border-2 border-black bg-[#151D28] text-white shadow-[2px_2px_0px_#000] font-bold hover:bg-[#1E2938]'
      : 'border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] font-bold hover:bg-slate-50',
  }[variant];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center tracking-tight transition-all cursor-pointer disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2 shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
