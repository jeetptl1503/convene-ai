"use client";

import React from "react";
import { Zap, CheckCircle2, Bot, Calendar, Clock, Database, Check } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { SignInButton } from "./SignInButton";

export function Hero() {
  const coreOfferings = [
    "Tasks & Deadlines",
    "Volunteer Roster",
    "Meeting Transcripts",
    "Risk Radar",
    "Club Knowledge & RAG",
    "AI Announcements",
    "Kanban & Dependencies",
    "Autonomous DB Actions",
  ];

  return (
    <section className="relative z-10 overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:pt-36">
      <div className="mx-auto max-w-[88rem]">
        <div className="grid min-h-[600px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          {/* Left Column: Seamless Description & What We Offer */}
          <div className="text-left">
            {/* Simple Category Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Centralized AI Event Operations Platform</span>
            </div>

            {/* Main Punchy Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.12] dark:text-white">
              All your club activities &amp; team operations.{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
                Unified in one place.
              </span>
            </h1>

            {/* Seamless, Direct Description */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
              Convene AI brings your <strong className="text-slate-900 dark:text-white">tasks, volunteers, meetings, deadlines, documents, risks, and announcements</strong> into
              one centralized command center. An autonomous AI agent that takes <strong className="text-slate-900 dark:text-white">real database actions</strong>—not just generates text.
            </p>

            {/* What We Offer - Direct Deliverables Checklist */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {coreOfferings.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <SignInButton text="Sign in to Dashboard" showArrow variant="primary" className="h-12 px-7 text-sm font-semibold shadow-md shadow-emerald-600/20" />

              <a
                href="https://github.com/jeetptl1503/convene-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Explore GitHub Repository</span>
                <span className="text-amber-500 font-bold">★</span>
              </a>
            </div>

            {/* Simplicity & Value Guarantee */}
            <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Instant trial access · Direct command center routing</span>
            </p>
          </div>

          {/* Right Column: Clear Command Center Mockup */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-100/50 to-teal-100/50 blur-xl opacity-70 dark:from-emerald-950/40 dark:to-teal-950/30" />

            <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-2xl dark:shadow-black/60">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">Convene Live Operations</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Event Active
                </span>
              </div>

              {/* Event Summary Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>TechFest 2026 · Main Auditorium</span>
                </div>
                <div className="flex items-center gap-3 font-medium text-slate-600 text-[11px] dark:text-slate-400">
                  <span>8 Volunteers Active</span>
                  <span>·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">16 Tasks Tracked</span>
                </div>
              </div>

              {/* Split Preview: Workload Radar & Autonomous Agent */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {/* Volunteer Workload Radar */}
                <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4 dark:border-teal-900/50 dark:bg-teal-950/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-teal-900 dark:text-teal-300">
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      Workload Radar
                    </span>
                    <span className="rounded bg-teal-200/60 px-1.5 py-0.5 text-[10px] text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">Burnout Guard</span>
                  </div>

                  <div className="mt-3 rounded-lg border border-teal-200/70 bg-white p-3 shadow-2xs dark:border-teal-900/60 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-teal-700 dark:text-teal-400">Priya Patel (Tech Lead)</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Rebalanced ✓</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Wi-Fi &amp; AV Network Setup</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      Transferred to <strong className="text-slate-800 dark:text-slate-200 font-semibold">Rohan Verma</strong> · Priya load normalized to 60%
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-teal-800 dark:text-teal-300">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" /> Auto-Balanced
                    </span>
                    <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold">No Overloads</span>
                  </div>
                </div>

                {/* ClubOps Agent */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <Bot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      Autonomous Copilot
                    </span>
                    <span className="rounded bg-emerald-200/60 px-1.5 py-0.5 text-[10px] text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">Auto Actions</span>
                  </div>

                  <div className="mt-3 rounded-lg border border-emerald-200/70 bg-white p-3 shadow-2xs dark:border-emerald-900/60 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">TASK UPDATED</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Audi 2 Sound Check</p>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                      Assigned to <strong className="text-slate-800 dark:text-slate-200">Karan Singh</strong> · Status: Doing
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" /> Database Updated
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Real Supabase Sync</span>
                  </div>
                </div>
              </div>

              {/* Status Footer Line */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>Direct Supabase &amp; Gemini actions (Not hypothetical chat)</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">All Systems Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
