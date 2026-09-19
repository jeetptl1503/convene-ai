import PageHeader from "../../components/page-header";

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Manage and track event tasks across your team"
      />
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {["All", "To Do", "Doing", "Done"].map((filter) => (
              <button
                key={filter}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:bg-sidebar-hover hover:text-white transition-colors first:bg-accent first:text-white"
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors">
            + New Task
          </button>
        </div>
        <p className="text-sm text-muted">Tasks will appear here once the database is connected.</p>
      </div>
    </div>
  );
}
