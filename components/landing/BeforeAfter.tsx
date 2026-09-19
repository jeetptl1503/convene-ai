"use client";

import React from "react";
import { Check, X } from "lucide-react";

export function BeforeAfter() {
  const comparisons = [
    {
      before: "Tasks and action items buried under 400+ unorganized WhatsApp messages",
      after: "WhatsApp group chats and meeting notes automatically converted into assigned Kanban cards",
    },
    {
      before: "Volunteer confusion—nobody knows who is picking up the guest or checking AV",
      after: "Autonomous member fuzzy-matching with explicit ISO deadlines and owners",
    },
    {
      before: "Critical bottlenecks and sponsor deadlines discovered 48 hours too late",
      after: "24/7 AI Risk Radar scans dependencies and rebalances overloaded volunteers",
    },
    {
      before: "Key team members overwhelmed with 10+ concurrent tasks while others remain idle",
      after: "Real-time workload capacity radar with 1-click task rebalancing across active volunteers",
    },
    {
      before: "Lost past event guidelines, scattered budget spreadsheets, and missing approval letters",
      after: "Centralized club knowledge base with pgvector semantic search and exact document citations",
    },
  ];

  return (
    <section id="before-after" className="relative z-10 border-y border-slate-200 bg-white px-5 py-24 sm:px-8 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            // OPERATIONAL IMPACT
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Replace Campus Chaos with Autonomous Command
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            From milestone planning to volunteer load balancing, see how Convene AI eliminates campus chaos.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="mx-auto mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 border-b border-slate-200 text-xs sm:text-sm font-bold dark:border-slate-800">
            <div className="bg-rose-50/70 p-5 text-rose-900 flex items-center gap-2 dark:bg-rose-950/40 dark:text-rose-300">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              WhatsApp Floods + Broken Spreadsheets
            </div>
            <div className="border-l border-slate-200 bg-emerald-50/70 p-5 text-emerald-900 flex items-center gap-2 dark:border-slate-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              Convene AI (Unified Platform)
            </div>
          </div>

          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 border-b border-slate-200 text-xs sm:text-sm transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40 last:border-b-0"
            >
              <div className="p-5 text-slate-600 dark:text-slate-400 flex items-start gap-3">
                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{item.before}</span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-800 p-5 font-medium text-slate-900 dark:text-slate-200 flex items-start gap-3 bg-emerald-50/15 dark:bg-emerald-950/20">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{item.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
