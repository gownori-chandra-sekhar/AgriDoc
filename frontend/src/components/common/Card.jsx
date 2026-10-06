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
    glass: 'glass-card border-slate-800/90 bg-slate-900/80 backdrop-blur-xl shadow-xl',
    panel: 'glass-panel border-slate-800/90 bg-slate-950/90 shadow-2xl',
    solid: 'bg-slate-900 border-slate-800 shadow-md',
    emerald: 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/30 shadow-glow-sm',
    alert: 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-rose-500/30 shadow-glow-rose',
  };

  const interactiveStyles = interactive
    ? 'hover:border-emerald-500/50 hover:shadow-glow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.glass} ${interactiveStyles} ${className}`}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-800/80 px-5 py-4 bg-slate-900/60 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
      {footer && (
        <div className="border-t border-slate-800/80 px-5 py-3.5 bg-slate-950/60 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
