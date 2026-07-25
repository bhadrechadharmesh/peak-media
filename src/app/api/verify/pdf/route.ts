import { NextResponse } from "next/server";
import { getCertificate, type Certificate } from "@/data/certificates";
import { chromium } from "playwright";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ELECTRIC = "#0a84ff";
const ELECTRIC_2 = "#2b6bff";
const ELECTRIC_SOFT = "#38bdf8";

/** Build a single-page, print-ready HTML certificate from a Certificate record. */
function certificateHtml(cert: Certificate): string {
  const skills = cert.skills.map((s) => `<span class="skill">${escapeHtml(s)}</span>`).join("");
  const verifiedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Peak Media — Certificate ${escapeHtml(cert.id)}</title>
<style>
  @page { size: 1123px 794px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1123px; height: 794px;
    background: #05070d;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #e7ecf5;
    -webkit-font-smoothing: antialiased;
  }
  .cert {
    position: relative;
    width: 1123px; height: 794px;
    overflow: hidden;
    background:
      radial-gradient(ellipse 60% 50% at 50% 0%, rgba(10,132,255,0.18), transparent 60%),
      radial-gradient(ellipse 50% 40% at 90% 100%, rgba(43,107,255,0.14), transparent 60%),
      #05070d;
  }
  /* faint grid */
  .cert::before {
    content: ""; position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 90%);
            mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 90%);
  }
  /* outer frame */
  .frame {
    position: absolute; inset: 26px;
    border: 1.5px solid rgba(10,132,255,0.35);
    border-radius: 18px;
    background: rgba(255,255,255,0.015);
    -webkit-backdrop-filter: blur(2px);
  }
  .frame::before {
    content: ""; position: absolute; inset: 8px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
  }
  /* corner ornaments */
  .corner { position: absolute; width: 28px; height: 28px; border: 2px solid ${ELECTRIC}; }
  .corner.tl { top: 20px; left: 20px; border-right: 0; border-bottom: 0; border-top-left-radius: 10px; }
  .corner.tr { top: 20px; right: 20px; border-left: 0; border-bottom: 0; border-top-right-radius: 10px; }
  .corner.bl { bottom: 20px; left: 20px; border-right: 0; border-top: 0; border-bottom-left-radius: 10px; }
  .corner.br { bottom: 20px; right: 20px; border-left: 0; border-top: 0; border-bottom-right-radius: 10px; }

  .content { position: relative; z-index: 2; padding: 56px 72px; height: 100%; display: flex; flex-direction: column; }

  /* header */
  .header { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .logo {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, ${ELECTRIC}, ${ELECTRIC_2});
    display: grid; place-items: center;
    box-shadow: 0 6px 20px rgba(10,132,255,0.4);
    font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; color: #fff;
  }
  .brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
  .brand-name span { color: ${ELECTRIC}; }
  .badge {
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 6px 14px; border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px; background: rgba(255,255,255,0.04); color: #b9c2d4;
  }

  /* title block */
  .title-block { text-align: center; margin-top: 28px; }
  .eyebrow { font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; color: #8b93a7; }
  .intern-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 46px; font-weight: 700; line-height: 1.05;
    margin: 10px 0 6px;
    background: linear-gradient(100deg, ${ELECTRIC_SOFT}, ${ELECTRIC} 45%, ${ELECTRIC_2});
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
  }
  .role-line { font-size: 15px; color: #b9c2d4; }
  .role-line strong { color: #fff; font-weight: 600; }

  /* details grid */
  .details {
    margin-top: 24px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  }
  .detail {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.025);
    border-radius: 10px; padding: 10px 12px;
  }
  .detail .label { font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #8b93a7; }
  .detail .value { font-size: 13px; font-weight: 600; color: #e7ecf5; margin-top: 4px; }
  .detail.accent .value { color: ${ELECTRIC_SOFT}; }

  /* skills */
  .skills-wrap { margin-top: 16px; }
  .skills-label { font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #8b93a7; margin-bottom: 6px; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill {
    font-size: 11px; padding: 4px 11px; border-radius: 999px;
    border: 1px solid rgba(10,132,255,0.35); background: rgba(10,132,255,0.1);
    color: #dbe4f5;
  }

  /* footer row: mentor + seal */
  .footer {
    margin-top: auto;
    display: flex; align-items: flex-end; justify-content: space-between;
    padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1);
  }
  .mentor .label { font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #8b93a7; }
  .mentor .name { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-style: italic; color: #e7ecf5; margin-top: 2px; }
  .mentor .title { font-size: 10px; color: #8b93a7; margin-top: 1px; }

  .seal { text-align: center; }
  .seal-stamp {
    width: 84px; height: 84px; border-radius: 999px;
    border: 2px solid rgba(10,132,255,0.6); background: rgba(10,132,255,0.12);
    display: grid; place-items: center; margin: 0 auto;
    transform: rotate(-10deg);
    box-shadow: 0 0 24px rgba(10,132,255,0.3);
  }
  .seal-stamp .inner {
    width: 68px; height: 68px; border-radius: 999px; border: 1px solid rgba(10,132,255,0.4);
    display: grid; place-items: center; text-align: center;
  }
  .seal-stamp svg { width: 18px; height: 18px; color: ${ELECTRIC_SOFT}; }
  .seal-stamp .txt { font-size: 7px; letter-spacing: 0.12em; color: ${ELECTRIC_SOFT}; margin-top: 2px; font-weight: 700; }
  .cert-id { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #8b93a7; margin-top: 8px; letter-spacing: 0.05em; }

  /* verify strip */
  .verify-strip {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 14px; padding: 9px 14px;
    border-radius: 9px; background: rgba(255,255,255,0.03);
    font-size: 10px;
  }
  .verify-strip .left { display: flex; align-items: center; gap: 7px; color: #8b93a7; }
  .verify-strip .hash { font-family: 'JetBrains Mono', monospace; color: #b9c2d4; }
  .verify-strip .right { color: #6ef0a8; display: flex; align-items: center; gap: 6px; }
  .dot { width: 7px; height: 7px; border-radius: 999px; background: #6ef0a8; box-shadow: 0 0 8px #6ef0a8; }

  /* watermark */
  .watermark {
    position: absolute; right: 60px; top: 50%; transform: translateY(-50%) rotate(-22deg);
    font-family: 'Space Grotesk', sans-serif; font-size: 130px; font-weight: 800;
    color: rgba(10,132,255,0.045); letter-spacing: 0.04em; z-index: 1; pointer-events: none;
  }
</style>
</head>
<body>
  <div class="cert">
    <div class="frame"></div>
    <span class="corner tl"></span><span class="corner tr"></span>
    <span class="corner bl"></span><span class="corner br"></span>
    <span class="watermark">VERIFIED</span>

    <div class="content">
      <div class="header">
        <div class="brand">
          <div class="logo">P</div>
          <div class="brand-name">Peak<span>Media</span></div>
        </div>
        <div class="badge">Certificate of Internship</div>
      </div>

      <div class="title-block">
        <div class="eyebrow">This is to certify that</div>
        <h1 class="intern-name">${escapeHtml(cert.internName)}</h1>
        <div class="role-line">
          has successfully completed a <strong>${escapeHtml(cert.duration)}</strong> internship as
          <strong>${escapeHtml(cert.role)}</strong>
          in the ${escapeHtml(cert.department)} department · ${escapeHtml(cert.location)} office
        </div>
      </div>

      <div class="details">
        <div class="detail"><div class="label">Start date</div><div class="value">${escapeHtml(cert.startDate)}</div></div>
        <div class="detail"><div class="label">End date</div><div class="value">${escapeHtml(cert.endDate)}</div></div>
        <div class="detail"><div class="label">Issued on</div><div class="value">${escapeHtml(cert.issueDate)}</div></div>
        <div class="detail accent"><div class="label">Grade</div><div class="value">${escapeHtml(cert.grade)}</div></div>
      </div>

      <div class="skills-wrap">
        <div class="skills-label">Skills demonstrated</div>
        <div class="skills">${skills}</div>
      </div>

      <div class="verify-strip">
        <div class="left">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ELECTRIC}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>
          <span>Registry hash</span>
          <span class="hash">${escapeHtml(cert.hash)}</span>
        </div>
        <div class="right">
          <span class="dot"></span>
          Verified · ${escapeHtml(verifiedAt)} IST
        </div>
      </div>

      <div class="footer">
        <div class="mentor">
          <div class="label">Mentor</div>
          <div class="name">${escapeHtml(cert.mentor)}</div>
          <div class="title">Senior Strategist, Peak Media</div>
        </div>
        <div class="seal">
          <div class="seal-stamp">
            <div class="inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>
              <div class="txt">VERIFIED</div>
            </div>
          </div>
          <div class="cert-id">${escapeHtml(cert.id)}</div>
        </div>
      </div>
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

  const html = certificateHtml(cert);

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
