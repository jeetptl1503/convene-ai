"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Meeting, Member, Priority } from "@/types/database";

interface ActionItem {
  id: string; // client temporary ID
  title: string;
  owner_id: string | null;
  owner_name?: string | null;
  deadline: string | null;
  priority: Priority;
}

interface ExtractionResult {
  summary: string;
  decisions: string[];
  action_items: ActionItem[];
  risks_mentioned: string[];
}

const SAMPLE_TRANSCRIPTS = [
  {
    title: "Hackathon Logistics & Venue Standup",
    label: "Sample 1: Logistics & Audio",
    text: `Priya: Okay everyone, we have only 9 days before HackCon 2026. Audi 2 is still not officially reserved because Dean's office asked for the faculty advisor signature.
Karan: I talked to Prof. Sharma yesterday, he'll sign it. Priya can you submit the signed form and lock Audi 2 by this Friday?
Priya: Yeah I'll go to the admin block Friday 11am.
Karan: Also sound system — last year the podium mic cut out during closing ceremony. I will test all 4 cordless mics, the PA system, and HDMI splitters this Saturday afternoon.
Arjun: What about catering? We promised 150 boxed meals and midnight energy drinks. The RedBull sponsor guy hasn't sent the crate count.
Priya: Arjun you need to finalize the caterer by next Tuesday noon, otherwise they charge a 20% rush fee.
Karan: Agreed. And let's make sure high-speed Wi-Fi credentials for guests are printed beforehand.`,
  },
  {
    title: "Marketing Blitz & Social Promo",
    label: "Sample 2: Marketing Blitz",
    text: `Sneha: Registration count is at 140, our target is 250 hackers. Social media engagement dropped this week.
Rohan: I finished the primary Figma banners, but need to tweak the sponsor logos. I'll have the final Instagram square and story graphics done tonight by 9pm.
Sneha: Perfect. Once Rohan sends them, Neha and I will print 60 high-gloss posters and stick them across all 4 boys and girls hostels tomorrow morning before 10am classes.
Rohan: Also we need a hype video reel. Who has the footage from last year?
Sneha: I have the Google Drive link. Rohan, can you edit a 30-second teaser reel by Thursday 6pm?
Rohan: Yes, putting that down as high priority.
Sneha: One risk: security guards tore down our posters in Block C last time, so we need to get the student welfare stamp first.`,
  },
  {
    title: "Sponsorship & Keynote Guest Review",
    label: "Sample 3: Sponsors & Guests",
    text: `Ananya: Quick check-in on corporate funds. Devfolio signed our MOU, but Google Cloud credit codes haven't arrived.
Rahul: I followed up with the DevRel manager. Ananya, please send a reminder email to Devfolio operations by Monday morning.
Ananya: Done. What about Dr. Radhika, our AI keynote speaker from Bangalore?
Rahul: Her flight tickets are still not booked because travel approvals took forever. If we don't book her Indigo flight tickets by tomorrow evening, ticket fares will double or seats will sell out!
Ananya: Rahul make that critical priority. Book the flight reimbursement tomorrow.
Rahul: Got it. Also we need a student volunteer to pick her up from the airport on Saturday at 8am.`,
  },
];

export default function MeetingsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form states
  const [title, setTitle] = useState("Hackathon Weekly Sync");
  const [transcript, setTranscript] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Extraction result states
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [savingTasks, setSavingTasks] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Expanded past meeting transcripts
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoadingInitial(true);
      const [membersRes, meetingsRes] = await Promise.all([
        supabase.from("members").select("*").eq("event_id", DEMO_EVENT_ID),
        supabase
          .from("meetings")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .order("date", { ascending: false }),
      ]);

      if (membersRes.data) setMembers(membersRes.data);
      if (meetingsRes.data) setPastMeetings(meetingsRes.data);
    } catch (err) {
      console.error("Error loading meetings data:", err);
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load sample transcript
  const handleLoadSample = (sample: (typeof SAMPLE_TRANSCRIPTS)[0]) => {
    setTitle(sample.title);
    setTranscript(sample.text);
    setResult(null);
    setExtractError(null);
    setSaveSuccess(null);
  };

  // Call /api/meetings/extract
  const handleExtract = async () => {
    if (!transcript.trim()) {
      setExtractError("Please paste or load a meeting transcript first.");
      return;
    }

    try {
      setExtracting(true);
      setExtractError(null);
      setSaveSuccess(null);

      const res = await fetch("/api/meetings/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, title }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract meeting action items.");

      // Add temporary client IDs for easy editing
      const itemsWithIds: ActionItem[] = (data.action_items || []).map(
        (item: ActionItem, idx: number) => ({
          ...item,
          id: `ai-${Date.now()}-${idx}`,
        })
      );

      setResult({
        summary: data.summary || "",
        decisions: data.decisions || [],
        action_items: itemsWithIds,
        risks_mentioned: data.risks_mentioned || [],
      });
    } catch (err: unknown) {
      console.error("Extract error:", err);
      setExtractError(err instanceof Error ? err.message : "Error extracting items.");
    } finally {
      setExtracting(false);
    }
  };

  // Action item editing helpers
  const updateActionItem = (id: string, updates: Partial<ActionItem>) => {
    if (!result) return;
    setResult({
      ...result,
      action_items: result.action_items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const removeActionItem = (id: string) => {
    if (!result) return;
    setResult({
      ...result,
      action_items: result.action_items.filter((item) => item.id !== id),
    });
  };

  const addActionItem = () => {
    if (!result) return;
    const newItem: ActionItem = {
      id: `ai-${Date.now()}`,
      title: "New Action Item",
      owner_id: null,
      deadline: null,
      priority: "medium",
    };
    setResult({
      ...result,
      action_items: [...result.action_items, newItem],
    });
  };

  // Save Meeting & Create Tasks
  const handleSaveAndCreateTasks = async () => {
    if (!result) return;

    try {
      setSavingTasks(true);
      setExtractError(null);

      // 1. Insert Meeting
      const { data: meetingData, error: meetingErr } = await supabase
        .from("meetings")
        .insert({
          event_id: DEMO_EVENT_ID,
          title: title.trim() || "Team Meeting",
          transcript: transcript.trim(),
          summary: result.summary,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (meetingErr) throw meetingErr;

      // 2. Insert Tasks
      if (result.action_items.length > 0) {
        const taskRows = result.action_items.map((item) => ({
          event_id: DEMO_EVENT_ID,
          title: item.title,
          owner_id: item.owner_id || null,
          deadline: item.deadline ? new Date(item.deadline).toISOString() : null,
          priority: item.priority,
          status: "todo",
        }));

        const { error: tasksErr } = await supabase.from("tasks").insert(taskRows);
        if (tasksErr) throw tasksErr;
      }

      // 3. Log to activity_log
      await logActivity(
        "Meeting Extracted",
        `Created ${result.action_items.length} tasks from "${title}" with AI summary`
      );

      setSaveSuccess(
        `Success! Meeting saved and ${result.action_items.length} action items added as live tasks.`
      );
      setResult(null);
      setTranscript("");
      await loadData();
    } catch (err: unknown) {
      console.error("Save tasks error:", err);
      setExtractError(err instanceof Error ? err.message : "Failed to create tasks.");
    } finally {
      setSavingTasks(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Meetings & AI Action Extraction"
        description="Turn messy verbal meeting notes into concrete tasks, assignees, and deadlines"
      />

      {/* Hero extraction workspace */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-card-border mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎙️</span> Meeting to Action Items (AI Extraction)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Paste transcripts or load sample club notes to extract actionable tasks with deadlines and owners.
            </p>
          </div>

          {/* Sample buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-medium">Try Sample:</span>
            {SAMPLE_TRANSCRIPTS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(s)}
                className="rounded-lg bg-sidebar-bg border border-card-border px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-accent transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-5 rounded-lg bg-emerald-950/60 border border-emerald-800 p-4 text-sm text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>{saveSuccess}</span>
            </div>
            <button
              onClick={() => setSaveSuccess(null)}
              className="text-xs text-emerald-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {extractError && (
          <div className="mb-5 rounded-lg bg-danger/10 border border-danger/30 p-4 text-sm text-danger flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{extractError}</span>
            </div>
            <button
              onClick={() => setExtractError(null)}
              className="text-xs text-danger hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Hackathon Coordination Standup"
              className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Transcript / Raw Meeting Notes
            </label>
            <textarea
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste raw conversation, meeting minutes, bullet points, or transcript with team chatter..."
              className="w-full rounded-lg border border-card-border bg-sidebar-bg p-3 text-sm text-white placeholder:text-muted font-mono focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={extracting || !transcript.trim()}
              onClick={handleExtract}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 transition shadow-md shadow-accent/20 disabled:opacity-50"
            >
              {extracting ? (
                <>
                  <span className="animate-spin">🌀</span> Extracting Action Items with Gemini...
                </>
              ) : (
                <>
                  <span>✨</span> Extract Action Items with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editable Preview Section */}
        {result && (
          <div className="mt-8 pt-6 border-t border-card-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📋</span> Extracted Preview & Action Plan
              </h3>
              <span className="text-xs text-muted">
                Edit items before committing to database
              </span>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-sidebar-bg border border-card-border p-4">
              <label className="block text-xs font-semibold text-accent-light uppercase tracking-wider mb-1.5">
                Executive Summary
              </label>
              <textarea
                rows={2}
                value={result.summary}
                onChange={(e) => setResult({ ...result, summary: e.target.value })}
                className="w-full rounded bg-card-bg border border-card-border/60 p-2.5 text-xs text-slate-200 focus:border-accent focus:outline-none"
              />
            </div>

            {/* Decisions */}
            {result.decisions.length > 0 && (
              <div className="rounded-lg bg-sidebar-bg border border-card-border p-4">
                <span className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Key Decisions Agreed
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {result.decisions.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks Mentioned */}
            {result.risks_mentioned.length > 0 && (
              <div className="rounded-lg bg-amber-950/30 border border-amber-900/50 p-4">
                <span className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  ⚠️ Bottlenecks & Risks Identified
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.risks_mentioned.map((r, i) => (
                    <span
                      key={i}
                      className="rounded bg-amber-950 text-amber-200 border border-amber-800 text-xs px-2.5 py-1"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Action Items ({result.action_items.length})
                </span>
                <button
                  type="button"
                  onClick={addActionItem}
                  className="text-xs text-accent-light hover:underline font-medium"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-3">
                {result.action_items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-sidebar-bg border border-card-border p-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    {/* Title */}
                    <div className="md:col-span-5">
                      <label className="block text-[10px] text-muted uppercase mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateActionItem(item.id, { title: e.target.value })
                        }
                        className="w-full rounded border border-card-border bg-card-bg px-2.5 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* Assignee */}
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-muted uppercase mb-1">
                        Assignee (Fuzzy Matched)
                      </label>
                      <select
                        value={item.owner_id || ""}
                        onChange={(e) =>
                          updateActionItem(item.id, {
                            owner_id: e.target.value || null,
                          })
                        }
                        className="w-full rounded border border-card-border bg-card-bg px-2 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                      >
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Deadline */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-muted uppercase mb-1">
                        Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          item.deadline
                            ? new Date(item.deadline).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          updateActionItem(item.id, {
                            deadline: e.target.value
                              ? new Date(e.target.value).toISOString()
                              : null,
                          })
                        }
                        className="w-full rounded border border-card-border bg-card-bg px-2 py-1.5 text-xs text-white focus:border-accent focus:outline-none"
                      />
                    </div>

                    {/* Priority */}
                    <div className="md:col-span-1">
                      <label className="block text-[10px] text-muted uppercase mb-1">
                        Priority
                      </label>
                      <select
                        value={item.priority}
                        onChange={(e) =>
                          updateActionItem(item.id, {
                            priority: e.target.value as Priority,
                          })
                        }
                        className="w-full rounded border border-card-border bg-card-bg px-1.5 py-1.5 text-xs text-white capitalize focus:border-accent focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Med</option>
                        <option value="high">High</option>
                        <option value="critical">Crit</option>
                      </select>
                    </div>

                    {/* Remove */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeActionItem(item.id)}
                        className="text-muted hover:text-danger text-xs p-1"
                        title="Remove action item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-card-border">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-white"
              >
                Discard Preview
              </button>
              <button
                type="button"
                disabled={savingTasks}
                onClick={handleSaveAndCreateTasks}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {savingTasks ? (
                  <>
                    <span className="animate-spin">🌀</span> Creating Tasks...
                  </>
                ) : (
                  <>
                    <span>✅</span> Create Tasks & Save Meeting
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Past Meetings List */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📅</span> Past Meetings & Transcripts ({pastMeetings.length})
        </h2>

        {loadingInitial ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-card-bg/50 border border-card-border animate-pulse p-4"
              />
            ))}
          </div>
        ) : pastMeetings.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <span className="text-3xl mb-2 block">📭</span>
            <p className="text-sm font-medium">No past meetings recorded yet</p>
            <p className="text-xs mt-0.5">
              Extract and save your first meeting transcript above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastMeetings.map((m) => {
              const isExpanded = expandedMeetingId === m.id;
              return (
                <div
                  key={m.id}
                  className="rounded-lg border border-card-border bg-sidebar-bg/60 p-4 transition hover:border-card-border/80"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-white text-base">{m.title}</h4>
                      <p className="text-xs text-muted">
                        Recorded on{" "}
                        {new Date(m.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMeetingId(isExpanded ? null : m.id)
                      }
                      className="text-xs text-accent-light hover:underline self-start sm:self-auto font-medium"
                    >
                      {isExpanded ? "Hide Transcript ▲" : "View Transcript ▼"}
                    </button>
                  </div>

                  {m.summary && (
                    <div className="mt-3 rounded bg-card-bg border border-card-border/50 p-3 text-xs text-slate-300">
                      <span className="font-semibold text-[11px] text-accent-light block uppercase tracking-wider mb-1">
                        Executive Summary
                      </span>
                      {m.summary}
                    </div>
                  )}

                  {isExpanded && m.transcript && (
                    <div className="mt-3 rounded bg-black/40 border border-card-border/50 p-3 text-xs text-slate-400 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {m.transcript}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
