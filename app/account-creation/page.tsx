"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
  User,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function AccountCreationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Default pre-populated with realistic campus club demo data
  const [formData, setFormData] = useState({
    fullName: "Karan Singh",
    email: "karan.singh@university.edu",
    role: "Club President",
    clubName: "Tech & Coding Society",
    eventName: "TechFest 2026",
    eventDate: "2026-10-24",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save basic club profile to local storage for immediate session reflection
    if (typeof window !== "undefined") {
      localStorage.setItem("convene_club_profile", JSON.stringify(formData));
    }

    setTimeout(() => {
      // Direct transition to the club dashboard
      router.push("/dashboard");
    }, 600);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="mx-auto w-full max-w-2xl">
        {/* Top Brand Bar */}
        <div className="text-center mb-8">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Convene<span className="text-emerald-600">AI</span>
          </span>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Account Onboarding</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Create Your Club Account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Set up your organization and link your upcoming campus event to initialize your AI command center.
          </p>
        </div>

        {/* Account Creation Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Lead Details */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Account Lead Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="mt-1.5 relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                    />
                    <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Primary Club Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Club President">Club President / Lead</option>
                    <option value="Event Convener">Event Convener</option>
                    <option value="Operations Manager">Operations &amp; Logistics Lead</option>
                    <option value="Stage &amp; AV Lead">Stage &amp; AV Coordinator</option>
                    <option value="Volunteer Lead">Volunteer Coordinator</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700">
                  Google Account Email
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-mono text-slate-800 font-medium">
                    {formData.email}
                  </span>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Google Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Club & Event Setup */}
            <div className="border-t border-slate-100 pt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Club &amp; Event Workspace
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Club or Society Name
                  </label>
                  <div className="mt-1.5 relative">
                    <input
                      type="text"
                      required
                      value={formData.clubName}
                      onChange={(e) =>
                        setFormData({ ...formData, clubName: e.target.value })
                      }
                      placeholder="e.g. IEEE Student Branch"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                    />
                    <Building2 className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Target Event Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({ ...formData, eventName: e.target.value })
                    }
                    placeholder="e.g. TechFest 2026"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Event Date
                </label>
                <div className="mt-1.5 relative">
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Used by the Gemini Backward Planner to reverse-engineer chronological milestones.
                </p>
              </div>
            </div>

            {/* Submission CTA */}
            <div className="border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                <span>
                  {submitting
                    ? "Setting up Workspace..."
                    : "Complete Setup & Launch Dashboard"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>Stores configuration and directs to your personal club dashboard</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
