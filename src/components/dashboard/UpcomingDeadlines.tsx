import React from 'react';
import Link from 'next/link';
import { Book } from '@/types/book';
import { formatDate, getDueStatus } from '@/lib/utils';
import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';

interface UpcomingDeadlinesProps {
  deadlines: Book[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <h3 className="font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Upcoming Return Deadlines
          </h3>
        </div>
        <Link
          href="/books?status=Issued"
          className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {deadlines.length === 0 ? (
          <div className="py-8 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No pending return deadlines. All borrowed books are on track!
            </p>
          </div>
        ) : (
          deadlines.map((book) => {
            const dueStatus = getDueStatus(book.due_date, book.status);
            return (
              <div
                key={book.id}
                className="flex items-center justify-between py-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <Link
                    href={`/books/${book.id}`}
                    className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 truncate block"
                  >
                    {book.title}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    by {book.author} • <span className="font-medium text-zinc-700 dark:text-zinc-300">{book.category}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatDate(book.due_date)}
                    </div>
                    <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {dueStatus.label}
                    </div>
                  </div>

                  <Link
                    href={`/books/${book.id}`}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="View details"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

