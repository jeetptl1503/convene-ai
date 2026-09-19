import { createClient } from "@supabase/supabase-js";
import { createMockSupabaseClient } from "./mock-client";

/**
 * Supabase client for use in server components, API routes, and server actions.
 * Automatically falls back to mock client when placeholder credentials are set.
 */
export function createServerClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  const isPlaceholder =
    !supabaseUrl ||
    supabaseUrl.includes("placeholder") ||
    !serviceRoleKey ||
    serviceRoleKey.includes("placeholder");

  if (isPlaceholder) {
    return createMockSupabaseClient() as unknown as ReturnType<typeof createClient>;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
