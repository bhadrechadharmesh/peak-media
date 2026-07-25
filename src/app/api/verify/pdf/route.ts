import { NextResponse } from "next/server";
import { getCertificate, type Certificate } from "@/data/certificates";
import { qrToSvg, verifyUrlFor } from "@/lib/qr";
import { chromium } from "playwright";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ELECTRIC = "#0a84ff";
const ELECTRIC_2 = "#2b6bff";
const ELECTRIC_SOFT = "#38bdf8";

/** Build a single-page, print-ready HTML certificate from a Certificate record. */
async function certificateHtml(cert: Certificate): Promise<string> {
  const skills = cert.skills.map((s) => `<span class="skill">${escapeHtml(s)}</span>`).join("");
  const verifiedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  });
  // Real scannable QR → peakmedia.in/verify?id=<cert>
  const verifyUrl = verifyUrlFor(cert.id);
  const qrSvg = await qrToSvg(verifyUrl, { margin: 1 });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Peak Media — Certificate ${escapeHtml(cert.id)}</title>
<style>
  @page { size: 794px 1123px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 794px; height: 1123px;
    background: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1f2430;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    position: relative;
    width: 794px; min-height: 1123px;
    background: #ffffff;
    padding: 64px 72px 56px;
  }
  /* subtle electric-blue geometric corner accent (top-right) */
  .corner-accent {
    position: absolute; top: 0; right: 0; width: 220px; height: 220px;
    pointer-events: none; z-index: 0;
    background:
      linear-gradient(135deg, transparent 50%, rgba(10,132,255,0.10) 50%) ,
      repeating-linear-gradient(135deg, rgba(10,132,255,0.06) 0 8px, transparent 8px 16px);
    -webkit-mask-image: linear-gradient(225deg, #000 30%, transparent 75%);
            mask-image: linear-gradient(225deg, #000 30%, transparent 75%);
  }

  /* ---- top brand row ---- */
  .brand-row { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
  .logo {
    width: 38px; height: 38px; border-radius: 9px;
    background: linear-gradient(135deg, ${ELECTRIC}, ${ELECTRIC_2});
    display: grid; place-items: center;
    font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 19px; color: #fff;
  }
  .brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 700; color: #0b1220; letter-spacing: -0.01em; line-height: 1.1; }
  .brand-tag { font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b7280; margin-top: 2px; }
  .brand-sub { font-size: 9px; color: #9aa1ac; margin-top: 1px; }

  /* ---- header meta bar ---- */
  .meta-bar {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-top: 26px; padding-bottom: 14px;
    border-bottom: 1.5px solid #0b1220;
    position: relative; z-index: 1;
  }
  .meta-left { font-size: 11px; color: #6b7280; }
  .meta-left strong { color: #1f2430; font-weight: 600; }
  .meta-right { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #1f2430; letter-spacing: 0.04em; }
  .meta-right span { color: #6b7280; }

  /* ---- title block ---- */
  .title-block { margin-top: 40px; position: relative; z-index: 1; }
  .title-main { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 0.04em; color: #0b1220; }
  .title-sub { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: ${ELECTRIC}; margin-top: 4px; font-weight: 600; }

  /* ---- body ---- */
  .body { margin-top: 28px; font-size: 12.5px; line-height: 1.75; color: #2a3140; position: relative; z-index: 1; }
  .body p + p { margin-top: 14px; }
  .body strong { color: #0b1220; font-weight: 600; }
  .accent-bar { display: inline-block; width: 28px; height: 2px; background: ${ELECTRIC}; vertical-align: middle; margin-right: 10px; border-radius: 2px; }

  /* ---- details grid ---- */
  .details { margin-top: 26px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; border-top: 1px solid #e5e7eb; position: relative; z-index: 1; }
  .detail { padding: 12px 16px 12px 0; border-bottom: 1px solid #e5e7eb; }
  .detail:nth-child(2n) { padding-left: 20px; border-left: 1px solid #e5e7eb; }
  .detail .label { font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #9aa1ac; }
  .detail .value { font-size: 12.5px; font-weight: 600; color: #0b1220; margin-top: 3px; }

  /* ---- skills ---- */
  .skills-wrap { margin-top: 22px; position: relative; z-index: 1; }
  .skills-label { font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #9aa1ac; margin-bottom: 7px; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill { font-size: 10.5px; padding: 4px 11px; border-radius: 999px; border: 1px solid #d7dbe3; background: #f6f8fb; color: #1f2430; }

  /* ---- sign-off ---- */
  .signoff { margin-top: 46px; display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; }
  .regards { font-size: 12.5px; color: #2a3140; margin-bottom: 6px; }
  .mentor-sign { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-style: italic; color: #0b1220; line-height: 1; margin-bottom: 4px; }
  .mentor-name { font-size: 11.5px; font-weight: 600; color: #0b1220; }
  .mentor-title { font-size: 10px; color: #6b7280; margin-top: 1px; }

  .qr-block { display: flex; flex-direction: column; align-items: center; }
  .qr-frame { width: 84px; height: 84px; padding: 5px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; }
  .qr-frame svg { width: 100%; height: 100%; display: block; }
  .qr-caption { margin-top: 6px; font-size: 7.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280; text-align: center; max-width: 120px; line-height: 1.3; }
  .qr-caption strong { color: ${ELECTRIC}; font-weight: 600; }

  /* ---- footer ---- */
  .footer {
    position: absolute; left: 72px; right: 72px; bottom: 44px;
    padding-top: 16px; border-top: 1.5px solid #0b1220;
    text-align: center; z-index: 1;
  }
  .footer-contact { font-size: 10px; color: #4b5563; letter-spacing: 0.02em; }
  .footer-contact span { margin: 0 8px; color: #9aa1ac; }
  .footer-address { font-size: 9.5px; color: #6b7280; margin-top: 3px; }
  .footer-gstin { font-size: 8.5px; color: #9aa1ac; margin-top: 6px; letter-spacing: 0.08em; }

  /* faint verified mark top-right of body */
  .verified-chip {
    position: absolute; top: 64px; right: 72px; z-index: 2;
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0;
    padding: 5px 10px; border-radius: 999px;
  }
  .verified-chip svg { width: 11px; height: 11px; }
</style>
</head>
<body>
  <div class="page">
    <div class="corner-accent"></div>

    <!-- top brand -->
    <div class="brand-row">
      <div class="logo">P</div>
      <div>
        <div class="brand-name">PeakMedia</div>
        <div class="brand-tag">The Growth Studio</div>
        <div class="brand-sub">By Peak Media Pvt. Ltd.</div>
      </div>
    </div>

    <span class="verified-chip">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      Verified
    </span>

    <!-- meta bar -->
    <div class="meta-bar">
      <div class="meta-left">Date: <strong>${escapeHtml(cert.issueDate)}</strong></div>
      <div class="meta-right">RID: <span>${escapeHtml(cert.id)}</span></div>
    </div>

    <!-- title -->
    <div class="title-block">
      <div class="title-main">TO WHOM IT MAY CONCERN</div>
      <div class="title-sub">Internship Completion Certificate</div>
    </div>

    <!-- body -->
    <div class="body">
      <p><span class="accent-bar"></span>This is to certify that <strong>${escapeHtml(cert.internName)}</strong> has successfully completed a <strong>${escapeHtml(cert.duration)}</strong> internship at Peak Media, serving as a <strong>${escapeHtml(cert.role)}</strong> in the <strong>${escapeHtml(cert.department)}</strong> department at our <strong>${escapeHtml(cert.location)}</strong> office.</p>

      <p>The internship was held from <strong>${escapeHtml(cert.startDate)}</strong> to <strong>${escapeHtml(cert.endDate)}</strong>. During this period, ${escapeHtml(cert.internName.split(" ")[0])} demonstrated strong analytical ability, creative thinking, and a disciplined work ethic — contributing meaningfully to live client engagements and internal growth initiatives.</p>

      <p>Throughout the engagement, ${escapeHtml(cert.internName.split(" ")[0])} consistently exhibited professionalism, adaptability, and a genuine eagerness to learn. The skills and judgement applied to real-world marketing challenges reflect a readiness to contribute meaningfully to any performance-oriented team. We are pleased to award a grade of <strong>${escapeHtml(cert.grade)}</strong> for this engagement.</p>
    </div>

    <!-- details -->
    <div class="details">
      <div class="detail"><div class="label">Intern</div><div class="value">${escapeHtml(cert.internName)}</div></div>
      <div class="detail"><div class="label">Role</div><div class="value">${escapeHtml(cert.role)}</div></div>
      <div class="detail"><div class="label">Duration</div><div class="value">${escapeHtml(cert.startDate)} – ${escapeHtml(cert.endDate)}</div></div>
      <div class="detail"><div class="label">Grade</div><div class="value">${escapeHtml(cert.grade)}</div></div>
    </div>

    <!-- skills -->
    <div class="skills-wrap">
      <div class="skills-label">Skills demonstrated</div>
      <div class="skills">${skills}</div>
    </div>

    <!-- sign-off -->
    <div class="signoff">
      <div>
        <div class="regards">With regards,</div>
        <div class="mentor-sign">${escapeHtml(cert.mentor)}</div>
        <div class="mentor-name">${escapeHtml(cert.mentor)}</div>
        <div class="mentor-title">Senior Strategist, Peak Media</div>
      </div>
      <div class="qr-block">
        <div class="qr-frame">${qrSvg}</div>
        <div class="qr-caption">Scan to verify at <strong>peakmedia.in/verify</strong></div>
      </div>
    </div>

    <!-- footer -->
    <div class="footer">
      <div class="footer-contact">hello@peakmedia.in<span>·</span>peakmedia.in<span>·</span>+91 80 4567 8900</div>
      <div class="footer-address">One BKC, Bandra Kurla Complex, Mumbai 400051 · Bengaluru · Delhi</div>
      <div class="footer-gstin">GSTIN: 27ABCDE1234F1Z5 · Registry hash: ${escapeHtml(cert.hash)}</div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawId = url.searchParams.get("id") ?? "";

  const cert = getCertificate(rawId);
  if (!cert) {
    return NextResponse.json(
      { ok: false, error: "Certificate not found." },
      { status: 404 }
    );
  }

  const html = await certificateHtml(cert);

  let pdfBytes: Buffer;
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    // Allow webfonts/colors to settle (graceful; no remote fonts used).
    await page.waitForTimeout(120);
    pdfBytes = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }

  const safeName = cert.internName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  const filename = `Peak-Media-Certificate-${safeName}-${cert.id}.pdf`;

  return new NextResponse(pdfBytes as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
