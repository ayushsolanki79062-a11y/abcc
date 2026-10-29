'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types/book';
import { BookStatusBadge } from './BookStatusBadge';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { formatDate, getDueStatus } from '@/lib/utils';
import { deleteBookRecord, updateBookRecord } from '@/lib/books';
import {
  BookOpen,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface BookListProps {
  books: Book[];
  viewMode: 'grid' | 'table';
  isLoading: boolean;
  onRefresh: () => void;
}

export function BookList({ books, viewMode, isLoading, onRefresh }: BookListProps) {
  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setActionDropdownOpen] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedBookForDelete) return;
    setIsDeleting(true);
    try {
      const { success } = await deleteBookRecord(selectedBookForDelete.id);
      if (success) {
        setSelectedBookForDelete(null);
        onRefresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (book: Book, newStatus: 'Available' | 'Returned') => {
    setActionDropdownOpen(null);
    await updateBookRecord(book.id, {
      status: newStatus,
      due_date: newStatus === 'Available' ? '' : book.due_date || undefined,
    });
    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 h-24"
          />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          No books found
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          No books match your current search, category, or status filter. Try clearing filters or add a new book to your collection.
        </p>
        <div className="mt-6">
          <Link
            href="/books/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Book</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteConfirmDialog
        book={selectedBookForDelete}
        isOpen={!!selectedBookForDelete}
        onClose={() => setSelectedBookForDelete(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {books.map((book) => {
            const dueStatus = getDueStatus(book.due_date, book.status);
            return (
              <div
                key={book.id}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <BookStatusBadge status={book.status} />
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {book.category}
                    </span>
                  </div>

                  <Link href={`/books/${book.id}`} className="block mt-3 group-hover:text-blue-600 transition-colors">
                    <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {book.title}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    by <span className="font-medium text-zinc-800 dark:text-zinc-200">{book.author}</span>
                  </p>

                  {book.isbn && (
                    <p className="mt-1 font-mono text-[11px] text-zinc-400">
                      ISBN: {book.isbn}
                    </p>
                  )}

                  {/* Due date info */}
                  {book.due_date && book.status === 'Issued' && (
                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
                        dueStatus.isOverdue
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{dueStatus.label}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">
                    Added {formatDate(book.created_at)}
                  </span>

                  <div className="flex items-center gap-1">
                    {book.status === 'Issued' && (
                      <button
                        onClick={() => handleToggleStatus(book, 'Returned')}
                        className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        title="Mark as Returned"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}

                    <Link
                      href={`/books/${book.id}/edit`}
                      className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      title="Edit book"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => setSelectedBookForDelete(book)}
                      className="rounded-lg p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      title="Delete book"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 pl-4 pr-3">Book Title & Author</th>
                  <th className="px-3 py-3.5">Category</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Due Date</th>
                  <th className="px-3 py-3.5">Added Date</th>
                  <th className="py-3.5 pl-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {books.map((book) => {
                  const dueStatus = getDueStatus(book.due_date, book.status);
                  return (
                    <tr
                      key={book.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 pl-4 pr-3 max-w-[280px]">
                        <Link
                          href={`/books/${book.id}`}
                          className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 block truncate"
                        >
                          {book.title}
                        </Link>
                        <div className="text-zinc-500 dark:text-zinc-400 truncate">
                          {book.author}
                          {book.isbn && <span className="ml-2 font-mono text-[10px] text-zinc-400">ISBN: {book.isbn}</span>}
                        </div>
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                        {book.category}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        <BookStatusBadge status={book.status} />
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        {book.status === 'Issued' && book.due_date ? (
                          <div
                            className={`inline-flex items-center gap-1 font-medium ${
                              dueStatus.isOverdue
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(book.due_date)}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                        {formatDate(book.created_at)}
                      </td>

                      <td className="py-3 pl-3 pr-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {book.status === 'Issued' && (
                            <button
                              onClick={() => handleToggleStatus(book, 'Returned')}
                              className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                              title="Mark as Returned"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}

                          <Link
                            href={`/books/${book.id}`}
                            className="rounded-md p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="View details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/books/${book.id}/edit`}
                            className="rounded-md p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Edit book"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => setSelectedBookForDelete(book)}
                            className="rounded-md p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

