import { NextResponse } from "next/server";
import { generateJSON, AI_ERROR_FRIENDLY_MESSAGE } from "@/lib/ai";
import { createServerClient } from "@/lib/supabase/server";
import { DEMO_EVENT_ID } from "@/lib/constants";
import type { Task, Member, Risk, RiskSeverity } from "@/types/database";

interface DetectedIssue {
  type: "overdue" | "unassigned_soon" | "dependency_blocked" | "overloaded_volunteer";
  task_id?: string;
  task_title?: string;
  deadline?: string | null;
  owner_name?: string | null;
  dependency_title?: string | null;
  volunteer_name?: string;
  open_task_count?: number;
}

interface GeminiRiskOutput {
  risks: {
    task_id: string | null;
    severity: RiskSeverity;
    title: string;
    explanation: string;
    suggestion: string;
  }[];
}

export async function POST() {
  try {
    const supabase = createServerClient();

    // 1. Fetch tasks, members, and existing risks
    const [tasksRes, membersRes, risksRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("event_id", DEMO_EVENT_ID),
      supabase.from("members").select("*").eq("event_id", DEMO_EVENT_ID),
      supabase.from("risks").select("*").eq("event_id", DEMO_EVENT_ID).eq("resolved", false),
    ]);

    if (tasksRes.error) throw tasksRes.error;
    if (membersRes.error) throw membersRes.error;
    if (risksRes.error) throw risksRes.error;

    const tasks: Task[] = tasksRes.data || [];
    const members: Member[] = membersRes.data || [];
    const existingRisks: Risk[] = risksRes.data || [];

    const memberMap = new Map<string, Member>();
    members.forEach((m) => memberMap.set(m.id, m));

    const taskMap = new Map<string, Task>();
    tasks.forEach((t) => taskMap.set(t.id, t));

    const now = new Date();
    const nowMs = now.getTime();
    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

    const detectedIssues: DetectedIssue[] = [];

    // A) Detect Overdue Tasks
    for (const t of tasks) {
      if (t.status !== "done" && t.deadline) {
        const dDate = new Date(t.deadline);
        if (dDate.getTime() < nowMs) {
          const owner = t.owner_id ? memberMap.get(t.owner_id) : null;
          detectedIssues.push({
            type: "overdue",
            task_id: t.id,
            task_title: t.title,
            deadline: t.deadline,
            owner_name: owner ? owner.name : "Unassigned",
          });
        }
      }
    }

    // B) Detect Tasks due within 48h with no owner
    for (const t of tasks) {
      if (t.status !== "done" && !t.owner_id && t.deadline) {
        const dDate = new Date(t.deadline);
        const diff = dDate.getTime() - nowMs;
        if (diff > 0 && diff <= FORTY_EIGHT_HOURS_MS) {
          detectedIssues.push({
            type: "unassigned_soon",
            task_id: t.id,
            task_title: t.title,
            deadline: t.deadline,
          });
        }
      }
    }

    // C) Detect Tasks blocked by an unfinished dependency
    for (const t of tasks) {
      if (t.status !== "done" && t.depends_on) {
        const dep = taskMap.get(t.depends_on);
        if (dep && dep.status !== "done") {
          detectedIssues.push({
            type: "dependency_blocked",
            task_id: t.id,
            task_title: t.title,
            dependency_title: dep.title,
          });
        }
      }
    }

    // D) Detect Overloaded Volunteers (> 4 open tasks)
    const openTasksPerMember = new Map<string, number>();
    for (const t of tasks) {
      if (t.status !== "done" && t.owner_id) {
        openTasksPerMember.set(
          t.owner_id,
          (openTasksPerMember.get(t.owner_id) || 0) + 1
        );
      }
    }

    for (const [memberId, count] of openTasksPerMember.entries()) {
      if (count > 4) {
        const m = memberMap.get(memberId);
        if (m) {
          detectedIssues.push({
            type: "overloaded_volunteer",
            volunteer_name: m.name,
            open_task_count: count,
          });
        }
      }
    }

    if (detectedIssues.length === 0) {
      return NextResponse.json({
        message: "No operational risks detected. Event on track.",
        detected_count: 0,
        new_risks_count: 0,
        risks: existingRisks,
      });
    }

    // 2. Send detected findings to Gemini for explanation and concrete fixes
    const prompt = `You are the Risk Management Engine for an AI Club Operations platform.
Current Time: ${now.toISOString()}

Our automated scanner detected the following operational issues in our event:
${JSON.stringify(detectedIssues, null, 2)}

For each detected issue, provide:
1. severity: ("critical" | "high" | "medium" | "low")
2. title: A concise, alarming yet professional risk title (e.g., "Overdue: Venue Security Clearance", "Bottleneck: Priya Sharma Overloaded")
3. explanation: 1-2 plain-language sentences explaining the direct risk to the event (delays, financial loss, team burnout, attendee dissatisfaction).
4. suggestion: 1-2 concrete, realistic immediate action steps to mitigate or fix the risk.
5. task_id: the exact task_id from the issue (or null for overloaded volunteer).

Return valid JSON adhering to:
{
  "risks": [
    {
      "task_id": "string or null",
      "severity": "critical | high | medium | low",
      "title": "string",
      "explanation": "string",
      "suggestion": "string"
    }
  ]
}`;

    const aiOutput = await generateJSON<GeminiRiskOutput>({
      tier: "flash",
      prompt,
      systemInstruction:
        "You analyze raw operational bottlenecks and output high-impact risk explanations and actionable fixes for event organizers.",
    });

    const candidateRisks = aiOutput.risks || [];

    // 3. Deduplicate against existing open risks
    const risksToInsert: {
      event_id: string;
      task_id: string | null;
      severity: RiskSeverity;
      title: string;
      explanation: string;
      suggestion: string;
      resolved: boolean;
    }[] = [];

    for (const candidate of candidateRisks) {
      const isDuplicate = existingRisks.some((existing) => {
        if (candidate.task_id && existing.task_id === candidate.task_id) {
          return true;
        }
        return (
          existing.title.trim().toLowerCase() ===
          candidate.title.trim().toLowerCase()
        );
      });

      if (!isDuplicate) {
        risksToInsert.push({
          event_id: DEMO_EVENT_ID,
          task_id: candidate.task_id || null,
          severity: ["low", "medium", "high", "critical"].includes(candidate.severity)
            ? candidate.severity
            : "medium",
          title: candidate.title,
          explanation: candidate.explanation,
          suggestion: candidate.suggestion,
          resolved: false,
        });
      }
    }

    // 4. Insert new risks into Supabase
    if (risksToInsert.length > 0) {
      const { error: insertErr } = await supabase.from("risks").insert(risksToInsert);
      if (insertErr) throw insertErr;

      // Log activity
      await supabase.from("activity_log").insert({
        event_id: DEMO_EVENT_ID,
        action: "Risk Scan Completed",
        details: `Identified ${risksToInsert.length} new operational risks using AI engine`,
      });
    }

    // Fetch updated open risks
    const { data: updatedRisks } = await supabase
      .from("risks")
      .select("*, task:tasks(id, title, status)")
      .eq("event_id", DEMO_EVENT_ID)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      message: `Risk scan completed. ${risksToInsert.length} new risks recorded.`,
      detected_count: detectedIssues.length,
      new_risks_count: risksToInsert.length,
      risks: updatedRisks || [],
    });
  } catch (err: unknown) {
    console.error("Error in /api/risks/scan:", err);
    return NextResponse.json(
      { error: AI_ERROR_FRIENDLY_MESSAGE },
      { status: 500 }
    );
  }
}
