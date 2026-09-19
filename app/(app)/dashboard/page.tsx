import PageHeader from "../../components/page-header";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your event operations"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tasks", value: "12", icon: "✅", color: "bg-accent/10 text-accent-light" },
          { label: "Active Volunteers", value: "8", icon: "👥", color: "bg-success/10 text-success" },
          { label: "Open Risks", value: "3", icon: "⚠️", color: "bg-warning/10 text-warning" },
          { label: "Upcoming Meetings", value: "2", icon: "📅", color: "bg-danger/10 text-danger" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{stat.label}</p>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-card-border bg-card-bg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <p className="text-sm text-muted">Activity feed will appear here once the database is connected.</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card-bg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h2>
          <p className="text-sm text-muted">Deadline tracking will appear here once the database is connected.</p>
        </div>
      </div>
    </div>
  );
}
