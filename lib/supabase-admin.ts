import { createClient } from '@supabase/supabase-js'

// Service-role admin client — bypasses all RLS policies
// ⚠️  ONLY import this in API routes / server-side code, NEVER in client components
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix so it stays server-only
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
