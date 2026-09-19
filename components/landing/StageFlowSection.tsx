"use client";

import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Users2,
  ShieldCheck,
  GitBranch,
  ArrowDown,
  Lock,
  Unlock,
} from "lucide-react";

export function StageFlowSection() {
  const [blocked, setBlocked] = useState(false);

  return (
    <section id="workload" className="relative z-10 border-y border-slate-200 bg-white px-5 py-24 sm:px-8 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            AUTONOMOUS OPERATIONS ENGINE
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Eliminate Task Bottlenecks &amp; Volunteer Overload
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            Live dependency graph resolution (<code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400">depends_on</code>) and volunteer workload balancing ensure zero operational deadlocks and zero member burnout before event day.
          </p>
        </div>

        {/* Live Operations Simulator */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Left: Interactive Dependency Blocker Chain */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                  Interactive Dependency Graph
                </span>
              </div>
              <button
                onClick={() => setBlocked(!blocked)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                  blocked
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100 dark:border-rose-700/60 dark:bg-rose-950/50 dark:text-rose-300"
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                <span>{blocked ? "Resolve Blocker & Greenlight Schedule" : "Simulate Dean Approval Delay"}</span>
              </button>
            </div>

            {/* Dependency Chain Nodes */}
            <div className="mt-5 space-y-3">
              {/* Root Task: Venue Approval */}
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs shadow-2xs transition-colors ${
                  blocked
                    ? "border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/40"
                    : "border-emerald-200 bg-white dark:border-emerald-900/60 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {blocked ? (
                    <Lock className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Task #101: Dean Venue &amp; Sound Permit</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Owner: Karan Singh · Campus Administration
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    blocked
                      ? "bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60"
                  }`}
                >
                  {blocked ? "OVERDUE (BLOCKING)" : "APPROVED ✓"}
                </span>
              </div>

              {/* Arrow Connector */}
              <div className="flex items-center justify-center -my-1 text-slate-400 dark:text-slate-600">
                <ArrowDown className="h-4 w-4" />
                <span className="ml-1 font-mono text-[10px] uppercase">depends_on #101</span>
              </div>

              {/* Dependent Task 1: Stage AV Setup */}
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs transition-colors ${
                  blocked
                    ? "border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/30"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {blocked ? (
                    <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Task #104: Audi 2 Sound System &amp; Projector Calibration
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Assigned to Priya Patel · Equipment ready
                    </p>
                  </div>
                </div>
                <span
                  className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    blocked
                      ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
                      : "text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60"
                  }`}
                >
                  {blocked ? "BLOCKED BY #101" : "READY FOR EXECUTION"}
                </span>
              </div>

              {/* Arrow Connector */}
              <div className="flex items-center justify-center -my-1 text-slate-400 dark:text-slate-600">
                <ArrowDown className="h-4 w-4" />
                <span className="ml-1 font-mono text-[10px] uppercase">depends_on #104</span>
              </div>

              {/* Dependent Task 2: Rehearsal */}
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs transition-colors ${
                  blocked
                    ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/30"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {blocked ? (
                    <Lock className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Task #108: Full Crew Stage Rehearsal Walkthrough
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">All Club Leads &amp; Anchors</p>
                  </div>
                </div>
                <span
                  className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    blocked
                      ? "bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
                      : "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {blocked ? "CASCADED DELAY" : "SCHEDULED"}
                </span>
              </div>
            </div>

            {blocked ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>
                  <strong>Bottleneck Intercepted:</strong> Rehearsals cannot proceed until Audi 2 Dean Approval is cleared. Convene AI automatically flagged 2 dependent tasks and prevented premature setup costs!
                </span>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>All Clear:</strong> Upstream dependencies resolved. All 3 tasks greenlit for execution with zero blockages.
                </span>
              </div>
            )}
          </div>

          {/* Right: Real-Time Risk Radar Terminal */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-200 mb-4">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  24/7 AUTONOMOUS RISK RADAR
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
                  ACTIVE SCANNER
                </span>
              </div>

              {blocked ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/40">
                    <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase">
                      Deadlock Alert · Downstream Impact Analysis:
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-rose-950 dark:text-rose-200 font-medium">
                      Dean permit delay halts Audi 2 sound check, pushing back tech rehearsal by 24h. The AV crew cannot test wireless microphones without venue power clearance.
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <span className="font-bold">AI Recommended Mitigation:</span>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      Generated priority follow-up letter to Dean of Student Affairs with faculty advisor CC&apos;d. Temporary acoustic test scheduled in Room 204.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                    <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase">
                      Timeline Status: All Milestones on Track
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                      All critical paths for TechFest 2026 are cleared. 16 tasks synchronized across 8 team members with zero unassigned dependencies.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Database Check: Every 60s</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Zero Critical Risks</span>
                  </div>
                </div>
              )}
            </div>

            {/* Team Capacity Radar Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
                <span className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Volunteer Capacity Matrix
                </span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">ALL HEALTHY</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">PRIYA (AV)</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">75% LOAD</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">KARAN (LOGISTICS)</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">50% LOAD</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">ROHAN (CREW)</p>
                  <p className="text-teal-700 dark:text-teal-400 font-bold mt-0.5">25% LOAD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
