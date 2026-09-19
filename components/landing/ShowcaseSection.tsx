"use client";

import React, { useState } from "react";
import {
  Bot,
  CalendarDays,
  MessageSquareText,
  ShieldAlert,
  Mic2,
  CircleDot,
  Check,
  Radio,
  Database,
  ListChecks,
  Users,
  Sparkles,
  Volume2,
  Clock,
} from "lucide-react";

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState(false);
  const [anchorScriptType, setAnchorScriptType] = useState<"intro" | "delay" | "closing">("intro");

  const runPrompt = (value: string) => {
    setPrompt(value);
    setReasoning(true);
    window.setTimeout(() => setReasoning(false), 900);
  };

  const tabs = [
    { label: "AI Copilot", icon: Bot, badge: "PS-3" },
    { label: "Smart Timeline", icon: CalendarDays, badge: "PS-3" },
    { label: "Chat & Note Parser", icon: MessageSquareText, badge: "PS-3" },
    { label: "Risk Radar", icon: ShieldAlert, badge: "PS-3" },
    { label: "Smart MC & Stage", icon: Mic2, badge: "PS-5" },
  ];

  return (
    <section id="demo" className="relative z-10 px-5 py-24 sm:px-8 bg-slate-50/50 transition-colors duration-200 dark:bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            // INTERACTIVE FEATURE DEMO
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Explore the Platform Hands-On
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            Click through the tabs below to see how Convene AI automates everyday club operations and keeps your stage on schedule.
          </p>
        </div>

        {/* Showcase Window Container */}
        <div className="mx-auto mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/50">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">convene-ops://demo-session</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <Radio className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Gemini 2.5 Active · Live Database Connected</span>
            </div>
          </div>

          {/* Tab Selection Bar */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-100/60 sm:grid-cols-5 dark:border-slate-800 dark:bg-slate-950/60">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(i);
                  setPrompt(null);
                  setReasoning(false);
                }}
                className={`flex min-h-14 items-center justify-center gap-2 border-r border-slate-200 px-3 text-xs font-semibold transition-all last:border-r-0 dark:border-slate-800 cursor-pointer ${
                  activeTab === i
                    ? "bg-white text-slate-900 border-b-2 border-b-emerald-600 shadow-2xs dark:bg-slate-900 dark:text-white dark:border-b-emerald-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                }`}
              >
                <tab.icon className={`h-4 w-4 shrink-0 ${activeTab === i ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                <span className="truncate">{tab.label}</span>
                <span
                  className={`hidden text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold sm:inline ${
                    tab.badge === "PS-5"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[400px] p-6 sm:p-8 bg-white dark:bg-slate-900">
            {/* TAB 0: COPILOT AGENT (PS-3) */}
            {activeTab === 0 && (
              <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">Choose an example prompt to test the autonomous agent:</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {[
                      "Assign venue setup to Karan",
                      "Check for overdue milestones",
                      "Rebalance Priya's tasks to Rohan",
                    ].map((x) => (
                      <button
                        key={x}
                        onClick={() => runPrompt(x)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:border-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                      >
                        {x}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-56 space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    {!prompt && (
                      <div className="grid h-48 place-items-center text-center text-sm text-slate-500 dark:text-slate-400">
                        <div>
                          <Bot className="mx-auto mb-2 h-8 w-8 text-emerald-600 dark:text-emerald-400 opacity-60" />
                          <p>Click any prompt above to see how the AI executes real actions in your database.</p>
                        </div>
                      </div>
                    )}

                    {prompt && (
                      <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">Your Request: </span>
                        {prompt}
                      </div>
                    )}

                    {reasoning && (
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 p-2">
                        <Sparkles className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                        <span>AI is looking up club records and updating tasks...</span>
                      </div>
                    )}

                    {prompt && !reasoning && (
                      <div className="space-y-2.5">
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/80 p-3 text-xs text-slate-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-slate-200">
                          <span className="font-bold text-emerald-800 dark:text-emerald-400">Convene Copilot: </span>
                          Done! I found the venue task, assigned it to Karan Singh, and set the status to &ldquo;Doing&rdquo; in your live database.
                        </div>
                        <div className="space-y-1.5 font-mono text-xs">
                          <div className="rounded border border-emerald-200 bg-white p-2.5 text-emerald-800 shadow-2xs dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300">
                            ✓ Action: <span className="font-bold">assign_task()</span> → Assigned &ldquo;Finalize Audi 2 Venue&rdquo; to Karan Singh
                          </div>
                          <div className="rounded border border-purple-200 bg-white p-2.5 text-purple-800 shadow-2xs dark:border-purple-900/60 dark:bg-slate-900 dark:text-purple-300">
                            ✓ Database: <span className="font-bold">tasks table</span> updated in Supabase with timestamp &amp; audit log
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Kanban Preview */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="mb-4 flex items-center justify-between text-xs text-slate-600 font-semibold dark:text-slate-400">
                    <span>LIVE TASK BOARD UPDATE</span>
                    <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">TO DO</span>
                        <span className="text-slate-400 font-medium">HIGH PRIORITY</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Sponsor Pitch Deck Follow-up</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Ananya Sharma</span>
                        <span>Due in 2 days</span>
                      </div>
                    </div>

                    {prompt && !reasoning ? (
                      <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-3.5 shadow-2xs dark:border-emerald-800/80 dark:bg-emerald-950/30">
                        <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
                          <span>IN PROGRESS (UPDATED BY AI)</span>
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Finalize Audi 2 Venue</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-emerald-800 dark:text-emerald-400">Karan Singh</span>
                          <span className="font-mono text-xs">Due Friday</span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-white/70 p-3.5 opacity-60 dark:border-slate-800 dark:bg-slate-900/60">
                        <span className="text-[11px] font-medium text-slate-400">IN PROGRESS</span>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Venue Confirmation (Waiting for agent)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: BACKWARD PLANNER (PS-3) */}
            {activeTab === 1 && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    <CircleDot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>EVENT: TECHFEST 2026 · AUDITORIUM 1</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
                    AI Worked Backwards to Create 15 Milestones
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    { day: "30 Days Before", title: "Sponsors & Budget", desc: "Send sponsorship packages & confirm budget", owner: "Ananya", done: true },
                    { day: "14 Days Before", title: "Venue & Permits", desc: "Book auditorium & get university security approval", owner: "Karan", done: true },
                    { day: "7 Days Before", title: "Wi-Fi & Stage AV", desc: "Test stage microphones, projectors & routers", owner: "Priya", done: false },
                    { day: "Event Day", title: "Live Execution", desc: "Smart Anchor scripts & real-time stage schedule", owner: "All Leads", done: false },
                  ].map((m) => (
                    <div
                      key={m.day}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-white hover:shadow-2xs dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-900"
                    >
                      <div
                        className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          m.done ? "bg-emerald-600 text-white" : "border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {m.done ? <Check className="h-4 w-4" /> : "•"}
                      </div>
                      <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">{m.day}</div>
                      <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{m.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{m.desc}</p>
                      <div className="mt-4 border-t border-slate-200 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        Lead: <strong className="text-slate-800 dark:text-slate-200">{m.owner}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: MEETING EXTRACTOR (PS-3) */}
            {activeTab === 2 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>RAW WHATSAPP CHAT / VOICE NOTE</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono">11:42 PM</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    &ldquo;Hey guys, Karan please finalize the venue agreement by Friday. Priya, can you sort the Wi-Fi router for Audi 2? The sponsor deck is still pending—maybe Ananya can take it. Also we need 3 heavy-duty power extension boards before fest morning.&rdquo;
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>AI extracted 4 tasks and matched names to your member roster</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { task: "Finalize Audi 2 venue agreement", owner: "Assigned to Karan Singh", deadline: "Due Friday", badge: "high" },
                    { task: "Configure high-speed Wi-Fi router", owner: "Assigned to Priya Patel", deadline: "Due 7 Days Before", badge: "medium" },
                    { task: "Finish Tier-1 sponsor slide deck", owner: "Assigned to Ananya Sharma", deadline: "Due 5 Days Before", badge: "critical" },
                    { task: "Procure 3 heavy-duty power boards", owner: "Unassigned (Flagged for team)", deadline: "Due 1 Day Before", badge: "todo" },
                  ].map((item) => (
                    <div
                      key={item.task}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <ListChecks className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{item.task}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.owner}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.deadline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: RISK RADAR (PS-3) */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/30">
                  <div className="flex items-center gap-2.5 font-semibold text-rose-800 dark:text-rose-300">
                    <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <span>DEADLINE ALERT: Auditorium 2 Booking Overdue by 4 Days</span>
                  </div>
                  <p className="ml-7.5 mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Why it matters: This blocks the AV team from setting up speakers, running stage rehearsals, and getting security clearance.
                  </p>
                  <div className="ml-7.5 mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-medium text-rose-700 dark:text-rose-400">Assigned: Karan Singh</span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">AI Suggested Action: Draft polite reminder to University Administration</span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                  <div className="flex items-center gap-2.5 font-semibold text-amber-900 dark:text-amber-300">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span>OVERLOAD WARNING: Priya Patel has 5 urgent tasks at the same time</span>
                  </div>
                  <p className="ml-7.5 mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Priya is assigned to Wi-Fi setup, badge printing, registration desk, and sponsor hospitality.
                  </p>
                  <div className="ml-7.5 mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-medium text-amber-800 dark:text-amber-300">Current Workload: 96%</span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">AI Recommendation: Transfer Wi-Fi setup to Rohan Verma</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SMART ANCHOR & STAGE FLOW (PS-5) */}
            {activeTab === 4 && (
              <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <Mic2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Live MC Script Generator
                    </span>
                    <div className="flex gap-1.5">
                      {(["intro", "delay", "closing"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setAnchorScriptType(mode)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                            anchorScriptType === mode
                              ? "bg-purple-600 text-white shadow-2xs dark:bg-purple-500 dark:text-white"
                              : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          {mode === "intro" ? "Speaker Intro" : mode === "delay" ? "Filler Banter" : "Closing Script"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-300 mb-2">
                      <span>TELEPROMPTER PREVIEW</span>
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                        <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        READY TO READ
                      </span>
                    </div>

                    {anchorScriptType === "intro" && (
                      <div className="rounded-lg border border-purple-200/80 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-2xs dark:border-purple-900/60 dark:bg-slate-900 dark:text-slate-200">
                        &ldquo;Innovators, creators, and builders — welcome to TechFest 2026! Before we announce the hackathon challenges, please put your hands together for our keynote guest: <strong className="text-purple-800 dark:text-purple-300 font-bold">Dr. Ramesh Roy</strong>, Pioneer of Generative Systems!&rdquo;
                      </div>
                    )}

                    {anchorScriptType === "delay" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 shadow-2xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                        &ldquo;Hey everyone, while our tech crew does a quick 2-minute projector check, let’s do a quick show of hands: how many teams are building with AI agents for the first time? Awesome! Keep those team brainstorms going, we start in 90 seconds!&rdquo;
                      </div>
                    )}

                    {anchorScriptType === "closing" && (
                      <div className="rounded-lg border border-purple-200/80 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-2xs dark:border-purple-900/60 dark:bg-slate-900 dark:text-slate-200">
                        &ldquo;What an incredible day! Over 300 hackers and 45 projects submitted. A huge thank you to our judges, faculty, and volunteer team. Please head to Audi 1 foyer for dinner and networking!&rdquo;
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Tone: High Energy &amp; Natural</span>
                      <span className="font-semibold text-purple-800 dark:text-purple-300">Reading Time: ~30-45 seconds</span>
                    </div>
                  </div>
                </div>

                {/* Stage Timeline & Delay Cascade */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>LIVE STAGE TIMELINE</span>
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div className="space-y-2.5">
                    <div className="rounded-xl border border-emerald-200 bg-white p-3 text-xs shadow-2xs dark:border-emerald-900/60 dark:bg-slate-900">
                      <div className="flex justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <span>10:00 AM · COMPLETED</span>
                        <span>ON TIME</span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">Inauguration &amp; Welcome Address</p>
                    </div>

                    <div className="rounded-xl border border-purple-300 bg-purple-50/60 p-3 text-xs shadow-2xs dark:border-purple-800/80 dark:bg-purple-950/30">
                      <div className="flex justify-between text-[11px] font-semibold text-purple-800 dark:text-purple-300">
                        <span>10:45 AM · LIVE ON STAGE</span>
                        <span className="text-amber-700 dark:text-amber-400 font-bold">+4m OVERRUN</span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">Keynote: Dr. Ramesh Roy</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs opacity-80 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>11:34 AM (AUTOMATICALLY SHIFTED)</span>
                        <span className="text-purple-700 dark:text-purple-400 font-semibold">SCHEDULE UPDATED</span>
                      </div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 mt-1">Hackathon Challenges Announcement</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
