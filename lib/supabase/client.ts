import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

/**
 * Supabase client for use in browser / client components.
 * Uses the public anon key – safe to expose.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
