"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Member, Priority } from "@/types/database";

interface PlannedTask {
  title: string;
  description: string;
  owner_role: string;
  deadline_offset_days: number;
  deadline_iso: string;
  priority: Priority;
  depends_on_index: number | null;
}

export default function PlannerModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [planning, setPlanning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [plan, setPlan] = useState<{
    event_name: string;
    tasks: PlannedTask[];
    members: Member[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!description.trim() || !eventDate) return;

    try {
      setPlanning(true);
      setError(null);

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          event_date: eventDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPlan(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setPlanning(false);
    }
  };

  const handleCreateAll = async () => {
    if (!plan) return;

    try {
      setCreating(true);
      setError(null);

      const taskRows = plan.tasks.map((t) => ({
        event_id: DEMO_EVENT_ID,
        title: t.title,
        description: t.description,
        deadline: t.deadline_iso,
        priority: t.priority,
        status: "todo",
      }));

      const { error: insertErr } = await supabase.from("tasks").insert(taskRows);
      if (insertErr) throw insertErr;

      await logActivity(
        "AI Plan Created",
        `Generated ${plan.tasks.length} tasks for "${plan.event_name}" using AI Planner`
      );

      setPlan(null);
      setDescription("");
      setEventDate("");
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create tasks");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-card-border bg-card-bg p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🗓️</span> Plan Event with AI
          </h3>
          <button
            onClick={() => {
              onClose();
              setPlan(null);
            }}
            className="text-muted hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 border border-danger/30 p-3 text-xs text-danger">
            {error}
          </div>
        )}

        {!plan ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Describe your event in a sentence *
              </label>
              <input
                type="text"
                placeholder="e.g., A 24-hour hackathon for 200 students with speakers, prizes, and workshops"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-card-border">
              <button
                disabled={planning || !description.trim() || !eventDate}
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 transition disabled:opacity-50"
              >
                {planning ? (
                  <>
                    <span className="animate-spin">🌀</span> Planning with AI...
                  </>
                ) : (
                  <>
                    <span>🗓️</span> Generate Task Plan
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-sidebar-bg border border-card-border p-4">
              <h4 className="font-bold text-white text-base">{plan.event_name}</h4>
              <p className="text-xs text-muted mt-0.5">
                {plan.tasks.length} tasks generated with deadlines counted back from event date
              </p>
            </div>

            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              {plan.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-sidebar-bg/80 border border-card-border p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          task.priority === "critical"
                            ? "bg-rose-950 text-rose-300"
                            : task.priority === "high"
                            ? "bg-amber-950 text-amber-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <h5 className="font-semibold text-white text-sm">{task.title}</h5>
                    </div>
                    <span className="text-[11px] text-muted whitespace-nowrap">
                      Due: {new Date(task.deadline_iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                  <div className="mt-1.5 text-[11px] text-muted flex items-center gap-3">
                    <span>👤 Role: {task.owner_role}</span>
                    {task.depends_on_index !== null && (
                      <span className="text-amber-400">
                        🔗 Depends on: #{task.depends_on_index + 1}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-card-border">
              <button
                onClick={() => setPlan(null)}
                className="text-xs text-muted hover:text-white"
              >
                ← Regenerate
              </button>
              <button
                disabled={creating}
                onClick={handleCreateAll}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <span className="animate-spin">🌀</span> Creating Tasks...
                  </>
                ) : (
                  <>
                    <span>✅</span> Create All {plan.tasks.length} Tasks
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
