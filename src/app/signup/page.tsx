'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { SetupBanner } from '@/components/ui/SetupBanner';
import { BookOpen, Lock, Mail, User, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!configured) {
      setErrorMessage(
        'Supabase is not configured yet. Please configure your project URL and Anon key in .env.local first.'
      );
      return;
    }

    if (!fullName.trim() || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        // Logged in immediately
        router.push('/dashboard');
        router.refresh();
      } else if (data.user) {
        // Confirmation email required by default Supabase setting
        setSuccessInfo(
          'Account created! If confirmation is enabled on your Supabase project, check your email for the activation link, then sign in.'
        );
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              LibFlow
            </span>
          </Link>
        </div>

        <h2 className="mt-6 text-center font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Create your library account
        </h2>
        <p className="mt-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
          For students, faculty, and librarians managing book collections.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <SetupBanner />

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {successInfo && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-start gap-2.5">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Complete!</p>
                <p className="mt-1">{successInfo}</p>
                <div className="mt-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-900 dark:text-emerald-200 underline"
                  >
                    Proceed to Login
                  </Link>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Prof. Evelyn Vance / Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-3 text-sm focus:border-slate-800 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Academic Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="scholar@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-3 text-sm focus:border-slate-800 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-3 text-sm focus:border-slate-800 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-slate-900 underline hover:text-black dark:text-zinc-200 dark:hover:white"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

