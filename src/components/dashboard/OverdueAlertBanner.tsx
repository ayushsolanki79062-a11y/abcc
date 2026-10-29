'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface OverdueAlertBannerProps {
  overdueCount: number;
}

export function OverdueAlertBanner({ overdueCount }: OverdueAlertBannerProps) {
  if (overdueCount <= 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50/90 dark:border-rose-900/60 dark:bg-rose-950/40 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-rose-500/15 p-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
              Attention Required: {overdueCount} {overdueCount === 1 ? 'Book is' : 'Books are'} Overdue!
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300/80">
              One or more borrowed library items have surpassed their return deadlines. Please mark as returned or extend the due date.
            </p>
          </div>
        </div>

        <Link
          href="/books?status=Issued"
          className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors shrink-0"
        >
          <span>View Overdue Items</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

