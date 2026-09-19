"use client";

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

export default function Sidebar() {
  const pathname = usePathname();

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
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent-light/20 flex items-center justify-center text-accent-light text-sm font-bold">
            D
          </div>
          <div>
            <p className="text-sm font-medium text-white">Demo Club</p>
            <p className="text-xs text-muted">demo@convene.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
