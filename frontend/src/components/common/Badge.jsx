import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '',
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full select-none';

  const variants = {
    // Urgency levels
    low: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    medium: 'bg-amber-100 text-amber-800 border border-amber-300',
    high: 'bg-rose-100 text-rose-800 border border-rose-300',
    critical: 'bg-rose-600 text-white shadow-sm font-black',

    // Status colors
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300',
    danger: 'bg-rose-100 text-rose-800 border border-rose-300',
    info: 'bg-sky-100 text-sky-800 border border-sky-300',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-300',
    default: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
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
