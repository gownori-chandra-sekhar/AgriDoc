import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ariaLabel,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold transition-all select-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px] sm:min-h-[48px]';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-bold shadow-glow-sm hover:shadow-glow-md hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.01]',
    secondary:
      'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-800 shadow-sm',
    danger:
      'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white shadow-sm',
    warning:
      'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-500 hover:text-white shadow-sm',
    outline:
      'border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[38px]',
    cyber:
      'bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white font-bold shadow-md hover:scale-[1.01]',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs gap-1.5 min-h-[38px]',
    md: 'px-5 py-3 text-xs sm:text-sm gap-2 min-h-[48px]',
    lg: 'px-7 py-4 text-sm sm:text-base gap-2.5 min-h-[52px]',
    icon: 'p-3 min-w-[48px] min-h-[48px] rounded-2xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />}
          {children}
        </>
      )}
    </button>
  );
}
