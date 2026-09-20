"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setError("");
    setDemoLoading(true);
    try {
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Demo Judge", email: "demo@convene.ai" }),
      });
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@convene.ai" }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Demo sign-in failed.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Convene<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Free · No Password Needed
              </div>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 text-center">
              Get instant access to your AI club command center.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Karan Singh"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </p>
              )}

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span className="text-xs text-slate-400">or</span>
              <span className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Try Demo */}
            <button
              id="signup-try-demo"
              type="button"
              onClick={handleDemo}
              disabled={demoLoading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading demo…
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Try demo
                </>
              )}
            </button>

            {/* Privacy note */}
            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              We only store your name and email. No passwords.
            </p>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Already registered?{" "}
              </span>
              <Link
                href="/login"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        Convene AI · Open Source under MIT License
      </footer>
    </main>
  );
}
