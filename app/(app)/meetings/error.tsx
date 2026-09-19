"use client";
import ErrorState from "../../components/error-state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState message="Failed to load meetings." retry={reset} />;
}
