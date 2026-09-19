"use client";

import React, { useState } from "react";
import {
  Mic2,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Tv,
  CheckCircle2,
  Users2,
  Radio,
} from "lucide-react";

export function StageFlowSection() {
  const [delayed, setDelayed] = useState(false);

  return (
    <section id="stage-flow" className="relative z-10 border-y border-slate-200 bg-white px-5 py-24 sm:px-8 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 dark:border-purple-900/60 dark:bg-purple-950/50 dark:text-purple-300">
            <Mic2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            HACKATHON TRACK PS-5 DELIVERABLE
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Smart Anchor &amp; Live Stage Management
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            Live events rarely run exactly on time: speakers run long, slides take a moment to load, and the MC has to keep hundreds of students engaged. Convene AI keeps your timeline synced and feeds anchors scripts instantly.
          </p>
        </div>

        {/* Live Stage Control Simulator */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Left: Interactive Schedule Shift */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                  Live Stage Schedule Controller
                </span>
              </div>
              <button
                onClick={() => setDelayed(!delayed)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                  delayed
                    ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/50 dark:text-amber-300"
                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                <span>{delayed ? "Reset to Original Schedule" : "Simulate Speaker Running 15 Mins Over"}</span>
              </button>
            </div>

            {/* Agenda Timeline List */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-3.5 text-xs shadow-2xs dark:border-emerald-900/60 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">09:30 AM — Attendee Check-In &amp; Welcome Kits</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Volunteers: Rohan &amp; Sarah · 340 students checked in</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
                  COMPLETED ON TIME
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 text-xs shadow-2xs dark:border-purple-900/60 dark:bg-purple-950/30">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">10:15 AM — Keynote Speech (Prof. Anirudh Sen)</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Topic: Building Intelligent Systems</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    delayed
                      ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
                      : "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60"
                  }`}
                >
                  {delayed ? "RUNNING 15 MINS OVER" : "LIVE ON STAGE"}
                </span>
              </div>

              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs transition-colors ${
                  delayed
                    ? "border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/30"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {delayed ? "11:30 AM (Shifted +15 mins)" : "11:15 AM"} — Hackathon Challenge Release
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Host: Club President Jeet Patel · Slides ready on stage laptop
                  </p>
                </div>
                <span className="font-mono text-[11px] text-slate-600 font-medium dark:text-slate-400">
                  {delayed ? "AUTO-ADJUSTED" : "UPCOMING"}
                </span>
              </div>

              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs transition-colors ${
                  delayed
                    ? "border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/30"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {delayed ? "01:45 PM (Shifted +15 mins)" : "01:30 PM"} — Lunch &amp; Team Formations
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Catering and lunch counter team notified</p>
                </div>
                <span className="font-mono text-[11px] text-slate-600 font-medium dark:text-slate-400">
                  {delayed ? "AUTO-ADJUSTED" : "UPCOMING"}
                </span>
              </div>
            </div>

            {delayed && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>What just happened:</strong> Because the keynote speaker ran 15 minutes long, the AI automatically pushed back the rest of the schedule by 15 minutes, alerted the AV team, and updated the MC prompter!
                </span>
              </div>
            )}
          </div>

          {/* Right: Dynamic Anchor Script Display */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-300 mb-4">
                <span className="flex items-center gap-1.5">
                  <Tv className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  STAGE MC TELEPROMPTER SCREEN
                </span>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60">
                  LIVE ON STAGE
                </span>
              </div>

              {delayed ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase">
                      Instant Filler Script (AI Generated):
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-amber-950 dark:text-amber-200 font-medium">
                      &ldquo;Prof. Sen shared so many great insights that we gave him an extra 10 minutes to wrap up that machine learning demo! While we get the stage ready for our next session, let’s do a quick show of hands: how many teams have already picked their project idea? We roll out the challenges at 11:30 AM sharp!&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Tone: Natural, Fun &amp; Engaging</span>
                    <span className="font-semibold text-amber-800 dark:text-amber-400">Time to fill: ~90 seconds</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
                    <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300 uppercase">
                      Speaker Introduction Script:
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                      &ldquo;Ladies and gentlemen, our keynote guest has filed over 14 patents in distributed artificial intelligence and currently heads innovation at National Labs. Please give a warm campus welcome to <strong className="text-purple-900 dark:text-purple-300 font-bold">Prof. Anirudh Sen</strong>!&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Generated from speaker profile</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Reading time: ~30 seconds</span>
                  </div>
                </div>
              )}
            </div>

            {/* Crew Synchronization Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
                <Users2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Team Coordination (PS-5)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">AV &amp; SOUND</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">MIC 2 LIVE</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">MC TELEPROMPTER</p>
                  <p className="text-purple-700 dark:text-purple-400 font-bold mt-0.5">SCRIPT READY</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">BACKSTAGE</p>
                  <p className="text-amber-700 dark:text-amber-400 font-bold mt-0.5">CUE NEXT SPEAKER</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
