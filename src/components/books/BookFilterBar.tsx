'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { BOOK_CATEGORIES } from '@/lib/constants';
import { BookStatus } from '@/types/book';

interface BookFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: BookStatus | 'All';
  onStatusChange: (status: BookStatus | 'All') => void;
  category: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'dueDate' | 'title' | 'createdAt';
  onSortChange: (sort: 'dueDate' | 'title' | 'createdAt') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalCount: number;
}

export function BookFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
  totalCount,
}: BookFilterBarProps) {
  const statuses: (BookStatus | 'All')[] = ['All', 'Available', 'Issued', 'Returned'];

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Top Row: Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Title, Author, or ISBN..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-8 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:border-slate-800 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:focus:border-zinc-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {totalCount} {totalCount === 1 ? 'book' : 'books'} found
          </span>

          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => onViewModeChange('table')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Status Tabs, Category Filter, Sort Filter, and Clear */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                status === st
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {st === 'Issued' ? 'Issued / Borrowed' : st}
            </button>
          ))}
        </div>

        {/* Category & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <option value="All">All Categories</option>
            {BOOK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'dueDate' | 'title' | 'createdAt')}
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="createdAt">Date Added (Newest)</option>
              <option value="dueDate">Closest Return Due Date</option>
              <option value="title">Book Title (A-Z)</option>
            </select>
          </div>

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

