import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '',
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-extrabold uppercase tracking-wider rounded-full select-none';

  const variants = {
    // Urgency levels
    low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    high: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-glow-rose',
    critical: 'bg-rose-600 text-white shadow-glow-rose font-black',
    
    // Status colors
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
    info: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
    default: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
    lg: 'px-3.5 py-1.5 text-xs',
  };

  const normalizedVariant = (typeof variant === 'string' ? variant.toLowerCase() : 'default');
  const style = variants[normalizedVariant] || variants.default;

  return (
    <span className={`${baseStyles} ${style} ${sizes[size] || sizes.md} ${className}`}>
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />}
      {children}
    </span>
  );
}
