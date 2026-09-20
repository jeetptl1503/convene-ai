import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { signSession, SESSION_COOKIE } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = (body.email ?? "").trim();

    if (!EMAIL_RE.test(rawEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase();
    const supabase = createServerClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        { error: "No account with that email — please sign up first." },
        { status: 404 }
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
    console.error("[login] unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
