import { createClient } from "@supabase/supabase-js";
import { createMockSupabaseClient } from "./mock-client";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

const isPlaceholder =
  !supabaseUrl ||
  supabaseUrl.includes("placeholder") ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes("placeholder");

/**
 * Supabase client for use in browser / client components.
 * Automatically uses the persistent in-browser mock database when credentials
 * are placeholders or unavailable, ensuring zero crashes on trial runs.
 */
export const supabase = isPlaceholder
  ? (createMockSupabaseClient() as unknown as ReturnType<typeof createClient>)
  : createClient(supabaseUrl, supabaseAnonKey);
