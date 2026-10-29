'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookFilterBar } from '@/components/books/BookFilterBar';
import { BookList } from '@/components/books/BookList';
import { fetchBooks } from '@/lib/books';
import { Book, BookStatus } from '@/types/book';
import { useAuth } from '@/components/auth/AuthProvider';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';

function BooksCatalogContent() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get('status') as BookStatus | null;

  const { isConfigured } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookStatus | 'All'>(
    initialStatusParam && ['Available', 'Issued', 'Returned'].includes(initialStatusParam)
      ? initialStatusParam
      : 'All'
  );
  const [category, setCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title' | 'createdAt'>('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const loadBooks = useCallback(async () => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { books: fetched, error } = await fetchBooks({
      search,
      status,
      category,
      sortBy,
    });

    if (error) {
      setErrorMessage(error);
    } else {
      setBooks(fetched);
    }
    setIsLoading(false);
  }, [search, status, category, sortBy, isConfigured]);

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      loadBooks();
    }, 200);

    return () => clearTimeout(timer);
  }, [loadBooks]);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('All');
    setCategory('All');
    setSortBy('createdAt');
  };

  const hasActiveFilters =
    Boolean(search) || status !== 'All' || category !== 'All' || sortBy !== 'createdAt';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Book Catalog & Inventory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Search, filter, track circulation, and manage all library volumes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadBooks()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 shadow-xs transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/books/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Book</span>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <BookFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={books.length}
      />

      {/* Book Catalog List (Grid / Table) */}
      <BookList
        books={books}
        viewMode={viewMode}
        isLoading={isLoading}
        onRefresh={loadBooks}
      />
    </div>
  );
}

export default function BooksPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Loading catalog...</div>}>
        <BooksCatalogContent />
      </Suspense>
    </AppLayout>
  );
}

