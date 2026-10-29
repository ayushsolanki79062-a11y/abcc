// Helper to check whether valid Supabase environment variables are present

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url === 'your_supabase_project_url' || anonKey === 'your_supabase_publishable_or_anon_key') {
    return false;
  }
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getSupabaseEnv() {
  // When credentials are missing or still set to the placeholder values, fall
  // back to a syntactically valid project URL so that creating a Supabase
  // client never throws. UI surfaces a setup banner in that case instead.
  if (!isSupabaseConfigured()) {
    return {
      url: 'https://placeholder-project.supabase.co',
      anonKey: 'placeholder-anon-key',
      configured: false,
    };
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    configured: true,
  };
}

