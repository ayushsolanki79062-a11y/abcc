'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { BookStatusBadge } from './BookStatusBadge';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { formatDate, getDueStatus } from '@/lib/utils';
import { deleteBookRecord, updateBookRecord } from '@/lib/books';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  Bookmark,
  FileText,
  User,
} from 'lucide-react';

interface BookDetailCardProps {
  initialBook: Book;
}

export function BookDetailCard({ initialBook }: BookDetailCardProps) {
  const router = useRouter();
  const [book, setBook] = useState<Book>(initialBook);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const dueStatus = getDueStatus(book.due_date, book.status);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success } = await deleteBookRecord(book.id);
      if (success) {
        router.push('/books');
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: 'Available' | 'Issued' | 'Returned') => {
    setIsUpdatingStatus(true);
    try {
      const updatePayload: Record<string, unknown> = { status: newStatus };
      if (newStatus === 'Returned') {
        // Keep history
      } else if (newStatus === 'Available') {
        updatePayload.borrowed_date = null;
        updatePayload.due_date = null;
      }
      const { book: updated } = await updateBookRecord(book.id, updatePayload);
      if (updated) {
        setBook(updated);
        router.refresh();
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <DeleteConfirmDialog
        book={book}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <div className="space-y-6">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Book Catalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/books/${book.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 shadow-xs transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </Link>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70 shadow-xs transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Due Date Alert if Overdue */}
        {dueStatus.isOverdue && (
          <div className="rounded-xl border border-rose-300 bg-rose-50/90 dark:border-rose-900/60 dark:bg-rose-950/40 p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                  This book is overdue! ({dueStatus.label})
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300/80">
                  Scheduled due date was {formatDate(book.due_date)}.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleStatusChange('Returned')}
              disabled={isUpdatingStatus}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
            >
              Mark Returned Now
            </button>
          </div>
        )}

        {/* Main Details Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookStatusBadge status={book.status} size="md" />
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {book.category}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {book.title}
              </h1>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <User className="h-4 w-4 text-zinc-400" />
                <span>Written by <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{book.author}</strong></span>
              </p>
            </div>

            {/* Quick Status Actions */}
            <div className="shrink-0 flex items-center gap-2">
              {book.status === 'Issued' && (
                <button
                  onClick={() => handleStatusChange('Returned')}
                  disabled={isUpdatingStatus}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark as Returned</span>
                </button>
              )}
              {book.status === 'Available' && (
                <Link
                  href={`/books/${book.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 transition-colors"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Issue / Check Out</span>
                </Link>
              )}
              {book.status === 'Returned' && (
                <button
                  onClick={() => handleStatusChange('Available')}
                  disabled={isUpdatingStatus}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <span>Mark Back in Shelf</span>
                </button>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                ISBN Number
              </span>
              <p className="font-mono text-sm text-zinc-800 dark:text-zinc-200">
                {book.isbn || 'None assigned'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Borrowed Date
              </span>
              <p className="text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                {formatDate(book.borrowed_date)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Return Due Date
              </span>
              <p className="text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" />
                {formatDate(book.due_date)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Date Added
              </span>
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                {formatDate(book.created_at)}
              </p>
            </div>
          </div>

          {/* Notes & Location */}
          {book.notes && (
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Notes & Circulation History
              </span>
              <p className="mt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                {book.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

