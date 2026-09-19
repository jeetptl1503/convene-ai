# Convene AI

> **Autonomous ClubOps & Live Stage Flow Platform for Campus Clubs**  
> *Built for the ClubOps AI Hackathon Track*

Manage tasks, volunteer workloads, meeting transcripts, milestone schedules, knowledge base documents, operational risks, and announcements with an AI copilot that takes **real database actions** — not just generating text.

---

## ⚡ Zero-Config Quick Start (Instant Trial Mode)

Convene AI comes with a **built-in persistent mock database and simulated AI fallback** out of the box. You can test and explore the entire application locally **without configuring Supabase or Gemini API keys**:

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the 3D landing page, toggle dark/light mode, and click **"Sign In"** or **"Enter Dashboard"** to test-drive the full suite.

---

## ✨ Key Features

| Module | AI Powered | Description |
|---|:---:|---|
| **Autonomous Action Copilot** | ✅ | Floating agent powered by Gemini function-calling with 10+ tools to create/assign tasks, inspect workloads, and run risk scans directly in the DB |
| **Backward Milestone Planner** | ✅ | Generate comprehensive event task plans backwards from the event date (D-30 to D-Day) with automatic role allocation and dependency graphs |
| **Kanban Task Board** | | 3-column drag-and-drop workflow (`todo`, `doing`, `done`), priority levels (`low` to `critical`), deadline tracking, and task dependencies (`depends_on`) |
| **Volunteer Capacity Roster** | | Real-time workload capacity monitoring, role/skill tagging, burnout detection, and 1-click task rebalancing |
| **Meeting & Voice Extractor** | ✅ | Paste meeting transcripts or voice memos; extracts decisions, deadlines, risks, and action items with fuzzy team-member name matching |
| **24/7 AI Risk Scanner** | ✅ | Continuously scans for overdue tasks, bottlenecks, and overloaded members; Gemini explains operational impact and recommends mitigations |
| **Document Knowledge Base (RAG)**| ✅ | Upload event guidelines, rules, budgets, and vendor contracts; chunked and embedded via 768-dim vectors for semantic search with citations |
| **Context-Aware Announcements**| ✅ | Drafts targeted club announcements pulling real-time context from current deadlines; formats with WhatsApp markdown and 1-click copy |
| **Interactive 3D Landing Page** | | Futuristic hero scene with interactive 3D robot model, Bento feature grids, Before/After comparisons, and Dark/Light mode theme toggle |

---

### 🤖 Autonomous Copilot Agent Tools

The embedded AI Copilot Agent (`app/api/agent/route.ts`) executes real database mutations via Gemini function-calling:
- `create_task` — Creates actionable tasks with title, description, priority, and deadline
- `assign_task` — Assigns or reassigns tasks to team members using fuzzy name matching
- `update_task_status` — Moves tasks across Kanban columns (`todo`, `doing`, `done`)
- `set_deadline` — Updates task completion deadlines
- `list_tasks` — Queries and filters tasks by status, priority, or volunteer owner
- `add_volunteer` — Registers new volunteers with roles and skill sets
- `create_announcement_draft` — Drafts context-aware broadcast messages
- `run_risk_scan` — Evaluates operational bottlenecks and surfaces mitigations
- `search_documents` — Semantic vector search across club documentation with similarity matching

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router with Turbopack, React 19, TypeScript)
* **Styling & Icons:** Tailwind CSS v4, Lucide React, Framer Motion
* **3D & Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`
* **Database & Auth:** Supabase (PostgreSQL with `pgvector` extension) + In-Memory Mock Database Fallback
* **AI & Embeddings:** Google Gemini API via `@google/genai` with automatic 429 exponential backoff retries:
  * `gemini-3.6-flash` — Agent tool reasoning, meeting extraction, backwards planning, risk analysis
  * `gemini-3.5-flash-lite` — Lightweight generation and formatting
  * `gemini-embedding-001` — 768-dimensional embeddings for pgvector RAG

---

## 🚀 Production Setup (Connecting Supabase & Gemini)

### 1. Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Fill in your project credentials:

| Variable | Source | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) | Project URL (`Settings` → `API`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [Supabase Dashboard](https://supabase.com/dashboard) | Anonymous Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | [Supabase Dashboard](https://supabase.com/dashboard) | Service Role Secret key |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | Gemini API access key |

*(If credentials are not provided, Convene AI automatically uses its persistent mock client with simulated AI responses)*.

### 2. Database Initialization

In your Supabase project's **SQL Editor**, run these files in order:

1. `supabase/schema.sql` — Creates tables (`events`, `members`, `tasks`, `meetings`, `risks`, `announcements`, `documents`, `document_chunks`, `activity_log`) and enables `pgvector`.
2. `supabase/seed.sql` — Populates sample demo event, 8 volunteers, and 12 prioritized tasks.
3. `supabase/rag.sql` — Installs the `match_document_chunks` cosine similarity vector search function.

For a complete walkthrough on Google OAuth configuration and Vercel production deployment, refer to:
* **[CONVENE_AI_DEPLOYMENT_AND_AUTH_GUIDE.md](file:///d:/PROJECTS/convene-ai/CONVENE_AI_DEPLOYMENT_AND_AUTH_GUIDE.md)**
* **[CONVENE_AI_DEPLOYMENT_AND_AUTH_GUIDE.html](file:///d:/PROJECTS/convene-ai/CONVENE_AI_DEPLOYMENT_AND_AUTH_GUIDE.html)**

---

## 📂 Project Structure

```
convene-ai/
├── app/
│   ├── (app)/                       # Authenticated club operations layout
│   │   ├── dashboard/               # Operational overview + Backward Planner modal
│   │   ├── tasks/                   # 3-column Kanban board with dependency links
│   │   ├── volunteers/              # Volunteer roster & workload capacity tracker
│   │   ├── meetings/                # Meeting notes & transcript action item extractor
│   │   ├── documents/               # Document knowledge base + RAG semantic search
│   │   ├── announcements/           # Context-aware announcement drafts
│   │   └── risks/                   # 24/7 AI Risk Scanner radar
│   ├── api/                         # Server-side API routes
│   │   ├── agent/                   # Gemini function-calling autonomous agent
│   │   ├── plan/                    # AI backward milestone planner
│   │   ├── meetings/extract/        # Meeting transcript action item parsing
│   │   ├── risks/scan/              # Overdue & bottleneck risk detection
│   │   ├── documents/               # Document upload + RAG semantic query
│   │   └── announcements/           # Context-aware draft generator
│   ├── signin/                      # Direct sign-in & trial dashboard entry
│   ├── account-creation/            # Multi-step club onboarding workflow
│   ├── globals.css                  # Theme tokens & Tailwind utility configurations
│   ├── layout.tsx                   # Root HTML layout with ThemeProvider
│   └── page.tsx                     # Landing page entry point
├── components/
│   └── landing/                     # Modern landing page components
│       ├── Hero.tsx                 # Hero section with CTA & stats
│       ├── Hero3DScene.tsx          # Interactive Three.js robot canvas
│       ├── BentoFeatures.tsx        # Bento feature showcase grid
│       ├── ShowcaseSection.tsx      # Interactive tabbed module demo preview
│       ├── BeforeAfter.tsx          # Traditional vs Convene AI comparison
│       ├── StageFlowSection.tsx     # Smart Anchor MC & stage management showcase
│       ├── Navbar.tsx               # Navigation bar with dark mode toggle
│       └── ThemeContext.tsx         # Dark/Light mode theme state provider
├── lib/
│   ├── ai.ts                        # Gemini helper with 429 retry + mock AI fallback
│   ├── chunking.ts                  # Document text chunker for vector embeddings
│   ├── mock-data.ts                 # Local mock demo dataset
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client (with mock fallback)
│   │   ├── server.ts                # Server Supabase client (with mock fallback)
│   │   └── mock-client.ts           # Persistent in-memory mock database client
│   └── utils.ts                     # UI styling class merge utilities
├── supabase/
│   ├── schema.sql                   # Relational database schema with pgvector
│   ├── seed.sql                     # Seed data for campus hackathon demo
│   └── rag.sql                      # Vector search SQL function
├── CONVENE_AI_DEPLOYMENT_AND_AUTH_GUIDE.md # Production deployment & OAuth setup guide
├── ROADMAP_FEATURES_TO_BE_ADDED.md         # Stage 2 architectural designs & backlog
└── package.json
```

---

## 🗺️ Product Roadmap

* **Stage 1 (Current Evaluation):** Core ClubOps operations — Backward Milestone Planner, Autonomous Action Copilot, Volunteer Workload Monitoring, Meeting Extractor, Risk Radar, and pgvector RAG.
* **Stage 2 (Upcoming):** Live Stage Flow Controller (`/stage-flow`) with cascading delay adjustments, Direct WhatsApp Voice Note audio pipeline, Web Push notification alerts, and direct WhatsApp Business API dispatch.
  * *See full architecture and specification in [ROADMAP_FEATURES_TO_BE_ADDED.md](file:///d:/PROJECTS/convene-ai/ROADMAP_FEATURES_TO_BE_ADDED.md)*.

---

## 📄 License

MIT © [Convene AI Team](https://github.com/jeetptl1503/convene-ai)
