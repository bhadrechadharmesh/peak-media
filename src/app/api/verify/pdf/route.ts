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

    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=Space+Grotesk:wght@500;700&display=swap"
      rel="stylesheet"
    />

    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }

      @media print {
        html,
        body {
          width: 210mm;
          height: 297mm;
          background: #ffffff;
        }
        .page {
          box-shadow: none !important;
        }
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        width: 794px;
        height: 1123px;
        font-family: Inter, sans-serif;
        background: #eef2f7;
        overflow: hidden;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .page {
        width: 794px;
        height: 1123px;
        position: relative;
        background: white;
        overflow: hidden;
        padding: 40px 60px 35px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .top-accent {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 10px;
        background: linear-gradient(90deg, #c89b3c, #f5d36a, #c89b3c);
      }

      .outer-border {
        position: absolute;
        left: 18px;
        right: 18px;
        top: 18px;
        bottom: 18px;
        border: 2px solid #1e3a8a;
        pointer-events: none;
      }

      .inner-border {
        position: absolute;
        left: 28px;
        right: 28px;
        top: 28px;
        bottom: 28px;
        border: 1px solid #d8d8d8;
        pointer-events: none;
      }

      .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-25deg);
        opacity: 0.04;
        pointer-events: none;
        user-select: none;
      }

      /* Verified Chip */
      .verified-chip {
        position: absolute;
        top: 45px;
        right: 50px;
        background: #ecfdf5;
        border: 1px solid #bbf7d0;
        color: #047857;
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        z-index: 10;
      }

      .verified-chip svg {
        width: 14px;
        height: 14px;
      }

      /* Header */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 15px;
      }

      .logo-box {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        background: linear-gradient(135deg, #1e40af, #2563eb);
        color: white;
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
      }

      .company {
        font-size: 28px;
        font-family: "Space Grotesk", sans-serif;
        font-weight: 700;
        color: #0f172a;
      }

      .company-sub {
        margin-top: 2px;
        font-size: 11px;
        color: #64748b;
        letter-spacing: 2px;
      }

      .meta {
        text-align: right;
        margin-right: 120px; /* Space for verified chip */
      }

      .meta-title {
        font-size: 11px;
        color: #64748b;
        margin-top: 3px;
      }

      .meta-value {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
      }

      .divider {
        width: 100%;
        height: 2px;
        background: #1e3a8a;
      }

      /* Title */
      .title {
        text-align: center;
        margin-top: 10px;
      }

      .title h1 {
        font-size: 36px;
        font-family: "Playfair Display", serif;
        color: #0f172a;
        letter-spacing: 4px;
      }

      .title h2 {
        margin-top: 6px;
        color: #c89b3c;
        letter-spacing: 5px;
        font-size: 14px;
        font-weight: 600;
      }

      .gold-line {
        width: 140px;
        height: 3px;
        background: #c89b3c;
        margin: 12px auto 0;
        border-radius: 30px;
      }

      /* Recipient */
      .recipient-section {
        text-align: center;
        margin: 10px 0;
      }

      .awarded {
        font-size: 13px;
        color: #6b7280;
        letter-spacing: 1px;
      }

      .name {
        margin-top: 8px;
        font-family: "Playfair Display", serif;
        font-size: 36px;
        color: #0f172a;
        letter-spacing: 1px;
      }

      .role {
        margin-top: 4px;
        font-size: 15px;
        color: #374151;
        font-weight: 500;
      }

      /* Body Content */
      .content {
        width: 100%;
        max-width: 630px;
        margin: 0 auto;
        text-align: center;
        font-size: 13px;
        color: #374151;
        line-height: 1.6;
      }

      .content strong {
        color: #111827;
      }

      /* Details Grid */
      .details {
        width: 100%;
        max-width: 630px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .card {
        border: 1px solid #e5e7eb;
        border-left: 4px solid #1e40af;
        padding: 8px 14px;
        border-radius: 6px;
        background: #f8fafc;
      }

      .card .label {
        font-size: 10px;
        letter-spacing: 1.5px;
        color: #94a3b8;
        text-transform: uppercase;
      }

      .card .value {
        margin-top: 4px;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }

      /* Skills */
      .skills-section {
        width: 100%;
        max-width: 630px;
        margin: 0 auto;
      }

      .skills-title {
        text-align: center;
        font-size: 11px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #64748b;
        margin-bottom: 8px;
      }

      .skills {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }

      .skill {
        padding: 5px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        background: #f8fafc;
        color: #334155;
        font-size: 12px;
        font-weight: 500;
      }

      /* Signatures & Seal Row */
      .bottom-container {
        position: relative;
        width: 100%;
        max-width: 630px;
        margin: 0 auto;
      }

      .signature-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .signature {
        width: 180px;
        text-align: center;
      }

      .signature-name {
        font-family: "Playfair Display", serif;
        font-size: 20px;
        color: #0f172a;
      }

      .signature-line {
        width: 150px;
        height: 1px;
        background: #1f2937;
        margin: 6px auto 8px;
      }

      .signature-role {
        font-size: 12px;
        color: #64748b;
      }

      .verify {
        width: 140px;
        text-align: center;
        padding: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        background: #fafafa;
      }

      .qr-frame {
        width: 85px;
        height: 85px;
        margin: auto;
        padding: 6px;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        background: white;
      }

      .qr-frame svg {
        width: 100%;
        height: 100%;
      }

      .verify-title {
        margin-top: 6px;
        font-size: 11px;
        font-weight: 600;
        color: #0f172a;
      }

      .verify-link {
        margin-top: 2px;
        font-size: 10px;
        color: #2563eb;
      }

      .verify-id {
        margin-top: 3px;
        font-size: 10px;
        color: #64748b;
      }

      /* Company Seal */
      .company-seal {
        position: absolute;
        left: -15px;
        bottom: 50px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 3px solid rgba(30, 64, 175, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #1e40af;
        font-size: 9px;
        font-weight: 700;
        text-align: center;
        opacity: 0.5;
        transform: rotate(-12deg);
        pointer-events: none;
      }

      /* Footer */
      .footer {
        width: 100%;
        text-align: center;
        border-top: 1px solid #cbd5e1;
        padding-top: 12px;
      }

      .footer-company {
        font-weight: 700;
        font-size: 13px;
        color: #0f172a;
      }

      .footer-contact {
        margin-top: 4px;
        color: #64748b;
        font-size: 11px;
      }

      .footer-copy {
        margin-top: 4px;
        color: #94a3b8;
        font-size: 10px;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="top-accent"></div>
      <div class="outer-border"></div>
      <div class="inner-border"></div>

      <div class="watermark">
        <img src="logo.svg" style="width: 380px" />
      </div>

      <div class="verified-chip">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Verified
      </div>

      <!-- Top Header -->
      <div>
        <div class="header">
          <div class="logo-box">
            <div class="logo">P</div>
            <div>
              <div class="company">Peak Media</div>
              <div class="company-sub">PERFORMANCE MARKETING COMPANY</div>
            </div>
          </div>

          <div class="meta">
            <div class="meta-title">Certificate ID</div>
            <div class="meta-value">${escapeHtml(cert.id)}</div>
            <div class="meta-title">Issue Date</div>
            <div class="meta-value">${escapeHtml(cert.issueDate)}</div>
          </div>
        </div>
        <div class="divider"></div>
      </div>

      <!-- Certificate Title -->
      <div class="title">
        <h1>CERTIFICATE</h1>
        <h2>OF INTERNSHIP COMPLETION</h2>
        <div class="gold-line"></div>
      </div>

      <!-- Recipient -->
      <div class="recipient-section">
        <div class="awarded">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
        <div class="name">${escapeHtml(cert.internName)}</div>
        <div class="role">${escapeHtml(cert.role)}</div>
      </div>

      <!-- Paragraph Body -->
      <div class="content">
        This certificate is awarded to
        <strong>${escapeHtml(cert.internName)}</strong> in recognition of the
        successful completion of the
        <strong>${escapeHtml(cert.duration)}</strong> Internship Program at
        <strong>Peak Media Pvt. Ltd.</strong> as a
        <strong>${escapeHtml(cert.role)}</strong> in the
        <strong>${escapeHtml(cert.department)}</strong> department from
        <strong>${escapeHtml(cert.startDate)}</strong> to
        <strong>${escapeHtml(cert.endDate)}</strong>.
        <br /><br />
        Throughout the internship, the candidate demonstrated professionalism,
        technical expertise, analytical thinking, dedication, and a strong
        willingness to learn while contributing to real client projects and
        internal business initiatives.
      </div>

      <!-- Details Cards Grid -->
      <div class="details">
        <div class="card">
          <div class="label">Intern</div>
          <div class="value">${escapeHtml(cert.internName)}</div>
        </div>
        <div class="card">
          <div class="label">Role</div>
          <div class="value">${escapeHtml(cert.role)}</div>
        </div>
        <div class="card">
          <div class="label">Department</div>
          <div class="value">${escapeHtml(cert.department)}</div>
        </div>
        <div class="card">
          <div class="label">Grade</div>
          <div class="value">${escapeHtml(cert.grade)}</div>
        </div>
        <div class="card">
          <div class="label">Internship Duration</div>
          <div class="value">
            ${escapeHtml(cert.startDate)} — ${escapeHtml(cert.endDate)}
          </div>
        </div>
        <div class="card">
          <div class="label">Location</div>
          <div class="value">${escapeHtml(cert.location)}</div>
        </div>
      </div>

      <!-- Skills -->
      <div class="skills-section">
        <div class="skills-title">Skills Demonstrated</div>
        <div class="skills">${skills}</div>
      </div>

      <!-- Signatures and QR Code -->
      <div class="bottom-container">
        <div class="company-seal">
          ★ PEAK MEDIA ★<br />CERTIFIED<br />2026
        </div>

        <div class="signature-row">
          <div class="signature">
            <div class="signature-name">${escapeHtml(cert.mentor)}</div>
            <div class="signature-line"></div>
            <div class="signature-role">
              Senior Strategist<br />Peak Media Pvt. Ltd.
            </div>
          </div>

          <div class="verify">
            <div class="qr-frame">${qrSvg}</div>
            <div class="verify-title">Verify Certificate</div>
            <div class="verify-link">peakmedia.in/verify</div>
            <div class="verify-id">ID : ${escapeHtml(cert.id)}</div>
          </div>

          <div class="signature">
            <div class="signature-name">HR Department</div>
            <div class="signature-line"></div>
            <div class="signature-role">
              Human Resources<br />Peak Media Pvt. Ltd.
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-company">Peak Media Pvt. Ltd.</div>
        <div class="footer-contact">
          hello@peakmedia.in &nbsp; • &nbsp; www.peakmedia.in &nbsp; • &nbsp;
          +91 80 4567 8900
        </div>
        <div class="footer-contact">Mumbai • Bengaluru • Jaipur</div>
        <div class="footer-copy">
          Certificate Hash : ${escapeHtml(cert.hash)}
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
