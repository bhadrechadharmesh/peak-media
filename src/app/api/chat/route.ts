import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are "Peak", the friendly AI concierge for Peak Media — a premium digital marketing agency that engineers brand growth through branding, SEO, social media marketing, paid advertising, web design, and content creation.

Your job: warmly qualify visitors, answer questions about Peak Media's services, process, pricing tiers (Starter ~$4,900/mo, Growth ~$9,900/mo most popular, Scale custom), timelines (kickoff within 24h, proposal in ~5 days), and results (avg +312% ROAS, 97% retention). Encourage visitors to start a project or book a strategy call at peakmedia.agency/#contact.

Rules:
- Keep replies concise (2-4 short sentences), energetic and on-brand.
- Be specific when asked about services; redirect pricing negotiations to the contact form.
- Never invent case-study numbers beyond what's stated above; reference "our case studies" generally.
- If a request is out of scope, politely steer to booking a call.
- Do not claim to be human; you're Peak's AI concierge.`;

const FALLBACKS = [
  "Great question! I can connect you with a senior strategist who can go deep on that — want me to flag the team? You can also book a call at peakmedia.agency/#contact.",
  "Happy to help with that. The quickest path is a 20-minute strategy call so we can tailor the answer to your brand — book one at peakmedia.agency/#contact.",
  "That's exactly what we scope on our kickoff call. Drop your details at peakmedia.agency/#contact and we'll come back with a tailored take within a business day.",
];

export async function POST(req: Request) {
  try {
    const { message } = (await req.json().catch(() => ({}))) as {
      message?: string;
    };
    const text = (message ?? "").trim();

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "Message is required." },
        { status: 400 }
      );
    }

    let reply = "";
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        thinking: { type: "disabled" },
      });
      reply = completion.choices[0]?.message?.content ?? "";
    } catch (err) {
      console.error("[/api/chat] LLM error, using fallback", err);
    }

    if (!reply || !reply.trim()) {
      reply = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    }

    return NextResponse.json({ ok: true, reply: reply.trim() });
  } catch (err) {
    console.error("[/api/chat] error", err);
    return NextResponse.json(
      {
        ok: true,
        reply:
          FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)],
      },
      { status: 200 }
    );
  }
}
