import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { createServerClient } from "@/lib/supabase/server";

interface PlannedTask {
  title: string;
  description: string;
  owner_role: string;
  deadline_offset_days: number;
  priority: "low" | "medium" | "high" | "critical";
  depends_on_index: number | null;
}

interface PlanOutput {
  event_name: string;
  tasks: PlannedTask[];
}

export async function POST(req: Request) {
  try {
    const { description, event_date } = await req.json();

    if (!description || !event_date) {
      return NextResponse.json(
        { error: "Event description and event date are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch members for role context
    const { data: members } = await supabase
      .from("members")
      .select("id, name, role, skills")
      .eq("event_id", DEMO_EVENT_ID);

    const rolesAvailable = [...new Set((members || []).map((m) => m.role))].join(", ");

    const eventDate = new Date(event_date);
    const todayISO = new Date().toISOString();

    const prompt = `You are an AI Event Planner for a college club operations platform.
Current Date: ${todayISO}
Target Event Date: ${eventDate.toISOString()} (${eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })})

Team roles available: ${rolesAvailable || "General volunteers"}

The user wants to plan the following event:
"${description}"

Generate a comprehensive task plan with deadlines counted BACKWARDS from the event date. Each task should have:
- title: clear, actionable task title
- description: 1-2 sentence explanation
- owner_role: which team role should handle this (e.g., "Logistics", "Marketing", "Lead")
- deadline_offset_days: number of days BEFORE the event date (e.g., 7 means the task is due 7 days before the event)
- priority: low | medium | high | critical
- depends_on_index: 0-based index of the task this depends on, or null if independent

Include 10-18 tasks covering: venue, marketing, registration, content/speakers, logistics, tech setup, rehearsal, and day-of coordination.

Return valid JSON:
{
  "event_name": "Name for the event",
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "owner_role": "string",
      "deadline_offset_days": number,
      "priority": "low|medium|high|critical",
      "depends_on_index": number | null
    }
  ]
}`;

    const plan = await generateJSON<PlanOutput>({
      tier: "flash",
      prompt,
      systemInstruction:
        "You are an expert event planner for college clubs. Generate realistic, actionable task plans with proper dependencies and deadlines.",
    });

    // Convert deadline_offset_days to real ISO dates
    const tasksWithDates = (plan.tasks || []).map((t) => {
      const deadline = new Date(eventDate);
      deadline.setDate(deadline.getDate() - (t.deadline_offset_days || 0));
      return {
        ...t,
        deadline_iso: deadline.toISOString(),
      };
    });

    return NextResponse.json({
      event_name: plan.event_name || "Planned Event",
      tasks: tasksWithDates,
      members: members || [],
    });
  } catch (err: unknown) {
    console.error("Error in /api/plan:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate plan" },
      { status: 500 }
    );
  }
}
