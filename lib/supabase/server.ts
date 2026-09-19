import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for use in server components, API routes, and server actions.
 * Uses the service-role key – NEVER expose to the browser.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
