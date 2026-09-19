import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for use in server components, API routes, and server actions.
 * Uses the service-role key – NEVER expose to the browser.
 */
export function createServerClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  return createClient(supabaseUrl, serviceRoleKey);
}
