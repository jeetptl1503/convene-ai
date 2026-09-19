"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

export function TestDriveSection() {
  const [scenario, setScenario] = useState(0);

  const scenarioResults = [
    {
      title: "Messy WhatsApp Meeting Notes",
      summary: "6 actionable tasks parsed · Priya workload warning caught · Audi 2 booking prioritized",
      m1Label: "TASKS EXTRACTED",
      m1Val: "06",
      m1Color: "text-emerald-700 dark:text-emerald-400",
      m2Label: "OWNERS RESOLVED",
      m2Val: "05",
      m2Color: "text-emerald-600 dark:text-emerald-400",
      m3Label: "RISKS FLAGGED",
      m3Val: "02",
      m3Color: "text-amber-600 dark:text-amber-400",
      details: "A chaotic 25-message WhatsApp meeting log was automatically converted into organized tasks with assignees, priorities, and deadlines.",
    },
    {
      title: "Sponsor Pitch Deck & Workload Bottleneck",
      summary: "3 sponsor tasks assigned · Ananya workload protected · $2,500 prize pool secured",
      m1Label: "TASKS REASSIGNED",
      m1Val: "03",
      m1Color: "text-emerald-700 dark:text-emerald-400",
      m2Label: "OWNERS CONFIRMED",
      m2Val: "03",
      m2Color: "text-emerald-600 dark:text-emerald-400",
      m3Label: "BOTTLENECKS REMOVED",
      m3Val: "01",
      m3Color: "text-emerald-700 dark:text-emerald-400",
      details: "When sponsor outreach fell behind, the AI reassigned other routine chores to available members so Ananya could focus on closing corporate sponsors.",
    },
    {
      title: "Venue Permit Delay & Dependency Blocker",
      summary: "Dean permit delay caught · 4 dependent stage & rehearsal tasks held · Admin follow-up drafted",
      m1Label: "DEPENDENT TASKS HELD",
      m1Val: "04",
      m1Color: "text-rose-600 dark:text-rose-400",
      m2Label: "DAYS OVERDUE",
      m2Val: "03",
      m2Color: "text-amber-600 dark:text-amber-400",
      m3Label: "MITIGATION ACTIONS",
      m3Val: "02",
      m3Color: "text-emerald-700 dark:text-emerald-400",
      details: "When the Dean's security clearance for Audi 2 fell behind schedule, the AI flagged all downstream dependent tasks, prevented premature vendor rentals, and drafted an escalation letter.",
    },
  ];

  return (
    <section id="test-drive" className="relative z-10 px-5 py-24 sm:px-8 bg-slate-50/50 transition-colors duration-200 dark:bg-slate-900/40">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            // INTERACTIVE TEST DRIVE
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Test 3 Real Campus Scenarios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            Select a common club dilemma to see how Convene AI responds in seconds.
          </p>
        </div>

        {/* Scenario Card */}
        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {/* Scenario Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {scenarioResults.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => setScenario(idx)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  scenario === idx
                    ? "bg-emerald-600 text-white shadow-2xs font-bold dark:bg-emerald-500 dark:text-slate-950"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Scenario Metrics */}
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {scenarioResults[scenario].m1Label}
              </span>
              <p className={`mt-2 font-mono text-4xl font-extrabold ${scenarioResults[scenario].m1Color}`}>
                {scenarioResults[scenario].m1Val}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {scenarioResults[scenario].m2Label}
              </span>
              <p className={`mt-2 font-mono text-4xl font-extrabold ${scenarioResults[scenario].m2Color}`}>
                {scenarioResults[scenario].m2Val}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {scenarioResults[scenario].m3Label}
              </span>
              <p className={`mt-2 font-mono text-4xl font-extrabold ${scenarioResults[scenario].m3Color}`}>
                {scenarioResults[scenario].m3Val}
              </p>
            </div>
          </div>

          {/* Log Output */}
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 text-xs text-slate-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-slate-200">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold mb-1">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>COMPLETED: {scenarioResults[scenario].summary}</span>
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {scenarioResults[scenario].details}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
