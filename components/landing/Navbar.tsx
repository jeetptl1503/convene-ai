"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { SignInButton } from "./SignInButton";
import { ThemeToggle } from "./ThemeContext";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white group">
          <span>
            Convene<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-400 md:flex">
          <a href="#features" className="transition-colors hover:text-slate-900 dark:hover:text-white">
            ClubOps AI
          </a>
          <a href="#workload" className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 transition-colors hover:text-emerald-800 dark:hover:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Workload &amp; Radar
          </a>
          <a href="#demo" className="transition-colors hover:text-slate-900 dark:hover:text-white">
            Live Showcase
          </a>
          <a href="#test-drive" className="transition-colors hover:text-slate-900 dark:hover:text-white">
            Test Drive
          </a>
          <a href="#faq" className="transition-colors hover:text-slate-900 dark:hover:text-white">
            FAQ
          </a>
        </div>

        {/* CTAs */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          {/* GitHub Star Button */}
          <a
            href="https://github.com/jeetptl1503/convene-ai"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>Star</span>
            <span className="text-amber-500">★</span>
          </a>

          {/* Direct Sign in Button */}
          <SignInButton text="Sign in" className="py-1.5 px-4 text-xs font-semibold" />
        </div>
      </nav>
    </header>
  );
}
