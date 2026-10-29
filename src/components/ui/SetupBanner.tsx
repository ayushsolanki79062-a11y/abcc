'use client';

import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, Key, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function SetupBanner() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const configured = isSupabaseConfigured();

  if (configured) return null;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50/90 dark:border-amber-700/50 dark:bg-amber-950/30 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Supabase Configuration Required
            </h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-amber-700 underline hover:text-amber-800 dark:text-amber-300"
            >
              {expanded ? 'Hide Instructions' : 'View Setup Guide'}
            </button>
          </div>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            LibFlow connects to your real Supabase PostgreSQL database and Auth. To begin using live data and authentication, provide your Supabase credentials in <code className="rounded bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 font-mono text-[11px]">.env.local</code>.
          </p>

          {expanded && (
            <div className="mt-4 space-y-3 rounded-lg border border-amber-200/80 dark:border-amber-800/40 bg-white/80 dark:bg-zinc-900/80 p-4 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Key className="h-4 w-4 text-amber-600" />
                Quick 3-Step Setup:
              </div>
              <ol className="list-decimal space-y-2 pl-4">
                <li>
                  Create a free project at{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    supabase.com <ExternalLink className="h-3 w-3" />
                  </a>.
                </li>
                <li>
                  Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the SQL migration located at{' '}
                  <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 font-mono">
                    supabase/migrations/20261029_create_books_table.sql
                  </code>.
                </li>
                <li>
                  Copy your Project URL and Anon/Public Key from <strong>Project Settings &gt; API</strong> and add them to your{' '}
                  <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 font-mono">.env.local</code>:
                </li>
              </ol>

              <div className="relative mt-2 rounded bg-zinc-900 p-2.5 font-mono text-[11px] text-zinc-100 dark:bg-black">
                <pre>
                  {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
                <button
                  onClick={copyEnvSnippet}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-zinc-700"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

