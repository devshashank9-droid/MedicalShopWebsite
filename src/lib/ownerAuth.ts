import crypto from "crypto";
import { cookies } from "next/headers";

export const OWNER_COOKIE_NAME = "kmh_owner_session";

function getSecret(): string {
  const raw = process.env.OWNER_SESSION_SECRET || "fallback-dev-secret-change-me";
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  const payload = String(expiresAt);
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export async function isOwnerSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(OWNER_COOKIE_NAME)?.value;
  if (!token) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  if (sig.length !== expectedSig.length) return false;
  const isValidSig = crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expectedSig)
  );
  if (!isValidSig) return false;

  return Date.now() < Number(payload);
}