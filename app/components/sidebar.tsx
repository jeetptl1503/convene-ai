"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/volunteers", label: "Volunteers", icon: "👥" },
  { href: "/meetings", label: "Meetings", icon: "📅" },
  { href: "/documents", label: "Documents", icon: "📄" },
  { href: "/announcements", label: "Announcements", icon: "📢" },
  { href: "/risks", label: "Risks", icon: "⚠️" },
];

interface SidebarUser {
  name: string;
  email: string;
}

interface SidebarProps {
  user?: SidebarUser | null;
}

export default function Sidebar({ user: initialUser }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<SidebarUser | null>(initialUser || null);

  useEffect(() => {
    if (!user) {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar-bg border-r border-card-border">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-card-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white font-bold text-lg">
          C
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Convene</h1>
          <p className="text-xs text-muted -mt-0.5">AI-powered ClubOps</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-muted hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-card-border p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-full bg-accent-light/20 flex items-center justify-center text-accent-light text-sm font-bold">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate" title={displayName}>
                {displayName}
              </p>
              {displayEmail && (
                <p className="text-xs text-muted truncate" title={displayEmail}>
                  {displayEmail}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="rounded-lg p-1.5 text-muted hover:bg-sidebar-hover hover:text-danger transition shrink-0"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
