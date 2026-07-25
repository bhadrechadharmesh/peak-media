import { NextResponse } from "next/server";
import {
  getCertificate,
  certificateCount,
  type Certificate,
} from "@/data/certificates";

export const runtime = "nodejs";

// Re-exported so existing imports elsewhere keep working.
export type { Certificate };

export async function POST(req: Request) {
  try {
    const { certificateNumber } = (await req.json().catch(() => ({}))) as {
      certificateNumber?: string;
    };

    if (!certificateNumber || !certificateNumber.trim()) {
      return NextResponse.json(
        { ok: false, error: "Please enter a certificate number." },
        { status: 400 }
      );
    }

    // Simulate registry lookup latency (the client plays a cinematic animation
    // in parallel; this just ensures the backend is real).
    await new Promise((r) => setTimeout(r, 600));

    const cert = getCertificate(certificateNumber);
    if (!cert) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No certificate found for this number. Please check the ID and try again.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      certificate: cert,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[/api/verify] error", err);
    return NextResponse.json(
      { ok: false, error: "Verification service unavailable. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Peak Media Certificate Verification",
    format: "PM-INT-YYYY-####",
    count: certificateCount(),
  });
}
