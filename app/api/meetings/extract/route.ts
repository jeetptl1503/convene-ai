import { NextResponse } from "next/server";
import { generateJSON, AI_ERROR_FRIENDLY_MESSAGE } from "@/lib/ai";
import { createServerClient } from "@/lib/supabase/server";
import { DEMO_EVENT_ID } from "@/lib/constants";

interface ExtractedRaw {
  summary: string;
  decisions: string[];
  action_items: {
    title: string;
    owner_name: string | null;
    deadline: string | null;
    priority: "low" | "medium" | "high" | "critical";
  }[];
  risks_mentioned: string[];
}

export async function POST(req: Request) {
  try {
    const { transcript, title } = await req.json();

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript text is required" },
        { status: 400 }
      );
    }

    // Fetch team members from DB to provide context for owner assignment & fuzzy matching
    const supabase = createServerClient();
    const { data: members } = await supabase
      .from("members")
      .select("id, name, role, skills")
      .eq("event_id", DEMO_EVENT_ID);

    const membersList = (members || []).map((m) => `${m.name} (${m.role})`).join(", ");

    const todayISO = new Date().toISOString();
    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `You are an AI Event Operations Assistant for a college club organizing an event.
Current Date: ${todayStr} (${todayISO}).

Club team members:
${membersList || "No members listed yet"}

Analyze the following raw meeting transcript:
Meeting Title: "${title || "Club Coordination Meeting"}"

Transcript:
"""
${transcript}
"""

Extract the following in strictly valid JSON format matching this schema:
{
  "summary": "A clear, concise paragraph summarizing what was discussed and agreed on",
  "decisions": ["List of key decisions made in the meeting"],
  "action_items": [
    {
      "title": "Clear, actionable task title",
      "owner_name": "Name of the person assigned, or null if unassigned/vague",
      "deadline": "ISO 8601 string (e.g. 2026-09-25T17:00:00.000Z) calculated from relative dates mentioned like 'next Friday', 'tomorrow', 'by 5pm Monday', or null if not mentioned",
      "priority": "low | medium | high | critical"
    }
  ],
  "risks_mentioned": ["Any bottlenecks, delays, resource shortages, or risks mentioned"]
}

Important:
- If a person is mentioned by first name (e.g., 'Priya', 'Karan'), match their name to the team members list if possible.
- Convert relative dates into concrete ISO 8601 timestamps relative to Current Date (${todayStr}).
- If priority is not stated, infer it reasonably based on urgency and impact.`;

    const extracted = await generateJSON<ExtractedRaw>({
      tier: "flash",
      prompt,
      systemInstruction:
        "You are an expert event operations AI that extracts structured action items, deadlines, and risks from messy club meeting notes and transcripts.",
    });

    // Fuzzy-match extracted owner_name to existing member IDs
    const matchedActionItems = (extracted.action_items || []).map((item) => {
      let matchedMemberId: string | null = null;
      let resolvedOwnerName = item.owner_name;

      if (item.owner_name && members && members.length > 0) {
        const cleanedName = item.owner_name.trim().toLowerCase();

        // 1. Exact match
        const exact = members.find((m) => m.name.toLowerCase() === cleanedName);
        if (exact) {
          matchedMemberId = exact.id;
          resolvedOwnerName = exact.name;
        } else {
          // 2. Partial / first name match
          const partial = members.find(
            (m) =>
              m.name.toLowerCase().includes(cleanedName) ||
              cleanedName.includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().split(" ")[0] === cleanedName
          );
          if (partial) {
            matchedMemberId = partial.id;
            resolvedOwnerName = partial.name;
          }
        }
      }

      return {
        ...item,
        owner_id: matchedMemberId,
        owner_name: resolvedOwnerName,
        priority: ["low", "medium", "high", "critical"].includes(item.priority)
          ? item.priority
          : "medium",
      };
    });

    return NextResponse.json({
      summary: extracted.summary || "Meeting summary not generated.",
      decisions: extracted.decisions || [],
      action_items: matchedActionItems,
      risks_mentioned: extracted.risks_mentioned || [],
    });
  } catch (err: unknown) {
    console.error("Error in /api/meetings/extract:", err);
    return NextResponse.json(
      { error: AI_ERROR_FRIENDLY_MESSAGE },
      { status: 500 }
    );
  }
}
