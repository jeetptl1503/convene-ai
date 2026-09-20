import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { signSession, SESSION_COOKIE } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name ?? "").trim();
    const rawEmail = (body.email ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!EMAIL_RE.test(rawEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase();
    const supabase = createServerClient();

    // Check for duplicates first to give a friendly message
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "That email is already registered. Please sign in instead." },
        { status: 409 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({ name, email })
      .select("id, name, email")
      .single();

    if (error || !profile) {
      console.error("[signup] insert error:", error);
      return NextResponse.json(
        { error: "Could not create account. Please try again." },
        { status: 500 }
      );
    }

    const token = await signSession({
      id: profile.id,
      name: profile.name,
      email: profile.email,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: THIRTY_DAYS,
    });
    return response;
  } catch (err) {
    console.error("[signup] unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
