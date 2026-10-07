import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "llh_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-secret-little-luxe-hamper-2026";

export interface AdminSession {
  email: string;
  expiresAt: number;
}

function signSession(data: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(data);
  return `${data}.${hmac.digest("hex")}`;
}

function verifySession(token: string): string | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const data = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);

  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(data);
  const expectedSignature = hmac.digest("hex");

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return data;
  }
  return null;
}

export async function createAdminSession(email: string): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = JSON.stringify({ email, expiresAt });
  const signedToken = signSession(Buffer.from(payload).toString("base64"));

  cookies().set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return signedToken;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = verifySession(token);
    if (!verified) return null;

    const json = Buffer.from(verified, "base64").toString("utf-8");
    const session: AdminSession = JSON.parse(json);

    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function destroyAdminSession(): Promise<void> {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
