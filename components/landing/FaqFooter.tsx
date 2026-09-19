"use client";

import React, { useState } from "react";
import { ChevronDown, Hexagon } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function FaqFooter() {
  const faqs = [
    {
      q: "How does Convene AI help before and during an event?",
      a: "Before the event (PS-3), it turns chaotic WhatsApp voice notes into organized tasks, reverse-engineers a milestone timeline from your event date, and warns you if a volunteer is carrying too much work. On event day (PS-5), it transitions into your live stage copilot: generating teleprompter scripts for the MC and automatically updating the schedule when speakers run over.",
    },
    {
      q: "Is this just another generic ChatGPT wrapper?",
      a: "No. Regular chatbots only write text advice. Convene AI executes real actions in your database—assigning tasks, updating volunteer workloads, recalculating stage schedules, and searching your club's uploaded permission documents.",
    },
    {
      q: "What happens when a speaker runs late on stage?",
      a: "You simply click to apply the delay in the stage controller. Convene AI immediately shifts all upcoming sessions, alerts the sound booth and backstage crew, and gives the MC an entertaining filler script so there is never awkward silence.",
    },
    {
      q: "How does the member name matching work?",
      a: "When you paste a meeting note or voice note like 'Karan please finalize the venue', the AI matches 'Karan' against your registered club roster and assigns the task directly to Karan Singh with a deadline.",
    },
    {
      q: "Is this free for our college club to use?",
      a: "Yes! Convene AI is 100% free and open-source under the MIT License. Any student club can clone the GitHub repository, plug in their free Gemini API key, and launch it locally or on Vercel without paying for servers.",
    },
  ];

  return (
    <>
      {/* FAQ Section */}
      <section id="faq" className="relative z-10 border-t border-slate-200 bg-white px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              // FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Clear Questions. Straight Answers.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              Everything you and your club team need to know about how Convene AI works.
            </p>
          </div>

          <div className="mx-auto mt-14 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/50 px-6 sm:px-8 shadow-xs">
            {faqs.map((item, idx) => (
              <FaqItem key={idx} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner & Footer */}
      <footer className="relative z-10 px-5 pb-10 pt-16 sm:px-8 bg-white">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-purple-50/40 p-8 text-center shadow-sm sm:p-16">
          <Hexagon className="mx-auto h-12 w-12 fill-emerald-100 text-emerald-600" />
          
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Stop Campus Event Chaos.<br />
            <span className="text-emerald-700">Run Your Club &amp; Stage with Confidence.</span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600">
            Sign in with Google to access your club command center. 100% free and open source.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <GoogleSignInButton text="Sign in with Google" className="h-12 px-7 text-xs font-bold" />

            <a
              href="https://github.com/jeetptl1503/convene-ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Explore GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Footer Credits */}
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Convene AI</span>
            <span>·</span>
            <span>Built for ClubOps AI &amp; Smart Anchor Hackathon Tracks</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a href="https://github.com/jeetptl1503/convene-ai" target="_blank" rel="noreferrer" className="hover:text-slate-900">
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
        className="flex w-full items-center justify-between gap-4 text-left font-semibold text-slate-900 transition-colors hover:text-emerald-700"
      >
        <span className="text-sm sm:text-base">{q}</span>
        <span className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>

      {open && (
        <div className="pt-3">
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}
