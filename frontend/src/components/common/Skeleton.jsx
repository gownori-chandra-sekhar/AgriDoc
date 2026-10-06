import React from 'react';

export function Skeleton({ className = '', variant = 'text' }) {
  const base = 'animate-pulse bg-slate-200/80 rounded-xl';

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-2xl',
    card: 'h-48 w-full rounded-3xl',
    button: 'h-12 w-32 rounded-2xl',
    row: 'h-14 w-full rounded-xl',
  };

  return <div className={`${base} ${variants[variant] || ''} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-200 bg-white space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton variant="avatar" className="h-10 w-10" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton variant="title" className="w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="pt-2 flex justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default Skeleton;
