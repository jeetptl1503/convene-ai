"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/page-header";
import { supabase } from "@/lib/supabase/client";
import { DEMO_EVENT_ID } from "@/lib/constants";
import type { Document } from "@/types/database";

const SAMPLE_DOCUMENT = {
  title: "HackCon 2026 – Event Guidelines & Policies",
  content: `HackCon 2026 Event Guidelines & Policies

1. VENUE & LOGISTICS
The event will be held in Auditorium 2 (Audi 2) of the Engineering Block. Doors open at 8:00 AM on Saturday. All team setup must be complete by 9:30 AM. The venue capacity is 300 people. Emergency exits are on both sides of the auditorium.

2. REGISTRATION & CHECK-IN
All participants must register on Devfolio before the event. Walk-in registrations are allowed only if capacity permits. Each participant receives a name badge, welcome kit, and Wi-Fi credentials at check-in. The registration desk operates from 8:00 AM to 10:00 AM.

3. TEAM FORMATION
Teams can have 2-4 members. Solo participants will be grouped during the icebreaker session. Each team must have at least one member who can present in English or Hindi.

4. JUDGING CRITERIA
Projects are judged on: Innovation (25%), Technical Complexity (25%), Design & UX (20%), Practicality (15%), and Presentation (15%). Judges include industry professionals, faculty advisors, and senior alumni.

5. PRIZES & AWARDS
First Place: ₹50,000 + internship opportunity with sponsor company.
Second Place: ₹30,000 + Google Cloud credits.
Third Place: ₹15,000 + swag kits.
Best UI/UX: ₹10,000.
Best Use of AI: ₹10,000.

6. CODE OF CONDUCT
All participants must follow the event's code of conduct. Harassment, plagiarism, or disruptive behavior will result in immediate disqualification. The organizing committee reserves the right to remove any participant at their discretion.

7. FOOD & REFRESHMENTS
Lunch and dinner are provided for all registered participants. Midnight snacks and energy drinks will be available in the common area. Please inform the registration desk about any dietary restrictions.

8. SUBMISSION GUIDELINES
All projects must be submitted on Devfolio by 6:00 AM Sunday. Late submissions will NOT be accepted. Each team must provide a 2-minute demo video and a README file. The source code must be in a public GitHub repository.

9. MENTORSHIP
Industry mentors will be available from 11:00 AM to 8:00 PM Saturday. Book mentor sessions at the mentor booth. Each session is 15 minutes long.

10. EMERGENCY CONTACTS
Event Coordinator: Priya Sharma — priya@hackcon.dev
Technical Lead: Karan Mehta — karan@hackcon.dev
Campus Security: +91-9876543210
Medical: Campus Health Center, Ground Floor, Admin Block.`,
};

interface Source {
  document_title: string;
  snippet: string;
  similarity: number;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload form
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadContent, setUploadContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Search / Ask
  const [askQuery, setAskQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askSources, setAskSources] = useState<Source[]>([]);
  const [askError, setAskError] = useState<string | null>(null);

  // Expanded doc
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const loadDocs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("documents")
        .select("*")
        .eq("event_id", DEMO_EVENT_ID)
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;
      setDocuments(data || []);
    } catch (err: unknown) {
      console.error("Error loading documents:", err);
      setError(err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const handleLoadSample = () => {
    setUploadTitle(SAMPLE_DOCUMENT.title);
    setUploadContent(SAMPLE_DOCUMENT.content);
    setUploadMessage(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim()) return;

    try {
      setUploading(true);
      setUploadMessage(null);

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle.trim(),
          content: uploadContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload document.");

      setUploadMessage(data.message || "Document uploaded.");
      setUploadTitle("");
      setUploadContent("");
      await loadDocs();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setUploadMessage(
        "⚠️ " + (err instanceof Error ? err.message : "Upload failed.")
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    try {
      setAsking(true);
      setAskError(null);
      setAskAnswer(null);
      setAskSources([]);

      const res = await fetch("/api/documents/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: askQuery.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to search.");

      setAskAnswer(data.answer || "No answer generated.");
      setAskSources(data.sources || []);
    } catch (err: unknown) {
      console.error("Ask error:", err);
      setAskError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Documents & Knowledge Base"
        description="Upload event guidelines, policies, and schedules. Search them with AI-powered semantic retrieval."
      />

      {/* Ask Section */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔍</span>
          <h2 className="text-base font-bold text-white">Ask the Knowledge Base</h2>
        </div>

        <form onSubmit={handleAsk} className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="e.g., What are the judging criteria? When is submission deadline?"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            className="flex-1 rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={asking || !askQuery.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/80 transition disabled:opacity-50 whitespace-nowrap"
          >
            {asking ? "Searching..." : "Search with AI"}
          </button>
        </form>

        {askError && (
          <div className="rounded-lg bg-danger/10 border border-danger/30 p-3 text-xs text-danger mb-3">
            {askError}
          </div>
        )}

        {askAnswer && (
          <div className="space-y-3">
            <div className="rounded-lg bg-sidebar-bg border border-card-border p-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {askAnswer}
            </div>

            {askSources.length > 0 && (
              <div>
                <span className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
                  Sources Retrieved ({askSources.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {askSources.map((src, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-card-bg border border-card-border/60 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-accent-light">
                          📄 {src.document_title}
                        </span>
                        <span className="text-muted text-[10px]">
                          {(src.similarity * 100).toFixed(0)}% match
                        </span>
                      </div>
                      <p className="text-slate-400 line-clamp-3">{src.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload / Paste Section */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📤</span>
            <h2 className="text-base font-bold text-white">Upload Document</h2>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            className="rounded-lg bg-sidebar-bg border border-card-border px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-accent transition"
          >
            📋 Load Sample: HackCon Guidelines
          </button>
        </div>

        {uploadMessage && (
          <div
            className={`mb-4 rounded-lg p-3 text-xs ${
              uploadMessage.startsWith("⚠️")
                ? "bg-danger/10 border border-danger/30 text-danger"
                : "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
            }`}
          >
            {uploadMessage}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g., Event Safety Protocol"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-sidebar-bg px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Document Content (Paste text)
            </label>
            <textarea
              rows={6}
              placeholder="Paste event guidelines, policies, schedules, or any reference material..."
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-sidebar-bg p-3 text-sm text-white placeholder:text-muted font-mono focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !uploadTitle.trim() || !uploadContent.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 transition shadow-md shadow-accent/20 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="animate-spin">🌀</span> Indexing & Embedding...
                </>
              ) : (
                <>
                  <span>📤</span> Upload & Index Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Past Documents */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📚</span> Document Library ({documents.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-card-bg/50 border border-card-border animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg bg-danger/10 border border-danger/30 p-4 text-center">
            <p className="text-sm text-danger">{error}</p>
            <button
              onClick={loadDocs}
              className="mt-2 text-xs text-accent-light hover:underline"
            >
              Retry
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <span className="text-3xl mb-2 block">📭</span>
            <p className="text-sm font-medium">No documents uploaded yet</p>
            <p className="text-xs mt-0.5">
              Upload event guidelines, policies, or schedules to build your knowledge base.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const isExpanded = expandedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="rounded-lg border border-card-border bg-sidebar-bg/60 p-4 transition hover:border-card-border/80"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{doc.title}</h4>
                      <p className="text-xs text-muted mt-0.5">
                        Uploaded{" "}
                        {new Date(doc.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {doc.content &&
                          ` • ${Math.ceil(doc.content.length / 4)} tokens approx.`}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedDocId(isExpanded ? null : doc.id)
                      }
                      className="text-xs text-accent-light hover:underline font-medium"
                    >
                      {isExpanded ? "Collapse ▲" : "Preview ▼"}
                    </button>
                  </div>

                  {isExpanded && doc.content && (
                    <div className="mt-3 rounded bg-black/40 border border-card-border/50 p-3 text-xs text-slate-400 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {doc.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
