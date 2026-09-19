import { supabase } from "./supabase/client";
import { DEMO_EVENT_ID } from "./constants";

export async function logActivity(action: string, details?: string) {
  try {
    await supabase.from("activity_log").insert({
      event_id: DEMO_EVENT_ID,
      action,
      details: details ?? null,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

export async function logActivityServer(
  client: { from: (table: string) => { insert: (row: Record<string, unknown>) => Promise<unknown> } },
  action: string,
  details?: string
) {
  try {
    await client.from("activity_log").insert({
      event_id: DEMO_EVENT_ID,
      action,
      details: details ?? null,
    });
  } catch (err) {
    console.error("Failed to log server activity:", err);
  }
}
