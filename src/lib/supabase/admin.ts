import { createClient } from '@supabase/supabase-js';

// Service-role client. SUPABASE_SERVICE_ROLE_KEY bypasses Row Level Security
// entirely — this file must only ever be imported from server-only code
// (Server Actions, Route Handlers, scripts). Never import this from a
// Client Component or anything bundled to the browser.
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
