export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
      <p className="mt-4 text-sm">{label}</p>
    </div>
  );
}
