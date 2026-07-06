import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Simple in-memory subscriber set (per server instance). Resets on restart.
const subscribers = new Set<string>();

export async function POST(req: Request) {
  try {
    const { email } = (await req.json().catch(() => ({}))) as { email?: string };
    const clean = (email ?? "").trim().toLowerCase();

    if (!EMAIL_RE.test(clean)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (subscribers.has(clean)) {
      return NextResponse.json({
        ok: true,
        message: "You're already on the list — watch your inbox Tuesdays.",
      });
    }

    await new Promise((r) => setTimeout(r, 500));
    subscribers.add(clean);
    console.log("[Peak Media] newsletter subscriber:", clean);

    return NextResponse.json({
      ok: true,
      message: "You're in. Check your inbox for a welcome note.",
    });
  } catch (err) {
    console.error("[/api/newsletter] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
