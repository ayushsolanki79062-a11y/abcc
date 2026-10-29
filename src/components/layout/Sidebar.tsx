'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  PlusCircle,
  Settings,
  LogOut,
  Database,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut, isConfigured } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Book Catalog', href: '/books', icon: Library },
    { name: 'Add New Book', href: '/books/new', icon: PlusCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const userEmail = user?.email || 'Scholar';
  const displayName = user?.user_metadata?.full_name || userEmail.split('@')[0];
  const userInitials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'LF';

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/60 p-4 justify-between h-screen sticky top-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                LibFlow
              </span>
              <span className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Academic Library System
            </p>
          </div>
        </div>

        {/* Database Status Pill */}
        <div className="px-2">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-white/70 px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            <span
              className={`h-2 w-2 rounded-full ${
                isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <div className="flex-1 truncate">
              <div className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                <Database className="h-3 w-3 text-zinc-500" />
                <span>{isConfigured ? 'Supabase Connected' : 'Setup Required'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-inherit' : 'text-zinc-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-800 text-xs dark:bg-zinc-800 dark:text-zinc-200">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {userEmail}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

