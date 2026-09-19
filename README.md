# Convene AI

> AI-powered event operations platform for college clubs — built for the **ClubOps AI** hackathon track.

Manage tasks, volunteers, meetings, deadlines, documents, risks, and announcements with an AI copilot that takes real actions.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (Postgres + pgvector)
- **AI:** Google Gemini API via `@google/genai`

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

| Variable                        | Where to find it                          |
| ------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Settings → API → Project URL   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase → Settings → API → service_role  |
| `GEMINI_API_KEY`                | Google AI Studio → Get API key            |

### 3. Create the database tables

Open your Supabase project's **SQL Editor** and run:

1. `supabase/schema.sql` — creates all tables and enables pgvector
2. `supabase/seed.sql` — inserts demo data (1 event, 8 volunteers, 12 tasks)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the Dashboard.

## Project Structure

```
app/
  (app)/              # Route group with sidebar layout
    dashboard/        # Event overview
    tasks/            # Task management
    volunteers/       # Volunteer management
    meetings/         # Meeting notes & summaries
    documents/        # Document store & RAG search
    announcements/    # Draft & publish announcements
    risks/            # AI risk detection
  components/         # Shared UI components
  api/                # Server-side API routes (AI calls)
lib/
  ai.ts               # Gemini helper with 429 retry
  supabase/           # Supabase client helpers
supabase/
  schema.sql          # Database schema
  seed.sql            # Demo seed data
```

## License

MIT
