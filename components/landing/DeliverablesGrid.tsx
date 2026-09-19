"use client";

import React from "react";
import {
  CalendarCheck,
  Users,
  MessageSquareText,
  UserCheck,
  ShieldAlert,
  FolderSearch,
  Megaphone,
  Layers,
} from "lucide-react";

export function DeliverablesGrid() {
  const deliverables = [
    {
      icon: CalendarCheck,
      title: "AI-Assisted Event Planning",
      desc: "Give the AI your target event date. It reverse-engineers a complete milestone timeline from D-30 to launch day.",
      tag: "Milestone Planner",
      color: "emerald",
    },
    {
      icon: Users,
      title: "Task & Volunteer Management",
      desc: "Assign duties, monitor individual workload capacity, and prevent active volunteers from burning out.",
      tag: "Team Operations",
      color: "emerald",
    },
    {
      icon: MessageSquareText,
      title: "Meeting Notes & Chat Extraction",
      desc: "Paste messy WhatsApp group chats or raw meeting minutes. The AI automatically extracts action items and due dates.",
      tag: "NLP Extraction",
      color: "emerald",
    },
    {
      icon: UserCheck,
      title: "Auto-Identification of Owners",
      desc: "Fuzzy-matches member names and nicknames against your registered club roster, assigning clear ownership.",
      tag: "Smart Matching",
      color: "emerald",
    },
    {
      icon: ShieldAlert,
      title: "Risk Detection & Explanations",
      desc: "24/7 scanner checks for overdue tasks and resource bottlenecks, explaining downstream impacts and solutions.",
      tag: "Risk Radar",
      color: "emerald",
    },
    {
      icon: FolderSearch,
      title: "Club Document Knowledge Base",
      desc: "Upload past budgets, campus permits, and charters. Semantic search answers questions with exact document citations.",
      tag: "pgvector RAG",
      color: "emerald",
    },
    {
      icon: Megaphone,
      title: "AI Context-Aware Announcements",
      desc: "Drafts precise updates for WhatsApp and email, pulling directly from live task deadlines and current progress.",
      tag: "Communication",
      color: "emerald",
    },
    {
      icon: Layers,
      title: "Interactive Kanban & Dependencies",
      desc: "3-column workflow board with explicit blocker tracking (depends_on). Prevents tasks from starting until upstream dependencies clear.",
      tag: "Task Graph",
      color: "emerald",
    },
  ];

  return (
    <section className="relative z-10 px-5 py-20 sm:px-8 bg-white border-b border-slate-200 transition-colors duration-200 dark:bg-slate-950 dark:border-slate-800">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            // WHAT WE OFFER · COMPLETE DELIVERABLES
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Everything Required to Run a College Event
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            Built directly around real-world college club operations: autonomous task planning, volunteer burnout prevention, and instant meeting extraction.
          </p>
        </div>

        {/* 8 Deliverables Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deliverables.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-2xs transition-all hover:bg-white hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    item.color === "purple"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold font-mono ${
                    item.color === "purple"
                      ? "bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                  }`}
                >
                  {item.tag}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
