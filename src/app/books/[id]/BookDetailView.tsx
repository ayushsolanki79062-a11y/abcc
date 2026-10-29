'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookDetailCard } from '@/components/books/BookDetailCard';
import { fetchBookById } from '@/lib/books';
import { Book } from '@/types/book';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export function BookDetailView({ id }: { id: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      setIsLoading(true);
      setError(null);
      const { book: fetched, error: fetchErr } = await fetchBookById(id);
      if (cancelled) return;

      if (fetchErr) {
        setError(fetchErr);
      } else if (!fetched) {
        setError('Book not found in library database.');
      } else {
        setBook(fetched);
      }
      setIsLoading(false);
    }

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/40">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
            <h3 className="font-serif text-base font-semibold text-rose-900 dark:text-rose-200">
              Could not load book details
            </h3>
            <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">{error}</p>
            <div className="mt-4">
              <Link
                href="/books"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-900 underline dark:text-rose-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Book Catalog
              </Link>
            </div>
          </div>
        )}

        {!isLoading && book && <BookDetailCard initialBook={book} />}
      </div>
    </AppLayout>
  );
}
