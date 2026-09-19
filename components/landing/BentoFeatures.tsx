"use client";

import React, { useState } from "react";
import {
  GitBranch,
  MessageSquareText,
  Users,
  Search,
  RefreshCw,
  Check,
  Layers,
  Megaphone,
  ShieldCheck,
  Lock,
} from "lucide-react";

export function BentoFeatures() {
  const [rebalanced, setRebalanced] = useState(false);

  return (
    <section id="features" className="relative z-10 px-5 py-24 sm:px-8 bg-slate-50/50 transition-colors duration-200 dark:bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            // COMPLETE FEATURE SUITE
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Everything Your Club Needs in One Place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            Designed specifically for college clubs: solve chaotic pre-event prep and run your operations with zero blindspots.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
          {/* Card 1: Autonomous Action Engine (Real Tools) - Span 2 */}
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 md:col-span-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">An AI That Actually Does Real Work</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Unlike generic chat assistants that only write text, Convene AI executes real actions. When you ask it to assign a task, flag a risk, or rebalance schedules, it updates your live database directly with a clear audit log.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 font-mono text-xs">
              {[
                "create_task()",
                "assign_task()",
                "update_task_status()",
                "set_deadline()",
                "add_volunteer()",
                "create_announcement_draft()",
                "run_risk_scan()",
                "search_documents()",
              ].map((tool) => (
                <div
                  key={tool}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-emerald-800 font-semibold dark:border-slate-800 dark:bg-slate-950/60 dark:text-emerald-400 truncate"
                  title={tool}
                >
                  ✓ {tool}
                </div>
              ))}
            </div>
          </article>

          {/* Card 2: WhatsApp & Meeting Note Parser */}
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Turn WhatsApp Chats into Tasks</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Paste meeting minutes, WhatsApp group chat exports, or messy bullet notes. The AI extracts action items, identifies who was mentioned, and creates organized cards on your task board.
            </p>
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>4 tasks created automatically</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">Team member names matched with 98% accuracy</p>
            </div>
          </article>

          {/* Card 3: Volunteer Workload Balancer */}
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Prevent Volunteer Burnout</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Spot overworked volunteers before they drop out. The system checks how many urgent tasks each member holds and lets you rebalance with one click.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">Priya Patel (Tech Lead)</span>
                <span className={rebalanced ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-rose-600 dark:text-rose-400 font-bold"}>
                  {rebalanced ? "60% Load (Safe)" : "96% OVERLOADED"}
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: rebalanced ? "60%" : "96%" }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    rebalanced ? "bg-emerald-600 dark:bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              </div>
              <button
                onClick={() => setRebalanced(!rebalanced)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>{rebalanced ? "Workload Rebalanced ✓" : "Rebalance Tasks Now"}</span>
              </button>
            </div>
          </article>

          {/* Card 4: Event Knowledge Base RAG */}
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Instant Club Knowledge Base</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Upload past budgets, campus approval forms, and venue guidelines. Ask any question and get the exact answer backed by document citations.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">&ldquo;Who approved the sound check time?&rdquo;</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Dean_Approval_Signed.pdf</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Page 2 Verified</span>
              </div>
            </div>
          </article>

          {/* Card 5: Interactive Kanban & Dependencies */}
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kanban &amp; Dependencies</h3>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                depends_on
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              3-column workflow board with explicit blocker tracking. Blocked tasks are flagged so dependencies are cleared before work begins.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>Audi 2 Sound Check</span>
                <span className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                  <Lock className="h-3 w-3" /> BLOCKED
                </span>
              </div>
              <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">Blocked By: Dean Permit (Task #101)</span>
            </div>
          </article>

          {/* Card 6: AI Context-Aware Announcements - Span 2 */}
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 md:col-span-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Megaphone className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Context-Aware Announcements with WhatsApp Export</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Generate broadcast-ready updates for attendees, volunteers, or faculty sponsors. Convene pulls live progress and upcoming deadlines directly from your database and formats messages in clean WhatsApp markdown.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Live Database Grounded
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                WhatsApp Markdown Syntax
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 font-medium dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                1-Click Clipboard Export
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
