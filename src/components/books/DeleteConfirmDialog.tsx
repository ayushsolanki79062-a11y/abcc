'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Book } from '@/types/book';

interface DeleteConfirmDialogProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  book,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmDialogProps) {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-100 p-2.5 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                Confirm Book Deletion
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-zinc-50 p-3.5 text-xs text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{book.title}</p>
          <p className="text-zinc-500 dark:text-zinc-400">by {book.author}</p>
          {book.isbn && <p className="mt-1 font-mono text-[11px] text-zinc-400">ISBN: {book.isbn}</p>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-zinc-300 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      </div>
    </div>
  );
}

