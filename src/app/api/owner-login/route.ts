import { NextResponse } from "next/server";
import {
  OWNER_COOKIE_NAME,
  createSessionToken,
  isOwnerSessionValid,
} from "@/lib/ownerAuth";

export async function GET() {
  const valid = await isOwnerSessionValid();
  return NextResponse.json({ authenticated: valid });
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const rawEnv = process.env.OWNER_PASSWORD;
    if (!rawEnv) {
      console.error("OWNER_PASSWORD environment variable is not set.");
      return NextResponse.json(
        { success: false, message: "Owner login is not configured." },
        { status: 500 },
      );
    }
    const expectedPassword = rawEnv.trim().replace(/^["']|["']$/g, "");

    if (
      expectedPassword &&
      typeof password === "string" &&
      password.trim() === expectedPassword
    ) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(OWNER_COOKIE_NAME, createSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return response;
    }

    // Small delay slows down brute-force password guessing
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json(
      { success: false, message: "Incorrect owner password." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(OWNER_COOKIE_NAME);
  return response;
}
