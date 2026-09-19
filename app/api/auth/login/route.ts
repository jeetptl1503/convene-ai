import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = createServerClient();

    // Query user by email
    const { data: user, error: queryError } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json(
        { error: "Error checking account existence" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account with that email, please sign up" },
        { status: 400 }
      );
    }

    // Create signed session token
    const token = await signSession({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
