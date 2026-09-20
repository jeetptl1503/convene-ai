import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "session";
const EXPIRY = "30d";

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
}

/** Sign a JWT and return it as a compact string. */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

/** Verify a JWT. Returns the payload or null on failure. */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
