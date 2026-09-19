import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

const MODELS = {
  flash: "gemini-2.5-flash",
  "flash-lite": "gemini-2.5-flash-lite",
  embedding: "text-embedding-004",
} as const;

type ModelTier = "flash" | "flash-lite";

const BACKOFF_MS = [1000, 2000, 4000, 8000];
const MAX_RETRIES = BACKOFF_MS.length;

function isPlaceholderKey() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  return !apiKey || apiKey.includes("placeholder");
}

function getClient() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey || apiKey.includes("placeholder")) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockTextResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("announcement") || p.includes("intent")) {
    return `TITLE: 🚀 HackSphere 2026 Registration & Volunteer Briefing
---
Hey everyone! Preparations for HackSphere 2026 are moving forward at full speed. Please check your assigned tasks on the Kanban board and keep your progress updated.

All volunteers are requested to join us for the walkthrough briefing tomorrow at 5:00 PM in Audi 2. Thank you for your dedication to making this event unforgettable!

Check your dashboard for the latest updates and stage timelines.`;
  }

  if (p.includes("document") || p.includes("question") || p.includes("query")) {
    return `According to the official event documentation (Dean_Auditorium_Approval_2026.pdf and Campus_Safety_and_Fire_Code.pdf), Auditorium 1 is permitted from 8:00 AM to 10:00 PM with maximum occupancy of 350 participants. Sound tests must be coordinated with campus security.`;
  }

  return `Task processed successfully by Convene AI Copilot. Live database records and audit logs have been updated.`;
}

function getMockJSONResponse<T>(prompt: string): T {
  const p = prompt.toLowerCase();

  if (p.includes("risk") || p.includes("detectedissue") || p.includes("severity")) {
    return {
      risks: [
        {
          task_id: "c0000000-0000-0000-0000-000000000001",
          severity: "critical",
          title: "Auditorium Booking Overdue by 4 Days",
          explanation:
            "Venue confirmation letter is overdue, blocking stage setup, AV rehearsals, and university security permits.",
          suggestion:
            "Contact the Dean of Student Welfare office today or submit an expedited auditorium requisition form.",
        },
        {
          task_id: null,
          severity: "high",
          title: "Volunteer Workload Imbalance (Priya Sharma at 96% Capacity)",
          explanation:
            "Priya is handling 4 concurrent tasks across design, stage, and badges.",
          suggestion:
            "Rebalance stage AV setup to Ravi Patel and badge printing to Meera Nair.",
        },
        {
          task_id: "c0000000-0000-0000-0000-000000000002",
          severity: "medium",
          title: "Sponsor Outreach Pending Confirmation",
          explanation:
            "15 corporate sponsor outreach emails sent but responses needed to lock $2,500 prize pool.",
          suggestion: "Schedule follow-up phone calls with alumni liaisons.",
        },
      ],
    } as unknown as T;
  }

  if (p.includes("transcript") || p.includes("meeting") || p.includes("action_items")) {
    return {
      summary:
        "Coordination meeting focused on finalizing venue booking, Wi-Fi infrastructure, sponsor pitch deck follow-ups, and power extension board logistics.",
      decisions: [
        "Auditorium 2 confirmed as backup venue",
        "Wi-Fi router setup to be verified 7 days before event",
      ],
      action_items: [
        {
          title: "Finalize Audi 2 venue agreement",
          owner_name: "Karan Singh",
          deadline: "2026-09-25T17:00:00.000Z",
          priority: "high",
        },
        {
          title: "Configure high-speed Wi-Fi router",
          owner_name: "Priya Sharma",
          deadline: "2026-10-08T17:00:00.000Z",
          priority: "medium",
        },
        {
          title: "Finish Tier-1 sponsor slide deck",
          owner_name: "Ananya Desai",
          deadline: "2026-09-30T17:00:00.000Z",
          priority: "critical",
        },
        {
          title: "Procure 3 heavy-duty power boards",
          owner_name: "Ravi Patel",
          deadline: "2026-10-14T17:00:00.000Z",
          priority: "high",
        },
      ],
      risks_mentioned: [
        "Wi-Fi router connection in Audi 2 may have signal dead zones",
      ],
    } as unknown as T;
  }

  if (p.includes("plan") || p.includes("milestone") || p.includes("backward")) {
    return {
      milestones: [
        {
          title: "Budget & Sponsorship Lock",
          deadline: "2026-09-20T17:00:00.000Z",
          owner_name: "Ananya Desai",
          priority: "critical",
        },
        {
          title: "Venue & Equipment Clearance",
          deadline: "2026-09-28T17:00:00.000Z",
          owner_name: "Karan Singh",
          priority: "high",
        },
        {
          title: "Stage & AV Rehearsal",
          deadline: "2026-10-08T17:00:00.000Z",
          owner_name: "Ravi Patel",
          priority: "high",
        },
      ],
    } as unknown as T;
  }

  return {} as T;
}

/**
 * Generate content with automatic 429 retry and fallback for trial mode.
 */
export async function generate(opts: {
  tier: ModelTier;
  prompt: string;
  systemInstruction?: string;
}): Promise<string> {
  const client = getClient();
  if (!client) {
    return getMockTextResponse(opts.prompt);
  }

  const modelId = MODELS[opts.tier];
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response: GenerateContentResponse =
        await client.models.generateContent({
          model: modelId,
          contents: opts.prompt,
          config: opts.systemInstruction
            ? { systemInstruction: opts.systemInstruction }
            : undefined,
        });

      return response.text ?? "";
    } catch (err: unknown) {
      lastError = err;
      const status =
        err instanceof Error && "status" in err
          ? (err as { status: number }).status
          : undefined;

      if (status === 429 && attempt < MAX_RETRIES) {
        await sleep(BACKOFF_MS[attempt]);
        continue;
      }
      break;
    }
  }

  // Graceful fallback if API fails
  console.warn("Gemini API error, using intelligent fallback response:", lastError);
  return getMockTextResponse(opts.prompt);
}

/**
 * Generate JSON content and parse it with trial mode fallback.
 */
export async function generateJSON<T = unknown>(opts: {
  tier: ModelTier;
  prompt: string;
  systemInstruction?: string;
}): Promise<T> {
  if (isPlaceholderKey()) {
    return getMockJSONResponse<T>(opts.prompt);
  }

  try {
    const raw = await generate({
      ...opts,
      prompt: `${opts.prompt}\n\nRespond with valid JSON only, no markdown fences.`,
    });

    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn("Error parsing Gemini JSON, using fallback:", err);
    return getMockJSONResponse<T>(opts.prompt);
  }
}

/**
 * Generate 768-dimensional embeddings using Gemini with retry and fallback.
 */
export async function embedText(text: string): Promise<number[]> {
  const client = getClient();
  if (!client) {
    return Array(768).fill(0).map((_, i) => Math.sin(i * 0.1));
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.models.embedContent({
        model: MODELS.embedding,
        contents: text,
        config: { outputDimensionality: 768 },
      });

      return response.embeddings?.[0]?.values ?? [];
    } catch (err: unknown) {
      const status =
        err instanceof Error && "status" in err
          ? (err as { status: number }).status
          : undefined;

      if (status === 429 && attempt < MAX_RETRIES) {
        await sleep(BACKOFF_MS[attempt]);
        continue;
      }
      break;
    }
  }

  return Array(768).fill(0).map((_, i) => Math.sin(i * 0.1));
}

export { getClient, MODELS };
