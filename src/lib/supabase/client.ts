import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';
import { getSupabaseEnv } from './config';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (client) return client;

  const { url, anonKey } = getSupabaseEnv();
  client = createBrowserClient<Database>(url, anonKey);
  return client;
}

