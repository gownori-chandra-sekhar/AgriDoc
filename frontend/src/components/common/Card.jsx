import React from 'react';

export default function Card({
  children,
  className = '',
  variant = 'glass',
  interactive = false,
  onClick,
  header,
  footer,
  ...props
}) {
  const baseStyles = 'rounded-3xl border transition-all duration-300 relative overflow-hidden';

  const variants = {
    glass: 'glass-card border-[#e2ece4] bg-white shadow-canva-card',
    panel: 'glass-panel border-[#e2ece4] bg-white/95 shadow-canva-card',
    solid: 'bg-white border-[#e2ece4] shadow-sm',
    emerald: 'bg-gradient-to-br from-white via-white to-emerald-50/70 border-emerald-200 shadow-canva-card',
    alert: 'bg-gradient-to-br from-white via-white to-rose-50/70 border-rose-200 shadow-sm',
  };

  const interactiveStyles = interactive
    ? 'hover:border-emerald-400 hover:shadow-canva-hover hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.glass} ${interactiveStyles} ${className}`}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/70 flex items-center justify-between text-slate-900 font-bold">
          {header}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
      {footer && (
        <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/50 flex items-center justify-between text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
}
