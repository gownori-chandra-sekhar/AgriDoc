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
    'relative inline-flex items-center justify-center font-bold transition-all select-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px] sm:min-h-[48px]';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 font-black shadow-glow-sm hover:shadow-glow-md hover:scale-[1.02]',
    secondary:
      'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-850 hover:border-emerald-500/50 hover:text-white shadow-sm',
    danger:
      'bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white shadow-glow-rose',
    warning:
      'bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600 hover:text-slate-950 shadow-lg',
    outline:
      'border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400',
    ghost:
      'text-slate-400 hover:text-white hover:bg-slate-800/60 min-h-[38px]',
    cyber:
      'bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 text-white font-black shadow-glow-cyan hover:scale-[1.02]',
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
