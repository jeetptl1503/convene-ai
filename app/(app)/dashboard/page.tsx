"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import type { Task, Risk, ActivityLog, Member } from "@/types/database";

interface DashboardData {
  tasks: (Task & { owner?: Member | null })[];
  risks: Risk[];
  activity: ActivityLog[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksRes, risksRes, activityRes, membersRes] = await Promise.all([
        supabase
          .from("tasks")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .order("deadline", { ascending: true, nullsFirst: false }),
        supabase
          .from("risks")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .eq("resolved", false),
        supabase
          .from("activity_log")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("members").select("*").eq("event_id", DEMO_EVENT_ID),
      ]);

      if (tasksRes.error) throw tasksRes.error;
      if (risksRes.error) throw risksRes.error;
      if (activityRes.error) throw activityRes.error;

      const memberMap = new Map<string, Member>();
      (membersRes.data || []).forEach((m: Member) => memberMap.set(m.id, m));

      const tasksWithOwners = (tasksRes.data || []).map((t: Task) => ({
        ...t,
        owner: t.owner_id ? memberMap.get(t.owner_id) || null : null,
      }));

      setData({
        tasks: tasksWithOwners,
        risks: risksRes.data || [],
        activity: activityRes.data || [],
      });
    } catch (err: unknown) {
      console.error("Error loading dashboard:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Overview of your event operations"
        />
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl border border-card-border bg-card-bg/60 animate-pulse p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-xl border border-card-border bg-card-bg/60 animate-pulse p-6" />
          <div className="h-72 rounded-xl border border-card-border bg-card-bg/60 animate-pulse p-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Overview of your event operations"
        />
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-danger">Failed to load dashboard</h3>
          <p className="text-sm text-muted mt-1">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const openRisks = data?.risks || [];
  const activity = data?.activity || [];

  const now = new Date();
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const doingCount = tasks.filter((t) => t.status === "doing").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const overdueCount = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < now && t.status !== "done"
  ).length;
  const unassignedCount = tasks.filter(
    (t) => !t.owner_id && t.status !== "done"
  ).length;

  const upcomingDeadlines = tasks
    .filter((t) => t.deadline && t.status !== "done")
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your event operations"
        action={
          <div className="flex gap-2">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80 transition shadow-sm"
            >
              <span>✅</span> View Tasks
            </Link>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-card-border bg-card-bg p-5 transition hover:border-accent/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Tasks Status</p>
            <span className="text-lg">📋</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{tasks.length}</p>
            <span className="text-xs text-muted">total</span>
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
              {todoCount} Todo
            </span>
            <span className="rounded bg-blue-950 text-blue-300 px-1.5 py-0.5">
              {doingCount} Doing
            </span>
            <span className="rounded bg-emerald-950 text-emerald-300 px-1.5 py-0.5">
              {doneCount} Done
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card-bg p-5 transition hover:border-danger/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Overdue Tasks</p>
            <span className="h-8 w-8 rounded-lg bg-danger/10 flex items-center justify-center text-danger font-semibold">
              ⏰
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-danger">{overdueCount}</p>
          <p className="mt-2 text-xs text-muted">
            {overdueCount > 0 ? "Requires immediate attention" : "All deadlines on track"}
          </p>
        </div>

        <div className="rounded-xl border border-card-border bg-card-bg p-5 transition hover:border-warning/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Unassigned Tasks</p>
            <span className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning font-semibold">
              👤
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-warning">{unassignedCount}</p>
          <p className="mt-2 text-xs text-muted">
            {unassignedCount > 0 ? "Needs team allocation" : "All open tasks assigned"}
          </p>
        </div>

        <div className="rounded-xl border border-card-border bg-card-bg p-5 transition hover:border-accent/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Open Risks</p>
            <span className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent-light font-semibold">
              ⚠️
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{openRisks.length}</p>
          <p className="mt-2 text-xs text-muted">
            <Link href="/risks" className="text-accent-light hover:underline">
              Inspect risks & fixes →
            </Link>
          </p>
        </div>
      </div>

      {/* Two columns: Deadlines & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="rounded-xl border border-card-border bg-card-bg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📅</span> Upcoming Deadlines
            </h2>
            <Link href="/tasks" className="text-xs text-accent-light hover:underline">
              All tasks ({tasks.length})
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-muted">
              <span className="text-3xl mb-2">🎉</span>
              <p className="text-sm font-medium">No pending deadlines</p>
              <p className="text-xs mt-1">All scheduled tasks are completed or have no deadline.</p>
            </div>
          ) : (
            <div className="divide-y divide-card-border/60">
              {upcomingDeadlines.map((task) => {
                const deadlineDate = task.deadline ? new Date(task.deadline) : null;
                const isOverdue = deadlineDate && deadlineDate < now;
                const isDueSoon =
                  deadlineDate &&
                  !isOverdue &&
                  deadlineDate.getTime() - now.getTime() < 48 * 3600 * 1000;

                return (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white truncate">
                          {task.title}
                        </span>
                        {task.priority === "critical" && (
                          <span className="rounded bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.2 font-semibold">
                            CRITICAL
                          </span>
                        )}
                        {task.priority === "high" && (
                          <span className="rounded bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2">
                            HIGH
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-0.5 flex items-center gap-3">
                        <span>👤 {task.owner ? task.owner.name : "Unassigned"}</span>
                        <span className="capitalize">Status: {task.status}</span>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          isOverdue
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : isDueSoon
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {isOverdue && "Overdue: "}
                        {deadlineDate?.toLocaleDateString(undefined, {
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

        {/* Recent Activity Feed */}
        <div className="rounded-xl border border-card-border bg-card-bg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>⚡</span> Recent Activity
            </h2>
            <button
              onClick={loadDashboard}
              className="text-xs text-muted hover:text-white transition"
              title="Refresh feed"
            >
              ↻ Refresh
            </button>
          </div>

          {activity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-muted">
              <span className="text-3xl mb-2">📜</span>
              <p className="text-sm font-medium">No activity logged yet</p>
              <p className="text-xs mt-1">Actions performed by members and AI will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-sidebar-bg/60 border border-card-border/50 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-accent-light uppercase tracking-wider">
                      {item.action}
                    </span>
                    <span className="text-[11px] text-muted">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {item.details && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {item.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
