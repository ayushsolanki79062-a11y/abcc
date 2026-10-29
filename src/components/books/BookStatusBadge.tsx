import React from 'react';
import { BookStatus } from '@/types/book';
import { STATUS_CONFIG } from '@/lib/constants';

interface BookStatusBadgeProps {
  status: BookStatus;
  size?: 'sm' | 'md';
}

export function BookStatusBadge({ status, size = 'sm' }: BookStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Available;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
}

