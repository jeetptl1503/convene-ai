"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Member, Task } from "@/types/database";

export default function VolunteersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Add Volunteer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savingVolunteer, setSavingVolunteer] = useState(false);
  const [volFormData, setVolFormData] = useState({
    name: "",
    email: "",
    role: "Volunteer",
    skills: "",
  });
  const [volFormError, setVolFormError] = useState<string | null>(null);

  // Reassign Task Modal
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [selectedTaskToReassign, setSelectedTaskToReassign] = useState<string>("");
  const [targetVolunteerId, setTargetVolunteerId] = useState<string>("");
  const [reassignError, setReassignError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [membersRes, tasksRes] = await Promise.all([
        supabase
          .from("members")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID)
          .order("name", { ascending: true }),
        supabase
          .from("tasks")
          .select("*")
          .eq("event_id", DEMO_EVENT_ID),
      ]);

      if (membersRes.error) throw membersRes.error;
      if (tasksRes.error) throw tasksRes.error;

      setMembers(membersRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (err: unknown) {
      console.error("Error loading volunteers:", err);
      setError(err instanceof Error ? err.message : "Failed to load volunteers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open-task counts per volunteer (status !== 'done')
  const openTasksByMember = new Map<string, Task[]>();
  tasks.forEach((t) => {
    if (t.owner_id && t.status !== "done") {
      const list = openTasksByMember.get(t.owner_id) || [];
      list.push(t);
      openTasksByMember.set(t.owner_id, list);
    }
  });

  // Handle Add Volunteer
  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volFormData.name.trim() || !volFormData.email.trim()) {
      setVolFormError("Name and Email are required");
      return;
    }

    try {
      setSavingVolunteer(true);
      setVolFormError(null);

      const skillsArray = volFormData.skills
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const { data, error: insertErr } = await supabase
        .from("members")
        .insert({
          event_id: DEMO_EVENT_ID,
          name: volFormData.name.trim(),
          email: volFormData.email.trim(),
          role: volFormData.role.trim() || "Volunteer",
          skills: skillsArray,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      await logActivity(
        "Added Volunteer",
        `Added ${data.name} as ${data.role}`
      );

      setIsAddModalOpen(false);
      setVolFormData({ name: "", email: "", role: "Volunteer", skills: "" });
      await loadData();
    } catch (err: unknown) {
      console.error("Error adding volunteer:", err);
      setVolFormError(err instanceof Error ? err.message : "Failed to add volunteer.");
    } finally {
      setSavingVolunteer(false);
    }
  };

  // Open Reassign Modal for a specific task or volunteer
  const handleOpenReassign = (preselectedTaskId?: string) => {
    setSelectedTaskToReassign(preselectedTaskId || (tasks[0]?.id ?? ""));
    setTargetVolunteerId("");
    setReassignError(null);
    setIsReassignModalOpen(true);
  };

  // Execute Reassign
  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToReassign) {
      setReassignError("Please select a task to reassign.");
      return;
    }

    const task = tasks.find((t) => t.id === selectedTaskToReassign);
    const newOwner = members.find((m) => m.id === targetVolunteerId);

    try {
      setReassigning(true);
      setReassignError(null);

      const { error: updateErr } = await supabase
        .from("tasks")
        .update({
          owner_id: targetVolunteerId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedTaskToReassign);

      if (updateErr) throw updateErr;

      await logActivity(
        "Reassigned Task",
        `Reassigned "${task?.title}" to ${newOwner ? newOwner.name : "Unassigned"}`
      );

      setIsReassignModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      console.error("Failed to reassign task:", err);
      setReassignError(err instanceof Error ? err.message : "Failed to reassign task.");
    } finally {
      setReassigning(false);
    }
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = m.name.toLowerCase().includes(q);
    const matchEmail = m.email.toLowerCase().includes(q);
    const matchRole = m.role.toLowerCase().includes(q);
    const matchSkills = m.skills?.some((s) => s.toLowerCase().includes(q));
    return matchName || matchEmail || matchRole || matchSkills;
  });

  return (
    <div>
      <PageHeader
        title="Volunteers & Team"
        description="Monitor workload, member skills, and team task assignments"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenReassign()}
              className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-sidebar-bg px-4 py-2 text-sm font-medium text-muted hover:text-white hover:bg-sidebar-hover transition"
            >
              <span>🔄</span> Reassign Tasks
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80 transition shadow-sm"
            >
              <span>➕</span> Add Volunteer
            </button>
          </div>
        }
      />

      {/* Search & Overview Stats */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-card-border bg-card-bg p-4">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            Total Members: <strong className="text-white">{members.length}</strong>
          </span>
          <span>•</span>
          <span>
            Active Tasks:{" "}
            <strong className="text-white">
              {tasks.filter((t) => t.status !== "done").length}
            </strong>
          </span>
          <span>•</span>
          <span>
            Overloaded (&gt;4 tasks):{" "}
            <strong className="text-rose-400">
              {
                members.filter((m) => (openTasksByMember.get(m.id) || []).length > 4)
                  .length
              }
            </strong>
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name, role, skill..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-card-border bg-card-bg/40 animate-pulse p-5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-center">
          <h3 className="text-lg font-semibold text-danger">Failed to load volunteers</h3>
          <p className="text-sm text-muted mt-1">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm text-white"
          >
            Retry
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-xl border border-card-border bg-card-bg p-12 text-center text-muted">
          <span className="text-4xl mb-3 block">👥</span>
          <h3 className="text-lg font-semibold text-white">No volunteers found</h3>
          <p className="text-sm mt-1">
            {searchQuery
              ? `No members match "${searchQuery}"`
              : "Start by adding volunteers to your event team."}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white"
          >
            + Add First Volunteer
          </button>
        </div>
      ) : (
        /* Volunteer Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const memberOpenTasks = openTasksByMember.get(member.id) || [];
            const isOverloaded = memberOpenTasks.length > 4;

            return (
              <div
                key={member.id}
                className={`rounded-xl border bg-card-bg p-5 transition flex flex-col justify-between hover:border-accent/40 ${
                  isOverloaded
                    ? "border-rose-500/50 shadow-sm shadow-rose-950/20"
                    : "border-card-border"
                }`}
              >
                <div>
                  {/* Top Header: Avatar + Info + Overload Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/20 text-accent-light flex items-center justify-center font-bold text-base">
                        {member.name[0]?.toUpperCase() || "V"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-base leading-tight">
                          {member.name}
                        </h4>
                        <p className="text-xs text-muted">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Role & Overload Badge */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-sidebar-hover px-2 py-0.5 text-xs font-medium text-slate-300">
                      {member.role}
                    </span>

                    {isOverloaded ? (
                      <span className="rounded-md bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                        ⚠️ Overloaded ({memberOpenTasks.length} open)
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-800 text-slate-400 px-2 py-0.5 text-xs">
                        {memberOpenTasks.length} open task
                        {memberOpenTasks.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>

                  {/* Skills Pills */}
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills && member.skills.length > 0 ? (
                        member.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 text-[11px] px-2 py-0.5"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted/60 italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Assigned Tasks preview */}
                  <div className="mt-4 pt-3 border-t border-card-border/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted font-medium">Assigned Tasks</span>
                      <span className="text-[11px] text-muted">
                        {memberOpenTasks.length} pending
                      </span>
                    </div>

                    {memberOpenTasks.length === 0 ? (
                      <p className="text-xs text-muted/70 italic">No open tasks assigned.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {memberOpenTasks.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between rounded bg-sidebar-bg px-2 py-1 text-xs"
                          >
                            <span className="truncate text-slate-300 max-w-[180px]">
                              {t.title}
                            </span>
                            <button
                              onClick={() => handleOpenReassign(t.id)}
                              className="text-[10px] text-accent-light hover:underline ml-2"
                              title="Reassign this task"
                            >
                              Reassign
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-end">
                  <button
                    onClick={() => handleOpenReassign()}
                    className="text-xs text-accent-light hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>🔄</span> Reassign Tasks
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Volunteer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-card-border bg-card-bg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">Add Volunteer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {volFormError && (
              <div className="mb-4 rounded-lg bg-danger/10 border border-danger/30 p-3 text-xs text-danger">
                {volFormError}
              </div>
            )}

            <form onSubmit={handleAddVolunteer} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex Johnson"
                  value={volFormData.name}
                  onChange={(e) => setVolFormData({ ...volFormData, name: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@college.edu"
                  value={volFormData.email}
                  onChange={(e) => setVolFormData({ ...volFormData, email: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
                <input
                  type="text"
                  placeholder="e.g., Logistics Lead, Design, Sponsor Coordinator"
                  value={volFormData.role}
                  onChange={(e) => setVolFormData({ ...volFormData, role: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., sound equipment, catering, photoshop"
                  value={volFormData.skills}
                  onChange={(e) => setVolFormData({ ...volFormData, skills: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVolunteer}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/80 transition disabled:opacity-50"
                >
                  {savingVolunteer ? "Adding..." : "Add Volunteer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Task Modal */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-card-border bg-card-bg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">Reassign Task</h3>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="text-muted hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {reassignError && (
              <div className="mb-4 rounded-lg bg-danger/10 border border-danger/30 p-3 text-xs text-danger">
                {reassignError}
              </div>
            )}

            <form onSubmit={handleReassign} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Task to Reassign
                </label>
                <select
                  value={selectedTaskToReassign}
                  onChange={(e) => setSelectedTaskToReassign(e.target.value)}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                >
                  {tasks.map((t) => {
                    const currOwner = members.find((m) => m.id === t.owner_id);
                    return (
                      <option key={t.id} value={t.id}>
                        {t.title} — Current: {currOwner ? currOwner.name : "Unassigned"} ({t.status})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Assignee
                </label>
                <select
                  value={targetVolunteerId}
                  onChange={(e) => setTargetVolunteerId(e.target.value)}
                  className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                >
                  <option value="">Unassigned (Remove owner)</option>
                  {members.map((m) => {
                    const openCount = (openTasksByMember.get(m.id) || []).length;
                    return (
                      <option key={m.id} value={m.id}>
                        {m.name} — {m.role} ({openCount} active tasks
                        {openCount > 4 ? " - Overloaded" : ""})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reassigning}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/80 transition disabled:opacity-50"
                >
                  {reassigning ? "Updating..." : "Confirm Reassignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
