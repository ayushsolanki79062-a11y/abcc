'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ShieldCheck,
  Clock,
  Search,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-100 dark:border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                LibFlow
              </span>
              <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">
                Library Management System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 py-20 sm:py-28 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 mb-8">
            <GraduationCap className="h-3.5 w-3.5 text-slate-800 dark:text-zinc-200" />
            <span>Designed for College Students, Faculty & Librarians</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            Seamless Book & Circulation Management with <span className="underline decoration-zinc-300 dark:decoration-zinc-700 decoration-4">LibFlow</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Organize personal academic catalogs, track borrowed volumes, monitor upcoming due dates, and analyze reading history — backed by Supabase PostgreSQL and Row-Level Security.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
            >
              <span>{user ? 'Enter Your Dashboard' : 'Open Academic Catalog'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <Search className="h-4 w-4 text-zinc-400" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Built for Precision and Scholarly Workflow
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Everything required to maintain institutional and research libraries with zero friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-800 dark:text-zinc-200 mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Due-Date Deadlines & Overdue Alerts
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Automatic countdowns for issued books, urgent overdue banners, and one-click return logging to keep library circulation on schedule.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-800 dark:text-zinc-200 mb-4">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Granular Filtering & Instant Search
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Instant multi-column search across Title, Author, and ISBN with category filters, status chips, and deadline sorting.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-800 dark:text-zinc-200 mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Row Level Security (RLS)
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Every user’s library catalog is protected at the PostgreSQL database level using Supabase Auth and isolated RLS policies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800/80 py-6 px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>LibFlow Library & Book Management System • Powered by Next.js & Supabase PostgreSQL</p>
      </footer>
    </div>
  );
}
