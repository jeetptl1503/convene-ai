import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

// Public routes that never require authentication
const PUBLIC_PATHS = new Set(["/", "/login", "/signup", "/signin", "/account-creation"]);
const PUBLIC_PREFIXES = ["/api/auth/", "/_next/", "/favicon.ico"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthPage(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const session = token ? await verifySession(token) : null;

  // Logged-in users visiting login/signup → send to dashboard
  if (isAuthPage(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated visitors on protected routes → send to login
  if (!isPublic(pathname) && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match every path except:
   *  - _next/static  (static assets)
   *  - _next/image   (image optimisation)
   *  - favicon.ico
   *  - files with an extension (.png, .jpg, .svg …)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
