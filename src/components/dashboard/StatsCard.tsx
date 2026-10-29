import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'amber' | 'emerald' | 'rose' | 'slate';
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-zinc-900',
    border: 'border-zinc-200 dark:border-zinc-800',
    iconBg: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  },
  emerald: {
    bg: 'bg-white dark:bg-zinc-900',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-white dark:bg-zinc-900',
    border: 'border-amber-200 dark:border-amber-800/60',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  },
  rose: {
    bg: 'bg-white dark:bg-zinc-900',
    border: 'border-rose-200 dark:border-rose-800/60',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
  },
  slate: {
    bg: 'bg-white dark:bg-zinc-900',
    border: 'border-slate-200 dark:border-zinc-800',
    iconBg: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 shadow-xs transition-all hover:shadow-sm ${styles.bg} ${styles.border}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
        <div className={`rounded-lg p-2.5 ${styles.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {value}
        </h3>
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

