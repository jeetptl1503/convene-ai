"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Task, Member, TaskStatus, Priority } from "@/types/database";

const STATUS_COLUMNS: { id: TaskStatus; title: string; icon: string; border: string }[] = [
  { id: "todo", title: "To Do", icon: "📋", border: "border-slate-700" },
  { id: "doing", title: "In Progress", icon: "🚀", border: "border-blue-800" },
  { id: "done", title: "Completed", icon: "✅", border: "border-emerald-800" },
];

const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-700" },
  medium: { bg: "bg-indigo-950", text: "text-indigo-300", border: "border-indigo-800" },
  high: { bg: "bg-amber-950", text: "text-amber-300", border: "border-amber-800" },
  critical: { bg: "bg-rose-950", text: "text-rose-300", border: "border-rose-800" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    owner_id: string;
    deadline: string;
    priority: Priority;
    status: TaskStatus;
    depends_on: string;
  }>({
    title: "",
    description: "",
    owner_id: "",
    deadline: "",
    priority: "medium",
    status: "todo",
    depends_on: "",
  });

  // Drag & drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksRes, membersRes] = await Promise.all([
        supabase
          .from("tasks")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .order("created_at", { ascending: true }),
        supabase.from("members").select("*").eq("event_id", DEMO_EVENT_ID),
      ]);

      if (tasksRes.error) throw tasksRes.error;
      if (membersRes.error) throw membersRes.error;

      setTasks(tasksRes.data || []);
      setMembers(membersRes.data || []);
    } catch (err: unknown) {
      console.error("Error loading tasks:", err);
      setError(err instanceof Error ? err.message : "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const memberMap = new Map<string, Member>();
  members.forEach((m) => memberMap.set(m.id, m));

  const taskMap = new Map<string, Task>();
  tasks.forEach((t) => taskMap.set(t.id, t));

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      owner_id: "",
      deadline: "",
      priority: "medium",
      status: "todo",
      depends_on: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      owner_id: task.owner_id || "",
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
      priority: task.priority,
      status: task.status,
      depends_on: task.depends_on || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const payload = {
        event_id: DEMO_EVENT_ID,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        owner_id: formData.owner_id || null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        priority: formData.priority,
        status: formData.status,
        depends_on: formData.depends_on || null,
        updated_at: new Date().toISOString(),
      };

      if (editingTask) {
        const { error: updateError } = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", editingTask.id);

        if (updateError) throw updateError;

        await logActivity("Updated Task", `Updated "${payload.title}" (${payload.status})`);
      } else {
        const { error: insertError } = await supabase.from("tasks").insert(payload);
        if (insertError) throw insertError;

        await logActivity("Created Task", `Created "${payload.title}"`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      console.error("Error saving task:", err);
      setFormError(err instanceof Error ? err.message : "Failed to save task.");
    } finally {
      setSaving(false);
    }
  };

  // Quick Status Change (Buttons or Drag)
  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const { error: updateErr } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId);

      if (updateErr) throw updateErr;

      await logActivity(
        "Status Changed",
        `Moved "${task.title}" to ${newStatus.toUpperCase()}`
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert on error
      await loadData();
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error: delErr } = await supabase.from("tasks").delete().eq("id", taskId);
      if (delErr) throw delErr;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      await logActivity("Deleted Task", `Deleted task "${title}"`);
      if (isModalOpen) setIsModalOpen(false);
    } catch (err: unknown) {
      alert("Failed to delete task: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDrop = async (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);

    if (taskId) {
      await handleUpdateStatus(taskId, colId);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const owner = t.owner_id ? memberMap.get(t.owner_id)?.name.toLowerCase() : "";
      const matchOwner = owner?.includes(q);
      return matchTitle || matchDesc || matchOwner;
    }
    return true;
  });

  const now = new Date();

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Kanban board & task tracking across volunteers and milestones"
        action={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80 transition shadow-sm"
          >
            <span>➕</span> New Task
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-card-border bg-card-bg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Filter:
          </span>
          <div className="flex gap-1.5">
            {["all", "critical", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                  priorityFilter === p
                    ? "bg-accent text-white"
                    : "bg-sidebar-bg text-muted hover:text-white hover:bg-sidebar-hover"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search task or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-1.5 text-xs text-white placeholder:text-muted focus:border-accent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-xs text-muted hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="rounded-xl border border-card-border bg-card-bg/40 p-4 min-h-[500px] animate-pulse"
            >
              <div className="h-6 w-32 bg-slate-700 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-28 bg-slate-800 rounded-lg" />
                <div className="h-28 bg-slate-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-center">
          <h3 className="text-lg font-semibold text-danger">Failed to load tasks</h3>
          <p className="text-sm text-muted mt-1">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const isTarget = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`rounded-xl border bg-card-bg/50 p-4 transition-all min-h-[540px] flex flex-col ${
                  col.border
                } ${isTarget ? "ring-2 ring-accent bg-accent/5" : ""}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-card-border mb-3">
                  <div className="flex items-center gap-2">
                    <span>{col.icon}</span>
                    <h3 className="font-semibold text-sm text-white">{col.title}</h3>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-muted font-medium">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Body / Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[75vh] pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-card-border/60 rounded-lg text-center p-4 text-muted">
                      <span className="text-2xl mb-1">📭</span>
                      <p className="text-xs">No tasks in {col.title}</p>
                      <p className="text-[11px] text-muted/70 mt-0.5">
                        Drag cards here or click + New Task
                      </p>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const owner = task.owner_id ? memberMap.get(task.owner_id) : null;
                      const deadlineDate = task.deadline ? new Date(task.deadline) : null;
                      const isOverdue =
                        deadlineDate && deadlineDate < now && task.status !== "done";
                      const pStyle = PRIORITY_COLORS[task.priority];
                      const depTask = task.depends_on ? taskMap.get(task.depends_on) : null;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => handleOpenEdit(task)}
                          className={`group rounded-lg border bg-sidebar-bg/90 p-3.5 shadow-sm transition hover:shadow-md hover:border-accent/40 cursor-grab active:cursor-grabbing ${
                            isOverdue
                              ? "border-red-500/40 hover:border-red-500"
                              : "border-card-border"
                          }`}
                        >
                          {/* Top Row: Priority & Overdue Tag */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                            >
                              {task.priority}
                            </span>
                            {isOverdue && (
                              <span className="rounded bg-red-950 text-red-400 border border-red-800 text-[10px] px-1.5 py-0.5 font-bold animate-pulse">
                                ⚠️ OVERDUE
                              </span>
                            )}
                          </div>

                          {/* Task Title */}
                          <h4 className="font-semibold text-sm text-white group-hover:text-accent-light transition line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Description snippet */}
                          {task.description && (
                            <p className="text-xs text-muted mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Dependency pill */}
                          {depTask && (
                            <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-900/60 rounded px-2 py-0.5 truncate">
                              🔗 Blocks on: {depTask.title}
                            </div>
                          )}

                          {/* Meta: Owner & Deadline */}
                          <div className="mt-3 pt-2.5 border-t border-card-border/60 flex items-center justify-between text-xs text-muted">
                            <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                              <div className="h-5 w-5 rounded-full bg-accent/20 text-accent-light flex items-center justify-center text-[10px] font-bold">
                                {owner ? owner.name[0].toUpperCase() : "?"}
                              </div>
                              <span className="truncate text-slate-300">
                                {owner ? owner.name : "Unassigned"}
                              </span>
                            </div>

                            {deadlineDate && (
                              <span
                                className={`text-[11px] font-medium ${
                                  isOverdue ? "text-red-400" : "text-muted"
                                }`}
                              >
                                ⏰{" "}
                                {deadlineDate.toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>

                          {/* Quick Status Shift Buttons */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2.5 pt-2 border-t border-card-border/40 flex items-center justify-between gap-1"
                          >
                            <span className="text-[10px] text-muted">Move:</span>
                            <div className="flex gap-1">
                              {STATUS_COLUMNS.map((sc) => (
                                <button
                                  key={sc.id}
                                  type="button"
                                  disabled={task.status === sc.id}
                                  onClick={() => handleUpdateStatus(task.id, sc.id)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                                    task.status === sc.id
                                      ? "bg-accent text-white font-bold"
                                      : "bg-sidebar-hover text-muted hover:text-white"
                                  }`}
                                  title={`Move to ${sc.title}`}
                                >
                                  {sc.title.split(" ")[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-card-border bg-card-bg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-danger/10 border border-danger/30 p-3 text-xs text-danger">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Finalize catering menu"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details, requirements, or links..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assignee (Owner)
                  </label>
                  <select
                    value={formData.owner_id}
                    onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as Priority })
                    }
                    className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as TaskStatus })
                    }
                    className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="doing">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Depends On (Pre-requisite task)
                </label>
                <select
                  value={formData.depends_on}
                  onChange={(e) => setFormData({ ...formData, depends_on: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                >
                  <option value="">None (Independent)</option>
                  {tasks
                    .filter((t) => !editingTask || t.id !== editingTask.id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.status})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-card-border mt-4">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(editingTask.id, editingTask.title)}
                    className="text-xs text-danger hover:underline"
                  >
                    Delete Task
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/80 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
