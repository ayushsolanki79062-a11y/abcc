'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookForm } from '@/components/books/BookForm';
import { ArrowLeft, BookPlus } from 'lucide-react';

export default function NewBookPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/books"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BookPlus className="h-6 w-6 text-slate-800 dark:text-zinc-200" />
                Add New Book Entry
              </h1>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 pl-6">
              Catalog a new volume with circulation details, author, category, and due date.
            </p>
          </div>
        </div>

        {/* Book Form */}
        <BookForm />
      </div>
    </AppLayout>
  );
}

