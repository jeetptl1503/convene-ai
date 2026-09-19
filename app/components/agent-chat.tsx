"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ActionCard {
  type: string;
  summary: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: ActionCard[];
  timestamp: string;
}

const EXAMPLE_PROMPTS = [
  "Assign all logistics tasks to Karan",
  "What are the biggest risks?",
  "Create a task to print 50 posters due Friday assigned to Sneha",
  "Draft an announcement for registration deadline",
];

export default function AgentChat() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm Convene Copilot. I can take real actions in your database — assign tasks, create items, adjust deadlines, draft announcements, or run risk scans. What would you like to do?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Agent action failed");

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Done.",
        actions: data.actions_performed || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If actions were performed, refresh page data and trigger event
      if (data.actions_performed && data.actions_performed.length > 0) {
        router.refresh();
        window.dispatchEvent(new CustomEvent("convene-agent-action"));
      }
    } catch (err: unknown) {
      console.error("Agent error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Sorry, I encountered an error: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-accent hover:bg-accent-light px-4 py-3 text-white font-semibold text-sm shadow-xl shadow-accent/30 hover:scale-105 transition-all duration-200 border border-accent-light/40"
        >
          <span className="text-lg">🤖</span>
          <span>ClubOps Copilot</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Drawer / Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[380px] sm:w-[440px] h-[580px] max-h-[85vh] rounded-2xl border border-card-border bg-card-bg shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-sidebar-bg border-b border-card-border">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent-light text-base font-bold">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">
                  ClubOps AI Copilot
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium">
                  ● Autonomous DB Actions Enabled
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-white rounded-lg p-1 transition"
              title="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Example prompt chips */}
          <div className="bg-sidebar-bg/60 px-3 py-2 border-b border-card-border/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {EXAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(prompt)}
                className="rounded-full bg-card-bg border border-card-border/80 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:border-accent transition disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-white rounded-br-none shadow-sm"
                      : "bg-sidebar-bg border border-card-border text-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Action Cards */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 border-t border-card-border/60 pt-2">
                      <p className="text-[10px] font-bold text-accent-light uppercase tracking-wider">
                        ⚡ Real Database Actions Executed:
                      </p>
                      {msg.actions.map((act, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-black/40 border border-emerald-500/40 p-2 text-[11px] text-emerald-300 flex items-start gap-1.5"
                        >
                          <span className="text-xs">✓</span>
                          <span className="font-medium">{act.summary}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted/70 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start">
                <div className="rounded-2xl rounded-bl-none bg-sidebar-bg border border-card-border px-3.5 py-2.5 text-xs text-muted flex items-center gap-2">
                  <span className="animate-spin">🌀</span>
                  <span>Executing agent tools & actions...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-sidebar-bg border-t border-card-border flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot to assign, create, or scan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl border border-card-border bg-card-bg px-3.5 py-2 text-xs text-white placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent/80 transition disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
