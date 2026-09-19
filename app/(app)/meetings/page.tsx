import PageHeader from "../../components/page-header";

export default function MeetingsPage() {
  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Schedule meetings and view AI-generated summaries"
      />
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-muted">Upcoming & Past Meetings</h2>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors">
            + Schedule Meeting
          </button>
        </div>
        <p className="text-sm text-muted">Meetings will appear here once the database is connected.</p>
      </div>
    </div>
  );
}
