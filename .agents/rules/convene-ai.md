# Convene-AI Project Rules

## Code Style
- Keep code simple and readable. One folder per feature.
- Never rewrite files unrelated to the current task.

## AI Integration
- All AI calls happen server-side in `/app/api` routes. Never expose API keys to the client.
- Wrap every Gemini call in the shared helper at `lib/ai.ts` that retries on 429 errors with exponential backoff (1s, 2s, 4s, 8s).
- Use **Gemini Flash-Lite** (`gemini-2.5-flash-lite-preview-06-17`) for simple/cheap steps.
- Use **Gemini Flash** (`gemini-2.5-flash-preview-05-20`) for the agent and complex extraction.

## Auth & Scope
- No auth for now: assume one demo club and one demo event.

## UI
- Every page needs loading and error states.
- Modern clean UI with Tailwind CSS only; sidebar layout.
- No component libraries; all styling via Tailwind utility classes.

## Environment
- Stack: Next.js (App Router, TypeScript), Tailwind CSS, Supabase (Postgres, storage, pgvector), Gemini API via `@google/genai`.
- Environment variables go in `.env.local` (never committed). `.env.example` documents the required keys.
- Never invent or hardcode API keys or secrets.
