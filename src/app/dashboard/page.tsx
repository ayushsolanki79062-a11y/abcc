'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { OverdueAlertBanner } from '@/components/dashboard/OverdueAlertBanner';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { BorrowingProgressChart } from '@/components/dashboard/BorrowingProgressChart';
import { fetchDashboardStats } from '@/lib/books';
import { DashboardStats } from '@/types/book';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  BookmarkCheck,
  CheckCircle,
  AlertTriangle,
  Library,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isConfigured } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    borrowedBooks: 0,
    returnedBooks: 0,
    overdueBooks: 0,
    availableBooks: 0,
    upcomingDeadlines: [],
    monthlyBorrowingStats: [],
  });
  const [loading, setLoading] = useState(isConfigured);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    if (!isConfigured) return;
    const { stats: fetchedStats } = await fetchDashboardStats();
    setStats(fetchedStats);
    setLoading(false);
  }, [isConfigured]);

  useEffect(() => {
    if (!isConfigured) return;

    let cancelled = false;
    fetchDashboardStats().then(({ stats: fetchedStats }) => {
      if (cancelled) return;
      setStats(fetchedStats);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isConfigured]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Scholar';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Here is your library collection overview and circulation status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 shadow-xs transition-colors"
              title="Refresh statistics"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
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

        {/* Overdue Notification Banner */}
        <OverdueAlertBanner overdueCount={stats.overdueBooks} />

        {/* Stats Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Collection"
            value={loading ? '—' : stats.totalBooks}
            subtitle="Books in catalog"
            icon={Library}
            variant="default"
          />

          <StatsCard
            title="Currently Issued"
            value={loading ? '—' : stats.borrowedBooks}
            subtitle="Volumes on loan"
            icon={BookmarkCheck}
            variant="amber"
          />

          <StatsCard
            title="Overdue Items"
            value={loading ? '—' : stats.overdueBooks}
            subtitle={stats.overdueBooks > 0 ? 'Requires action' : 'All returns on time'}
            icon={AlertTriangle}
            variant={stats.overdueBooks > 0 ? 'rose' : 'slate'}
          />

          <StatsCard
            title="Returned Books"
            value={loading ? '—' : stats.returnedBooks}
            subtitle="Circulation completed"
            icon={CheckCircle}
            variant="emerald"
          />
        </div>

        {/* Detailed Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Return Deadlines */}
          <UpcomingDeadlines deadlines={stats.upcomingDeadlines} />

          {/* Monthly Borrowing Activity Chart */}
          <BorrowingProgressChart stats={stats.monthlyBorrowingStats} />
        </div>

        {/* Quick Actions / Catalog Direct Access */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Manage Entire Book Inventory
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Search by ISBN, filter by genre, check status, or export details.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <span>Open Catalog Grid</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

