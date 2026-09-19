# Convene AI

> AI-powered event operations platform for college clubs — built for the **ClubOps AI** hackathon track.

Manage tasks, volunteers, meetings, deadlines, documents, risks, and announcements with an AI copilot that takes **real actions** — not just text generation.

## ✨ Key Features

| Feature | AI-Powered | Description |
|---------|:----------:|-------------|
| **Task Board** | | Kanban board with drag-drop, priorities, deadlines, and owner assignment |
| **AI Planner** | ✅ | Generate full task plans backwards from event date with dependencies |
| **Volunteer Mgmt** | | CRUD, workload monitoring, skill tracking |
| **Meeting Extractor** | ✅ | Paste raw meeting notes → AI extracts action items, deadlines, owners |
| **Risk Scanner** | ✅ | Scans overdue tasks, resource gaps; Gemini explains impact & mitigation |
| **Documents & RAG** | ✅ | Upload event docs → chunk & embed → semantic search with citations |
| **Announcements** | ✅ | AI-drafts context-aware announcements (pulls current deadlines/tasks) |
| **AI Copilot Agent** | ✅ | Floating chat with 10+ function-calling tools to take real actions |

### Agent Tools

The AI copilot can autonomously:
- Create, update, and assign tasks
- Add volunteers and check workloads
- Schedule and summarize meetings
- Search the document knowledge base (RAG)
- Run risk scans and explain findings
- Query the dashboard for stats

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (Postgres + pgvector)
- **AI:** Google Gemini API via `@google/genai`
  - `gemini-3.6-flash` — Agent reasoning, meeting extraction, planning
  - `gemini-3.5-flash-lite` — Simple generation tasks
  - `gemini-embedding-001` — 768-dim embeddings for RAG

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

Open your Supabase project's **SQL Editor** and run these files in order:

1. `supabase/schema.sql` — creates all tables and enables pgvector
2. `supabase/seed.sql` — inserts demo data (1 event, 8 volunteers, 12 tasks)
3. `supabase/rag.sql` — creates the vector similarity search function for RAG

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the Dashboard.

## Project Structure

```
app/
  (app)/              # Route group with sidebar layout
    dashboard/        # Event overview + AI Planner modal
    tasks/            # Kanban task management
    volunteers/       # Volunteer CRUD & workload
    meetings/         # Meeting notes & AI extraction
    documents/        # Document upload, RAG search
    announcements/    # AI-drafted announcements
    risks/            # AI risk detection
  components/         # Shared UI (sidebar, agent chat, modals)
  api/                # Server-side API routes
    agent/            # Function-calling AI agent
    plan/             # AI task plan generation
    meetings/extract/ # Meeting notes → action items
    risks/scan/       # Risk scanner with AI explanation
    documents/        # Upload + RAG ask endpoints
    announcements/    # Context-aware draft generation
lib/
  ai.ts               # Gemini helper with 429 retry + embeddings
  chunking.ts         # Text chunking utility for RAG
  activity.ts         # Activity logging
  supabase/           # Supabase client helpers
supabase/
  schema.sql          # Database schema
  seed.sql            # Demo seed data
  rag.sql             # Vector search function
```

## License

MIT
