import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface ContactBody {
  name?: string;
  email?: string;
  company?: string;
  services?: string[];
  budget?: string;
  message?: string;
  date?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ContactBody;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your name." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "A valid work email is required." },
        { status: 400 }
      );
    }

    // Simulate processing latency for realistic UX
    await new Promise((r) => setTimeout(r, 700));

    // In production this would persist to a CRM / database and notify the team.
    console.log("[Peak Media] New lead:", {
      name,
      email,
      company: body.company ?? null,
      services: body.services ?? [],
      budget: body.budget ?? null,
      date: body.date ?? null,
      message: body.message ?? null,
      at: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Thanks! A senior strategist will reach out within 1 business day.",
    });
  } catch (err) {
    console.error("[/api/contact] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
