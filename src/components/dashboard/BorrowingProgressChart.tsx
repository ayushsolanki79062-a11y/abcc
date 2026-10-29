import React from 'react';
import { BarChart3 } from 'lucide-react';

interface MonthlyStat {
  month: string;
  borrowed: number;
  returned: number;
}

interface BorrowingProgressChartProps {
  stats: MonthlyStat[];
}

export function BorrowingProgressChart({ stats }: BorrowingProgressChartProps) {
  const maxVal = Math.max(...stats.map((s) => Math.max(s.borrowed, s.returned)), 5);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-zinc-500" />
          <h3 className="font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Monthly Reading & Borrowing Activity
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Borrowed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-slate-800 dark:bg-zinc-300" />
            <span className="text-zinc-600 dark:text-zinc-400">Returned</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pb-2">
          {stats.map((item) => {
            const borrowedHeight = Math.min(100, Math.round((item.borrowed / maxVal) * 100));
            const returnedHeight = Math.min(100, Math.round((item.returned / maxVal) * 100));

            return (
              <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                  {/* Borrowed Bar */}
                  <div className="relative w-1/2 flex items-end h-full">
                    <div
                      style={{ height: `${Math.max(borrowedHeight, 4)}%` }}
                      className="w-full rounded-t-xs bg-amber-500 transition-all group-hover:bg-amber-600 relative"
                      title={`${item.borrowed} borrowed in ${item.month}`}
                    >
                      {item.borrowed > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.borrowed}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Returned Bar */}
                  <div className="relative w-1/2 flex items-end h-full">
                    <div
                      style={{ height: `${Math.max(returnedHeight, 4)}%` }}
                      className="w-full rounded-t-xs bg-slate-800 dark:bg-zinc-300 transition-all group-hover:bg-slate-900 dark:group-hover:bg-white relative"
                      title={`${item.returned} returned in ${item.month}`}
                    >
                      {item.returned > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.returned}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {item.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

