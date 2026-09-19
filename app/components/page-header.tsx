export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
