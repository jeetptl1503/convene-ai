"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

interface SignInButtonProps {
  className?: string;
  text?: string;
  showArrow?: boolean;
  variant?: "primary" | "secondary" | "subtle";
}

export function SignInButton({
  className = "",
  text = "Sign in",
  showArrow = false,
  variant = "primary",
}: SignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Direct redirect to dashboard
    router.push("/dashboard");
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";
      case "subtle":
        return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50";
      case "primary":
      default:
        return "bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs hover:shadow-md hover:shadow-emerald-600/20 active:scale-95 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 font-semibold";
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer disabled:opacity-75 ${getVariantStyles()} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          <span>Entering Dashboard...</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          {showArrow && <ArrowRight className="h-3.5 w-3.5 shrink-0" />}
        </>
      )}
    </button>
  );
}
