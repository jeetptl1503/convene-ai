import { NextResponse } from "next/server";
import { generate } from "@/lib/ai";
import { createServerClient } from "@/lib/supabase/server";
import { DEMO_EVENT_ID } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { intent, audience, tone } = await req.json();

    if (!intent) {
      return NextResponse.json(
        { error: "Announcement intent is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch current tasks and deadlines for context
    const { data: tasks } = await supabase
      .from("tasks")
      .select("title, status, deadline, priority")
      .eq("event_id", DEMO_EVENT_ID)
      .neq("status", "done")
      .order("deadline", { ascending: true })
      .limit(10);

    const taskContext = (tasks || [])
      .map(
        (t) =>
          `- ${t.title} (${t.priority}, due ${
            t.deadline
              ? new Date(t.deadline).toLocaleDateString()
              : "no deadline"
          })`
      )
      .join("\n");

    const prompt = `You are a communications specialist for a college club organizing an event.

Current active tasks and upcoming deadlines:
${taskContext || "No active tasks"}

Write an announcement based on the following:
Intent: ${intent}
Audience: ${audience || "All participants and volunteers"}
Tone: ${tone || "Professional yet friendly"}

Write a clear, engaging announcement with:
1. A catchy subject line / title
2. A well-structured body (2-4 paragraphs)
3. Include relevant deadlines or action items if appropriate
4. End with a clear call-to-action

Format as:
TITLE: [subject line]
---
[announcement body]`;

    const raw = await generate({
      tier: "flash",
      prompt,
      systemInstruction:
        "You write engaging, professional announcements for college event operations. Be concise and action-oriented.",
    });

    // Parse title and body
    const parts = raw.split("---");
    let title = "Announcement";
    let body = raw;

    if (parts.length >= 2) {
      const titleLine = parts[0].trim();
      title = titleLine.replace(/^TITLE:\s*/i, "").trim();
      body = parts.slice(1).join("---").trim();
    }

    return NextResponse.json({ title, body });
  } catch (err: unknown) {
    console.error("Error in /api/announcements/draft:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to draft announcement" },
      { status: 500 }
    );
  }
}
