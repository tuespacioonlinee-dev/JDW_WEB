import { createClient } from '@supabase/supabase-js';

// SERVICE ROLE CLIENT — server only, never import in components or client code
// This bypasses RLS. Use only in API routes and server actions.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase admin credentials');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
