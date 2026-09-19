"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

export function TestDriveSection() {
  const [scenario, setScenario] = useState(0);

  const scenarioResults = [
    {
      title: "Messy Post-Meeting Voice Note (PS-3)",
      summary: "6 actionable tasks parsed · Priya workload warning caught · Audi 2 booking prioritized",
      m1Label: "TASKS EXTRACTED",
      m1Val: "06",
      m1Color: "text-emerald-700",
      m2Label: "OWNERS RESOLVED",
      m2Val: "05",
      m2Color: "text-emerald-600",
      m3Label: "RISKS FLAGGED",
      m3Val: "02",
      m3Color: "text-amber-600",
      details: "A 4-minute WhatsApp voice note was automatically converted into organized tasks with assignees and calendar deadlines.",
    },
    {
      title: "Urgent Sponsor Pitch Deck Deadline (PS-3)",
      summary: "3 sponsor tasks assigned · Ananya workload protected · $2,500 prize pool secured",
      m1Label: "TASKS REASSIGNED",
      m1Val: "03",
      m1Color: "text-emerald-700",
      m2Label: "OWNERS CONFIRMED",
      m2Val: "03",
      m2Color: "text-emerald-600",
      m3Label: "BOTTLENECKS REMOVED",
      m3Val: "01",
      m3Color: "text-emerald-700",
      details: "When sponsor follow-ups fell behind, the AI reassigned other routine chores so Ananya could focus on closing corporate sponsors.",
    },
    {
      title: "Speaker Overrun on Live Stage (PS-5)",
      summary: "Upcoming sessions shifted +15m · 4 crew channels alerted · Anchor given 90s filler script",
      m1Label: "SESSIONS AUTO-ADJUSTED",
      m1Val: "04",
      m1Color: "text-purple-700",
      m2Label: "CREW TEAMS NOTIFIED",
      m2Val: "03",
      m2Color: "text-purple-600",
      m3Label: "MC SCRIPTS DISPATCHED",
      m3Val: "02",
      m3Color: "text-emerald-700",
      details: "When the keynote speaker talked 15 minutes too long, the AI shifted the schedule, alerted catering, and gave the MC a fun audience prompt.",
    },
  ];

  return (
    <section id="test-drive" className="relative z-10 px-5 py-24 sm:px-8 bg-slate-50/50">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            // INTERACTIVE TEST DRIVE
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Test 3 Real Campus Scenarios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Select a common club dilemma to see how Convene AI responds in seconds.
          </p>
        </div>

        {/* Scenario Card */}
        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Scenario Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {scenarioResults.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => setScenario(idx)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  scenario === idx
                    ? "bg-emerald-600 text-white shadow-xs font-bold"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Scenario Metrics */}
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase">
                {scenarioResults[scenario].m1Label}
              </span>
              <p className={`mt-2 font-mono text-4xl font-extrabold ${scenarioResults[scenario].m1Color}`}>
                {scenarioResults[scenario].m1Val}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase">
                {scenarioResults[scenario].m2Label}
              </span>
              <p className={`mt-2 font-mono text-4xl font-extrabold ${scenarioResults[scenario].m2Color}`}>
                {scenarioResults[scenario].m2Val}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase">
                {scenarioResults[scenario].m3Label}
              </span>
              <p className={`mt-2 font-mono text-4xl font-extrabold ${scenarioResults[scenario].m3Color}`}>
                {scenarioResults[scenario].m3Val}
              </p>
            </div>
          </div>

          {/* Log Output */}
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 text-xs text-slate-800">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>COMPLETED: {scenarioResults[scenario].summary}</span>
            </div>
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              {scenarioResults[scenario].details}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
