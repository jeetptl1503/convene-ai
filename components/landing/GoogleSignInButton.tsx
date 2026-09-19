"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "./GoogleIcon";
import { supabase } from "@/lib/supabase/client";

interface GoogleSignInButtonProps {
  className?: string;
  text?: string;
  mode?: "redirect-to-signin" | "direct-oauth";
}

export function GoogleSignInButton({
  className = "",
  text = "Sign in with Google",
  mode = "redirect-to-signin",
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (mode === "redirect-to-signin") {
      router.push("/signin");
      return;
    }

    try {
      setLoading(true);
      const isPlaceholder =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

      if (isPlaceholder) {
        // Direct seamless flow to account creation if Supabase OAuth isn't provisioned yet
        router.push("/account-creation");
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/account-creation`,
        },
      });

      if (error) {
        // Fallback directly to account creation
        router.push("/account-creation");
      }
    } catch {
      router.push("/account-creation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm active:scale-95 disabled:opacity-70 cursor-pointer ${className}`}
    >
      <GoogleIcon className="h-4 w-4 shrink-0" />
      <span>{loading ? "Connecting..." : text}</span>
    </button>
  );
}
