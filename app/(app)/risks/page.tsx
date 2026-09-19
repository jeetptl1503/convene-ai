import PageHeader from "../../components/page-header";

export default function RisksPage() {
  return (
    <div>
      <PageHeader
        title="Risks"
        description="AI-detected risks and suggested mitigations for your event"
      />
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {["All", "High", "Medium", "Low", "Resolved"].map((filter) => (
              <button
                key={filter}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:bg-sidebar-hover hover:text-white transition-colors first:bg-accent first:text-white"
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors">
            🔍 Scan for Risks
          </button>
        </div>
        <p className="text-sm text-muted">Risks will appear here once the database is connected and the AI risk scanner is enabled.</p>
      </div>
    </div>
  );
}
