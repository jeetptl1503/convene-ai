"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Announcement } from "@/types/database";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

  // AI Draft form
  const [intent, setIntent] = useState("");
  const [audience, setAudience] = useState("All participants and volunteers");
  const [tone, setTone] = useState("Professional yet friendly");
  const [drafting, setDrafting] = useState(false);

  // Editable draft
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [showDraftEditor, setShowDraftEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("event_id", DEMO_EVENT_ID)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error("Error loading announcements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleAIDraft = async () => {
    if (!intent.trim()) return;

    try {
      setDrafting(true);
      setMessage(null);

      const res = await fetch("/api/announcements/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, audience, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDraftTitle(data.title || "Announcement");
      setDraftBody(data.body || "");
      setShowDraftEditor(true);
    } catch (err: unknown) {
      setMessage("⚠️ " + (err instanceof Error ? err.message : "Failed to draft"));
    } finally {
      setDrafting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draftTitle.trim()) return;

    try {
      setSaving(true);
      const { error } = await supabase.from("announcements").insert({
        event_id: DEMO_EVENT_ID,
        title: draftTitle.trim(),
        body: draftBody.trim(),
        status: "draft",
      });

      if (error) throw error;

      await logActivity("Saved Announcement Draft", `Saved draft: "${draftTitle}"`);
      setMessage("✅ Draft saved successfully!");
      setShowDraftEditor(false);
      setDraftTitle("");
      setDraftBody("");
      setIntent("");
      await loadAnnouncements();
    } catch (err: unknown) {
      setMessage("⚠️ " + (err instanceof Error ? err.message : "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (ann: Announcement) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ status: "published", updated_at: new Date().toISOString() })
        .eq("id", ann.id);

      if (error) throw error;

      await logActivity("Published Announcement", `Published: "${ann.title}"`);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === ann.id ? { ...a, status: "published" } : a))
      );
    } catch (err) {
      alert("Failed to publish: " + (err instanceof Error ? err.message : "Error"));
    }
  };

  const handleCopyWhatsApp = (ann: Announcement) => {
    const text = `📢 *${ann.title}*\n\n${ann.body || ""}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(ann.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filtered = announcements.filter((a) => {
    if (filter === "draft") return a.status === "draft";
    if (filter === "published") return a.status === "published";
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="AI-draft and publish event announcements with context-aware messaging"
      />

      {/* AI Drafting Workspace */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">✨</span>
          <h2 className="text-base font-bold text-white">Draft with AI</h2>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-xs ${
              message.startsWith("⚠️")
                ? "bg-danger/10 border border-danger/30 text-danger"
                : "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
            }`}
          >
            {message}
          </div>
        )}

        {!showDraftEditor ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                What do you want to announce? *
              </label>
              <input
                type="text"
                placeholder="e.g., Registration deadline extended to Friday, Team formation rules, Final schedule released"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                >
                  <option>All participants and volunteers</option>
                  <option>Participants only</option>
                  <option>Volunteers & organizers only</option>
                  <option>Sponsors</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                >
                  <option>Professional yet friendly</option>
                  <option>Casual and energetic</option>
                  <option>Formal and official</option>
                  <option>Urgent and action-oriented</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={drafting || !intent.trim()}
                onClick={handleAIDraft}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 transition shadow-md shadow-accent/20 disabled:opacity-50"
              >
                {drafting ? (
                  <>
                    <span className="animate-spin">🌀</span> Drafting with AI...
                  </>
                ) : (
                  <>
                    <span>✨</span> Generate AI Draft
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Editable Draft */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-accent-light mb-1 uppercase tracking-wider">
                Subject / Title
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white font-semibold focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent-light mb-1 uppercase tracking-wider">
                Body
              </label>
              <textarea
                rows={8}
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-sidebar-bg p-3 text-sm text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-card-border">
              <button
                onClick={() => {
                  setShowDraftEditor(false);
                  setDraftTitle("");
                  setDraftBody("");
                }}
                className="text-xs text-muted hover:text-white"
              >
                Discard
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="rounded-lg bg-sidebar-hover px-4 py-2 text-xs font-medium text-white hover:bg-sidebar-bg transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save as Draft"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Past Announcements */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📢</span> Announcements ({filtered.length})
          </h2>

          <div className="flex gap-1.5">
            {(["all", "draft", "published"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition ${
                  filter === f
                    ? "bg-accent text-white"
                    : "bg-sidebar-bg text-muted hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-card-bg/50 border border-card-border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <span className="text-3xl mb-2 block">📭</span>
            <p className="text-sm font-medium">No announcements yet</p>
            <p className="text-xs mt-0.5">Use the AI Draft above to create your first announcement.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ann) => (
              <div
                key={ann.id}
                className={`rounded-lg border p-4 transition ${
                  ann.status === "published"
                    ? "border-emerald-800/50 bg-emerald-950/20"
                    : "border-card-border bg-sidebar-bg/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          ann.status === "published"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}
                      >
                        {ann.status}
                      </span>
                      <h4 className="font-semibold text-white">{ann.title}</h4>
                    </div>
                    <p className="text-xs text-muted">
                      {new Date(ann.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {ann.status === "draft" && (
                      <button
                        onClick={() => handlePublish(ann)}
                        className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyWhatsApp(ann)}
                      className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted hover:text-white transition"
                    >
                      {copiedId === ann.id ? "✅ Copied!" : "📋 Copy for WhatsApp"}
                    </button>
                  </div>
                </div>

                {ann.body && (
                  <div className="mt-3 rounded bg-black/30 border border-card-border/50 p-3 text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {ann.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
