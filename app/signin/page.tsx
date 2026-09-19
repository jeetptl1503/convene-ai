"use client";

import React from "react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/landing/GoogleSignInButton";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 group"
          >
            <span>
              Convene<span className="text-emerald-600">AI</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Sign-In Card Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Campus Club Operations</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Sign in with Google
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Access your club command center, manage volunteers, and orchestrate live stage flow.
            </p>

            {/* Supabase Google OAuth Button */}
            <div className="mt-8">
              <GoogleSignInButton
                mode="direct-oauth"
                text="Continue with Google"
                className="w-full h-12 text-sm font-semibold justify-center shadow-xs hover:shadow-md"
              />
            </div>

            {/* Privacy & Setup Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Redirects to account creation upon authentication</span>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                By continuing, you connect your university or club Google account to Convene AI. 100% free and open source.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        Convene AI · Open Source under MIT License
      </footer>
    </main>
  );
}
