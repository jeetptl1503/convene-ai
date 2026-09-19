import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

/**
 * Shared Gemini AI helper.
 *
 * – Retries on 429 (rate-limit) with exponential back-off: 1 s → 2 s → 4 s → 8 s.
 * – Two model tiers:
 *     "flash"      → gemini-2.5-flash-preview-05-20  (agent / extraction)
 *     "flash-lite" → gemini-2.5-flash-lite-preview-06-17 (simple steps)
 */

const MODELS = {
  flash: "gemini-2.5-flash-preview-05-20",
  "flash-lite": "gemini-2.5-flash-lite-preview-06-17",
} as const;

type ModelTier = keyof typeof MODELS;

const BACKOFF_MS = [1000, 2000, 4000, 8000];
const MAX_RETRIES = BACKOFF_MS.length;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate content with automatic 429 retry.
 */
export async function generate(opts: {
  tier: ModelTier;
  prompt: string;
  systemInstruction?: string;
}): Promise<string> {
  const client = getClient();
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
      throw err;
    }
  }

  throw lastError;
}

/**
 * Generate JSON content and parse it.
 */
export async function generateJSON<T = unknown>(opts: {
  tier: ModelTier;
  prompt: string;
  systemInstruction?: string;
}): Promise<T> {
  const raw = await generate({
    ...opts,
    prompt: `${opts.prompt}\n\nRespond with valid JSON only, no markdown fences.`,
  });

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");
  return JSON.parse(cleaned) as T;
}
