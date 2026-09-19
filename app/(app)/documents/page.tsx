import PageHeader from "../../components/page-header";

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Documents"
        description="Store and search event documents with AI-powered retrieval"
      />
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search documents..."
            className="rounded-lg border border-card-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent w-64"
          />
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors">
            + Upload Document
          </button>
        </div>
        <p className="text-sm text-muted">Documents will appear here once the database is connected.</p>
      </div>
    </div>
  );
}
