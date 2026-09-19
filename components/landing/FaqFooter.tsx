"use client";

import React, { useState } from "react";
import { ChevronDown, Hexagon } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { SignInButton } from "./SignInButton";

export function FaqFooter() {
  const faqs = [
    {
      q: "How does Convene AI transform college club operations?",
      a: "It automates every phase of club event management: converting messy WhatsApp chats into assigned Kanban tasks, reverse-engineering a complete milestone timeline from your event date (D-30 to launch day), monitoring volunteer capacity to prevent burnout, and running a 24/7 AI Risk Radar that spots blocked dependencies before they derail your timeline.",
    },
    {
      q: "Is this just another generic ChatGPT wrapper?",
      a: "No. Regular chatbots only write text advice. Convene AI executes real actions in your Supabase database—creating tasks, reassigning duties, tracking task dependencies (depends_on), scanning project risks, and querying your club's uploaded permission documents using pgvector semantic search.",
    },
    {
      q: "How does the AI prevent volunteer burnout?",
      a: "Convene tracks the workload capacity of every volunteer on your roster. When an active volunteer carries more tasks than their safe capacity (e.g. 4+ critical duties), the Risk Radar flags an overload alert and enables a 1-click rebalance to transfer tasks to teammates with available bandwidth.",
    },
    {
      q: "How does member name matching work?",
      a: "When you paste a meeting note or WhatsApp chat like 'Karan please finalize the venue', the AI fuzzy-matches 'Karan' against your registered club roster, assigns the task directly to Karan Singh in Supabase, and extracts deadlines and priorities.",
    },
    {
      q: "Is this free for our college club to use?",
      a: "Yes! Convene AI is 100% free and open-source under the MIT License. Any student club can clone the GitHub repository, connect their Supabase project and free Gemini API key, and deploy it locally or on Vercel.",
    },
  ];

  return (
    <>
      {/* FAQ Section */}
      <section id="faq" className="relative z-10 border-t border-slate-200 bg-white px-5 py-24 sm:px-8 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              // FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Clear Questions. Straight Answers.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
              Everything you and your club team need to know about how Convene AI works.
            </p>
          </div>

          <div className="mx-auto mt-14 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/50 px-6 sm:px-8 shadow-2xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60">
            {faqs.map((item, idx) => (
              <FaqItem key={idx} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner & Footer */}
      <footer className="relative z-10 px-5 pb-10 pt-16 sm:px-8 bg-white transition-colors duration-200 dark:bg-slate-950">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50/40 p-8 text-center shadow-2xs dark:border-slate-800 dark:bg-gradient-to-br dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20 sm:p-16">
          <Hexagon className="mx-auto h-12 w-12 fill-emerald-100 text-emerald-600 dark:fill-emerald-950/50 dark:text-emerald-400" />
          
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Stop Campus Event Chaos.<br />
            <span className="text-emerald-700 dark:text-emerald-400">Run Your Club Operations with Confidence.</span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Access your club command center in one click. 100% free and open source.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <SignInButton text="Sign in to Dashboard" showArrow variant="primary" className="h-12 px-8 text-xs font-bold shadow-md shadow-emerald-600/20" />

            <a
              href="https://github.com/jeetptl1503/convene-ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Explore GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Footer Credits */}
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Convene AI</span>
            <span>·</span>
            <span>Built for Autonomous Club Operations &amp; Campus Event Planning</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a href="https://github.com/jeetptl1503/convene-ai" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              GitHub Source
            </a>
            <span>·</span>
            <span>Open Source under MIT License</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 text-left font-semibold text-slate-900 transition-colors hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400 cursor-pointer"
      >
        <span className="text-sm sm:text-base">{q}</span>
        <span className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>

      {open && (
        <div className="pt-3">
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-400">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}
