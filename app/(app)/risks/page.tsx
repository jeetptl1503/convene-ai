"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Risk, RiskSeverity, Task } from "@/types/database";

const SEVERITY_STYLES: Record<
  RiskSeverity,
  { bg: string; text: string; border: string; label: string }
> = {
  critical: {
    bg: "bg-rose-950/80",
    text: "text-rose-300",
    border: "border-rose-700",
    label: "CRITICAL",
  },
  high: {
    bg: "bg-amber-950/80",
    text: "text-amber-300",
    border: "border-amber-700",
    label: "HIGH",
  },
  medium: {
    bg: "bg-indigo-950/80",
    text: "text-indigo-300",
    border: "border-indigo-700",
    label: "MEDIUM",
  },
  low: {
    bg: "bg-slate-800",
    text: "text-slate-300",
    border: "border-slate-600",
    label: "LOW",
  },
};

export default function RisksPage() {
  const [risks, setRisks] = useState<(Risk & { task?: Task | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Filter: 'all', 'open', 'critical', 'high', 'medium', 'low', 'resolved'
  const [filter, setFilter] = useState<string>("open");

  const loadRisks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [risksRes, tasksRes] = await Promise.all([
        supabase
          .from("risks")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .order("created_at", { ascending: false }),
        supabase.from("tasks").select("id, title, status").eq("event_id", DEMO_EVENT_ID),
      ]);

      if (risksRes.error) throw risksRes.error;
      if (tasksRes.error) throw tasksRes.error;

      const taskMap = new Map<string, { id: string; title: string; status: string }>();
      (tasksRes.data || []).forEach((t) => taskMap.set(t.id, t));

      const enriched = (risksRes.data || []).map((r: Risk) => ({
        ...r,
        task: r.task_id ? (taskMap.get(r.task_id) as Task | null) : null,
      }));

      setRisks(enriched);
    } catch (err: unknown) {
      console.error("Error loading risks:", err);
      setError(err instanceof Error ? err.message : "Failed to load risks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRisks();
  }, [loadRisks]);

  // Run AI Risk Scanner
  const handleScanNow = async () => {
    try {
      setScanning(true);
      setScanMessage(null);
      setError(null);

      const res = await fetch("/api/risks/scan", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to scan risks.");

      setScanMessage(
        data.new_risks_count > 0
          ? `Scan complete: Found ${data.detected_count} operational issues, recorded ${data.new_risks_count} new risk items!`
          : "Scan complete: No new risks detected. Event operations are on schedule."
      );

      await loadRisks();
    } catch (err: unknown) {
      console.error("Risk scan error:", err);
      setError(err instanceof Error ? err.message : "Error during risk scan.");
    } finally {
      setScanning(false);
    }
  };

  // Resolve a risk
  const handleResolveRisk = async (risk: Risk) => {
    try {
      const { error: updateErr } = await supabase
        .from("risks")
        .update({ resolved: true })
        .eq("id", risk.id);

      if (updateErr) throw updateErr;

      // Optimistic update
      setRisks((prev) =>
        prev.map((r) => (r.id === risk.id ? { ...r, resolved: true } : r))
      );

      await logActivity("Resolved Risk", `Resolved operational risk: "${risk.title}"`);
    } catch (err: unknown) {
      alert("Failed to resolve risk: " + (err instanceof Error ? err.message : "Error"));
    }
  };

  // Un-resolve
  const handleUnresolveRisk = async (risk: Risk) => {
    try {
      const { error: updateErr } = await supabase
        .from("risks")
        .update({ resolved: false })
        .eq("id", risk.id);

      if (updateErr) throw updateErr;

      setRisks((prev) =>
        prev.map((r) => (r.id === risk.id ? { ...r, resolved: false } : r))
      );

      await logActivity("Reopened Risk", `Reopened operational risk: "${risk.title}"`);
    } catch (err: unknown) {
      alert("Failed to reopen risk: " + (err instanceof Error ? err.message : "Error"));
    }
  };

  const openRisksCount = risks.filter((r) => !r.resolved).length;
  const criticalCount = risks.filter((r) => !r.resolved && r.severity === "critical").length;
  const highCount = risks.filter((r) => !r.resolved && r.severity === "high").length;

  // Filtered risks
  const filteredRisks = risks.filter((r) => {
    if (filter === "open") return !r.resolved;
    if (filter === "resolved") return r.resolved;
    if (filter === "critical") return !r.resolved && r.severity === "critical";
    if (filter === "high") return !r.resolved && r.severity === "high";
    if (filter === "medium") return !r.resolved && r.severity === "medium";
    if (filter === "low") return !r.resolved && r.severity === "low";
    return true; // "all"
  });

  return (
    <div>
      <PageHeader
        title="Risk Engine & Mitigations"
        description="Automated AI risk scanner detecting overdue milestones, unassigned bottlenecks, and team overload"
        action={
          <button
            type="button"
            disabled={scanning}
            onClick={handleScanNow}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 transition shadow-md shadow-accent/20 disabled:opacity-50"
          >
            {scanning ? (
              <>
                <span className="animate-spin">🌀</span> Scanning Event Tasks...
              </>
            ) : (
              <>
                <span>🔍</span> Scan Now
              </>
            )}
          </button>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-card-border bg-card-bg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Total Open Risks</p>
            <p className="text-2xl font-bold text-white mt-1">{openRisksCount}</p>
          </div>
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="rounded-xl border border-card-border bg-card-bg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Critical Severity</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{criticalCount}</p>
          </div>
          <span className="text-2xl">🚨</span>
        </div>

        <div className="rounded-xl border border-card-border bg-card-bg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">High Severity</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{highCount}</p>
          </div>
          <span className="text-2xl">⚡</span>
        </div>
      </div>

      {scanMessage && (
        <div className="mb-6 rounded-lg bg-emerald-950/60 border border-emerald-800 p-4 text-sm text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✨</span>
            <span>{scanMessage}</span>
          </div>
          <button
            onClick={() => setScanMessage(null)}
            className="text-xs text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-card-border bg-card-bg p-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "open", label: `Open (${openRisksCount})` },
            { id: "all", label: `All (${risks.length})` },
            { id: "critical", label: "Critical" },
            { id: "high", label: "High" },
            { id: "medium", label: "Medium" },
            { id: "low", label: "Low" },
            {
              id: "resolved",
              label: `Resolved (${risks.filter((r) => r.resolved).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === tab.id
                  ? "bg-accent text-white"
                  : "bg-sidebar-bg text-muted hover:text-white hover:bg-sidebar-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted">
          Showing {filteredRisks.length} of {risks.length} total risks
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 rounded-xl border border-card-border bg-card-bg/50 animate-pulse p-5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-center">
          <h3 className="text-lg font-semibold text-danger">Failed to load risks</h3>
          <p className="text-sm text-muted mt-1">{error}</p>
          <button
            onClick={loadRisks}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white"
          >
            Retry
          </button>
        </div>
      ) : filteredRisks.length === 0 ? (
        <div className="rounded-xl border border-card-border bg-card-bg p-12 text-center text-muted">
          <span className="text-4xl mb-3 block">🎉</span>
          <h3 className="text-lg font-semibold text-white">No risks in this view</h3>
          <p className="text-sm mt-1">
            {filter === "open"
              ? "All clear! Click 'Scan Now' to run the AI risk detection engine."
              : "No risks matching the selected filter."}
          </p>
          {filter === "open" && (
            <button
              onClick={handleScanNow}
              disabled={scanning}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white"
            >
              Run AI Risk Scan
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRisks.map((risk) => {
            const sStyle = SEVERITY_STYLES[risk.severity];

            return (
              <div
                key={risk.id}
                className={`rounded-xl border bg-card-bg p-5 transition hover:border-card-border/80 ${
                  risk.resolved
                    ? "opacity-60 border-card-border bg-card-bg/40"
                    : risk.severity === "critical"
                    ? "border-rose-800/60 shadow-sm shadow-rose-950/20"
                    : risk.severity === "high"
                    ? "border-amber-800/60"
                    : "border-card-border"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${sStyle.bg} ${sStyle.text} ${sStyle.border}`}
                      >
                        {sStyle.label}
                      </span>

                      <h4
                        className={`font-bold text-base text-white ${
                          risk.resolved ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {risk.title}
                      </h4>

                      {risk.resolved && (
                        <span className="rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 font-bold">
                          ✓ RESOLVED
                        </span>
                      )}
                    </div>

                    {risk.task && (
                      <p className="text-xs text-muted">
                        Linked Task:{" "}
                        <strong className="text-slate-300">
                          {risk.task.title}
                        </strong>{" "}
                        <span className="capitalize">({risk.task.status})</span>
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="self-end sm:self-start">
                    {risk.resolved ? (
                      <button
                        type="button"
                        onClick={() => handleUnresolveRisk(risk)}
                        className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted hover:text-white transition"
                      >
                        Reopen Risk
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResolveRisk(risk)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition shadow-sm"
                      >
                        <span>✓</span> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Explanation */}
                {risk.explanation && (
                  <div className="mt-3 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-400 block text-[11px] uppercase tracking-wider mb-0.5">
                      Why this matters:
                    </span>
                    {risk.explanation}
                  </div>
                )}

                {/* Suggestion / Fix */}
                {risk.suggestion && (
                  <div className="mt-3 rounded-lg bg-sidebar-bg border border-card-border/60 p-3 text-xs text-emerald-200/90 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                      <span>💡</span> Recommended Action Fix:
                    </div>
                    {risk.suggestion}
                  </div>
                )}

                <div className="mt-3 pt-2.5 border-t border-card-border/40 flex items-center justify-between text-[11px] text-muted">
                  <span>
                    Detected:{" "}
                    {new Date(risk.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
