# Convene AI — Roadmap & Features to be Added (Stage 2)

> **Document Purpose:** This document preserves the architectural designs, specifications, and requirements for advanced features originally outlined on the landing page that are scheduled for implementation in **Stage 2** of the hackathon / platform development lifecycle.

---

## 📋 Summary of Stage 2 Backlog

During Stage 1 evaluation, the Convene AI platform focuses on **rock-solid pre-event club operations (Track PS-3)**:
- Autonomous Action Copilot with live Supabase database tool execution
- Backward Milestone Event Planner (D-30 to Launch Day)
- Interactive 3-column Kanban board with dependency tracking (`depends_on`)
- Volunteer roster with real-time workload capacity monitoring & 1-click task rebalancing
- Chat transcript & meeting note action item extraction with auto-roster matching
- 24/7 AI Risk Detection Radar with automated mitigation recommendations
- Club document knowledge base powered by semantic search (pgvector RAG)
- AI-assisted announcement generator with WhatsApp formatting & 1-click clipboard dispatch

The following five major features are documented below for implementation in **Stage 2**:

---

## 1. Track PS-5: Smart Anchor MC & Live Stage Management Console

### Background & Objective
During campus events, live stage schedules frequently drift because speakers overrun, slides take time to switch, or technical glitches occur. Backstage teams, AV crew, and the master of ceremonies (MC / Anchor) struggle to maintain synchronization.

### Stage 2 Deliverables
1. **Live Stage Flow Controller (`/stage-flow`)**:
   - Real-time agenda run-of-show with scheduled vs. actual start/end timestamps.
   - **Dynamic Schedule Cascade Algorithm**: When an active session is marked with a delay (e.g. `+10m` or `+15m`), downstream agenda sessions automatically recalculate and push back their expected start times.
   - One-click trigger for schedule compressions (e.g. shortening lunch or breaks by 10 minutes to recover lost time).
2. **AI Teleprompter & Instant Filler Banter Generator**:
   - **Speaker Introductions**: Generates high-energy 30-45 second speaker introductory bios from speaker profile data.
   - **Emergency Filler Scripts**: When delays occur (e.g., projector disconnected or speaker late), the AI instantly feeds the MC a contextual audience engagement prompt, trivia, or banter script to prevent awkward silence.
   - **Smooth Transitions**: Auto-generates transitions between completely different topics or guest speakers.
3. **Multi-Crew Channel Synchronization**:
   - Real-time status indicators across 3 dedicated roles:
     - **AV & Sound Booth**: Microphone check, projector source ready, slides loaded.
     - **Stage MC Teleprompter**: Current script, countdown timer, next speaker cue.
     - **Backstage / Hospitality**: Guest arrival status, green room cue, speaker ready.

---

## 2. Direct WhatsApp Voice Note & Audio Processing Pipeline

### Background & Objective
College club organizers frequently exchange voice notes on WhatsApp (e.g., 2-minute post-meeting voice memos) rather than typing structured meeting minutes.

### Stage 2 Deliverables
1. **Audio File Uploader in `/meetings`**:
   - Support uploading audio formats: `.mp3`, `.wav`, `.ogg` (WhatsApp voice notes), `.m4a`.
2. **Direct Speech-to-Text & Ingestion Engine**:
   - Integrate Google Gemini 2.5 audio multimodal input (`client.models.generateContent` with audio MIME types) or Whisper API.
   - Transcribe spoken audio directly into text with speaker diarization.
3. **Autonomous Action Extraction from Audio**:
   - Pipe the transcribed audio into Convene's name-matching and task-extraction pipeline to automatically create assigned tasks in the database.

---

## 3. Real-Time Web Push Notifications & Volunteer Alerting

### Background & Objective
Volunteers are often walking around campus during fest preparation and may not be looking at their laptops.

### Stage 2 Deliverables
1. **Service Worker & Web Push Protocol**:
   - Implement Web Push API with VAPID keys and Service Worker registration.
2. **Critical Event Alerts**:
   - Push alert when a task assigned to a volunteer is flagged as **Critical** or **Overdue**.
   - Push alert when volunteer workload exceeds 90% capacity and a task is rebalanced.
   - Backstage stage cues sent directly to volunteer mobile browsers.

---

## 4. Direct WhatsApp & Email API Dispatch Integration

### Background & Objective
Currently, Convene formats announcements with WhatsApp markdown and allows 1-click copying to clipboard. Direct dispatch will automate message delivery.

### Stage 2 Deliverables
1. **WhatsApp Business Cloud API / Twilio Integration**:
   - Directly dispatch announcements to club WhatsApp groups or broadcast lists with one click.
2. **Club Email Integration (Resend / SendGrid)**:
   - Email dispatch to registered attendees and faculty advisors directly from `/announcements`.
3. **Delivery & Read Receipts Tracking**:
   - Track confirmation of volunteer receipt for critical logistics notices.

---

## 5. Extended Agent Function Calling Tools

### Background & Objective
Expand the autonomous Copilot Agent's function calling capabilities in `app/api/agent/route.ts`.

### Stage 2 Deliverables
- `create_milestone(title, event_date, offset_days)`: Automatically creates milestone groups in the planner.
- `rebalance_volunteer_load(overloaded_member_id, target_member_id)`: Autonomous execution of task transfers through natural language.
- `cascade_stage_delay(session_id, delay_minutes)`: Programmatic recalculation of stage flow through the agent chat.
- `generate_anchor_script(session_title, speaker_name, script_type)`: Direct teleprompter generation via the copilot prompt.

---

*Authored for Convene AI · Stage 1 Audit & Stage 2 Roadmap*
