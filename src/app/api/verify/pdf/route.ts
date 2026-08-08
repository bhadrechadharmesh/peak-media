import { NextResponse } from "next/server";
import { getCertificate, type Certificate } from "@/data/certificates";
import { qrToDataUrl, verifyUrlFor } from "@/lib/qr";
import { jsPDF } from "jspdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE = {
  width: 210,
  height: 297,
  marginX: 16,
};

const COLORS = {
  primary: [30, 64, 175] as [number, number, number], // #1e40af
  primaryDark: [15, 23, 42] as [number, number, number], // #0f172a
  accentGold: [200, 155, 60] as [number, number, number], // #c89b3c
  textMain: [17, 24, 39] as [number, number, number], // #111827
  textMuted: [100, 116, 139] as [number, number, number], // #64748b
  textSubtle: [148, 163, 184] as [number, number, number], // #94a3b8
  borderDark: [30, 58, 138] as [number, number, number], // #1e3a8a
  borderSubtle: [229, 231, 235] as [number, number, number], // #e5e7eb
  bgCard: [248, 250, 252] as [number, number, number], // #f8fafc
  badgeBg: [236, 253, 245] as [number, number, number], // #ecfdf5
  badgeBorder: [187, 247, 208] as [number, number, number], // #bbf7d0
  badgeText: [4, 120, 87] as [number, number, number], // #047857
};

type TextRun = { text: string; bold?: boolean };

/** Renders a wrapped, centered paragraph supporting inline bold text runs */
function drawRichParagraph(
  doc: jsPDF,
  runs: TextRun[],
  centerX: number,
  startY: number,
  maxWidth: number,
  fontSize: number,
  lineHeight: number
): number {
  doc.setFontSize(fontSize);

  type Token = { text: string; bold: boolean };
  const tokens: Token[] = [];

  runs.forEach((run) => {
    const words = run.text.split(" ");
    words.forEach((word) => {
      if (word.length > 0) {
        tokens.push({ text: word, bold: !!run.bold });
      }
    });
  });

  const spaceNormal = (doc.setFont("helvetica", "normal"), doc.getTextWidth(" "));
  const spaceBold = (doc.setFont("helvetica", "bold"), doc.getTextWidth(" "));

  const lines: Token[][] = [];
  let currentLine: Token[] = [];
  let currentLineWidth = 0;

  tokens.forEach((token) => {
    doc.setFont("helvetica", token.bold ? "bold" : "normal");
    const tokenWidth = doc.getTextWidth(token.text);
    const spaceWidth = token.bold ? spaceBold : spaceNormal;

    if (currentLine.length === 0) {
      currentLine.push(token);
      currentLineWidth = tokenWidth;
    } else if (currentLineWidth + spaceWidth + tokenWidth <= maxWidth) {
      currentLine.push(token);
      currentLineWidth += spaceWidth + tokenWidth;
    } else {
      lines.push(currentLine);
      currentLine = [token];
      currentLineWidth = tokenWidth;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  let y = startY;
  lines.forEach((line) => {
    let totalW = 0;
    line.forEach((token, i) => {
      doc.setFont("helvetica", token.bold ? "bold" : "normal");
      totalW += doc.getTextWidth(token.text);
      if (i < line.length - 1) {
        totalW += token.bold ? spaceBold : spaceNormal;
      }
    });

    let currentX = centerX - totalW / 2;
    line.forEach((token, i) => {
      const isBold = token.bold;
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(...(isBold ? COLORS.primaryDark : [55, 65, 81]));

      doc.text(token.text, currentX, y);
      const w = doc.getTextWidth(token.text);
      const sw = isBold ? spaceBold : spaceNormal;
      currentX += w + (i < line.length - 1 ? sw : 0);
    });

    y += lineHeight;
  });

  return y;
}

function drawPageBorders(doc: jsPDF) {
  // Top accent bar
  doc.setFillColor(...COLORS.accentGold);
  doc.rect(0, 0, PAGE.width, 3, "F");

  // Outer border
  doc.setDrawColor(...COLORS.borderDark);
  doc.setLineWidth(0.6);
  doc.rect(5, 5, PAGE.width - 10, PAGE.height - 10, "S");

  // Inner border
  doc.setDrawColor(216, 216, 216);
  doc.setLineWidth(0.2);
  doc.rect(7.5, 7.5, PAGE.width - 15, PAGE.height - 15, "S");
}

/** Draws Verified Badge */
function drawVerifiedBadge(doc: jsPDF) {
  const badgeWidth = 26;
  const badgeHeight = 6.5;
  const badgeX = PAGE.width - 13.2 - badgeWidth;
  const badgeY = 12;

  doc.setFillColor(...COLORS.badgeBg);
  doc.setDrawColor(...COLORS.badgeBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, badgeY - 3, badgeWidth, badgeHeight, 3.25, 3.25, "FD");

  doc.setTextColor(...COLORS.badgeText);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Verified", badgeX + badgeWidth / 2, badgeY + 0.5, { align: "center" });
}

function drawHeader(doc: jsPDF, cert: Certificate): number {
  let cursorY = 15;

  // Logo Box
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(PAGE.marginX, cursorY, 14, 14, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("P", PAGE.marginX + 7, cursorY + 10, { align: "center" });

  // Company Name
  doc.setTextColor(...COLORS.primaryDark);
  doc.setFontSize(18);
  doc.text("Peak Media", PAGE.marginX + 18, cursorY + 7);

  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(6.5);
  doc.text("PERFORMANCE MARKETING COMPANY", PAGE.marginX + 18, cursorY + 12);

  // Meta Section
  const metaRightX = PAGE.width - 45;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Certificate ID", metaRightX, cursorY + 3, { align: "right" });
  doc.text("Issue Date", metaRightX, cursorY + 10, { align: "right" });

  doc.setTextColor(...COLORS.textMain);
  doc.setFont("helvetica", "bold");
  doc.text(cert.id, metaRightX + 2, cursorY + 3, { align: "left" });
  doc.text(cert.issueDate, metaRightX + 2, cursorY + 10, { align: "left" });

  cursorY += 19;
  doc.setDrawColor(...COLORS.borderDark);
  doc.setLineWidth(0.5);
  doc.line(PAGE.marginX, cursorY, PAGE.width - PAGE.marginX, cursorY);

  return cursorY;
}

function drawTitleSection(doc: jsPDF, startY: number): number {
  let cursorY = startY + 12;

  doc.setTextColor(...COLORS.primaryDark);
  doc.setFontSize(22);
  doc.setFont("times", "bold");
  doc.text("CERTIFICATE", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 7;
  doc.setTextColor(...COLORS.accentGold);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("OF INTERNSHIP COMPLETION", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 5;
  doc.setFillColor(...COLORS.accentGold);
  doc.roundedRect(PAGE.width / 2 - 18, cursorY, 36, 1, 0.5, 0.5, "F");

  return cursorY;
}

function drawRecipientSection(doc: jsPDF, cert: Certificate, startY: number): number {
  let cursorY = startY + 11;

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 9;
  doc.setTextColor(...COLORS.primaryDark);
  doc.setFont("times", "bold");
  
  // Auto-scale intern name to prevent overflow
  let nameFontSize = 24;
  const maxNameWidth = PAGE.width - (PAGE.marginX * 2) - 20;
  doc.setFontSize(nameFontSize);
  while (doc.getTextWidth(cert.internName) > maxNameWidth && nameFontSize > 12) {
    nameFontSize -= 0.5;
    doc.setFontSize(nameFontSize);
  }
  
  doc.text(cert.internName, PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 6.5;
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.text(cert.role, PAGE.width / 2, cursorY, { align: "center" });

  return cursorY;
}

function drawBodyContent(doc: jsPDF, cert: Certificate, startY: number): number {
  const cursorY = startY + 9;

  const p1Runs: TextRun[] = [
    { text: "This certificate is awarded to " },
    { text: cert.internName, bold: true },
    { text: " in recognition of the successful completion of the " },
    { text: cert.duration, bold: true },
    { text: " Internship Program at " },
    { text: "Peak Media Pvt. Ltd.", bold: true },
    { text: " as a " },
    { text: cert.role, bold: true },
    { text: " in the " },
    { text: cert.department, bold: true },
    { text: " department from " },
    { text: `${cert.startDate} to ${cert.endDate}`, bold: true },
    { text: "." },
  ];

  let nextY = drawRichParagraph(doc, p1Runs, PAGE.width / 2, cursorY, 152, 9, 4.5);
  nextY += 3;

  const p2 = `Throughout the internship, the candidate demonstrated professionalism, technical expertise, analytical thinking, dedication, and a strong willingness to learn while contributing to real client projects and internal business initiatives.`;
  
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const splitP2 = doc.splitTextToSize(p2, 152);
  doc.text(splitP2, PAGE.width / 2, nextY, { align: "center" });

  return nextY + splitP2.length * 4.5 + 7;
}

function drawDetailsGrid(doc: jsPDF, cert: Certificate, startY: number): number {
  const cardWidth = 78;
  const cardHeight = 12;
  const gapX = 8;
  const gapY = 3.5;
  const gridLeft = (PAGE.width - (cardWidth * 2 + gapX)) / 2;

  const items = [
    { label: "INTERN", value: cert.internName },
    { label: "ROLE", value: cert.role },
    { label: "DEPARTMENT", value: cert.department },
    { label: "GRADE", value: cert.grade },
    { label: "INTERNSHIP DURATION", value: `${cert.startDate} — ${cert.endDate}` },
    { label: "LOCATION", value: cert.location },
  ];

  items.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = gridLeft + col * (cardWidth + gapX);
    const y = startY + row * (cardHeight + gapY);

    doc.setFillColor(...COLORS.bgCard);
    doc.setDrawColor(...COLORS.borderSubtle);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, "FD");

    doc.setFillColor(...COLORS.primary);
    doc.rect(x, y, 1.2, cardHeight, "F");

    doc.setTextColor(...COLORS.textSubtle);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, x + 4, y + 3.8);

    doc.setTextColor(...COLORS.textMain);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, x + 4, y + 8.8);
  });

  return startY + 3 * (cardHeight + gapY) + 6;
}

function drawSkillsSection(doc: jsPDF, cert: Certificate, startY: number): number {
  let cursorY = startY;

  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("SKILLS DEMONSTRATED", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 5;
  const skillsText = cert.skills.join("   •   ");
  
  // Auto-scale skills text to prevent overflow
  let skillFontSize = 8.5;
  const maxSkillWidth = PAGE.width - (PAGE.marginX * 2) - 10;
  doc.setFontSize(skillFontSize);
  while (doc.getTextWidth(skillsText) > maxSkillWidth && skillFontSize > 6) {
    skillFontSize -= 0.5;
    doc.setFontSize(skillFontSize);
  }

  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.text(skillsText, PAGE.width / 2, cursorY, { align: "center" });

  return cursorY;
}

function drawSignaturesAndSeal(doc: jsPDF, cert: Certificate, qrBase64Png: string) {
  const cursorY = PAGE.height - 65;

  // 1. Signature - Mentor
  const mentorX = PAGE.marginX + 28;
  doc.setTextColor(...COLORS.primaryDark);
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text(cert.mentor, mentorX, cursorY, { align: "center" });

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.3);
  doc.line(mentorX - 20, cursorY + 2, mentorX + 20, cursorY + 2);

  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Senior Strategist", mentorX, cursorY + 6, { align: "center" });
  doc.text("Peak Media Pvt. Ltd.", mentorX, cursorY + 9.5, { align: "center" });

  // 2. Rotated Circular Company Seal
  const sealRadius = 11;
  const sealX = PAGE.marginX + 8;
  const sealY = cursorY - 3;

  // Extract year dynamically from endDate (assumes format YYYY-MM-DD or similar)
  const certYear = new Date(cert.endDate).getFullYear() || new Date().getFullYear();

  doc.saveGraphicsState();
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.6);
  doc.circle(sealX, sealY, sealRadius, "S");

  doc.setTextColor(...COLORS.primary);
  doc.setFont("helvetica", "bold");

  doc.setFontSize(4.5);
  doc.text("★ PEAK MEDIA ★", sealX, sealY - 3, { align: "center", angle: -12 });

  doc.setFontSize(5.5);
  doc.text("CERTIFIED", sealX, sealY + 0.5, { align: "center", angle: -12 });

  doc.setFontSize(4.5);
  doc.text(String(certYear), sealX, sealY + 4, { align: "center", angle: -12 });
  doc.restoreGraphicsState();

  // 3. Center QR Verification Box
  const qrBoxWidth = 34;
  const qrBoxX = (PAGE.width - qrBoxWidth) / 2;
  const qrBoxY = cursorY - 8;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(...COLORS.borderSubtle);
  doc.setLineWidth(0.2);
  doc.roundedRect(qrBoxX, qrBoxY, qrBoxWidth, 36, 2, 2, "FD");

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(qrBoxX + 4, qrBoxY + 3, 26, 22, 1.5, 1.5, "FD");
  doc.addImage(qrBase64Png, "PNG", qrBoxX + 6, qrBoxY + 4, 22, 20);

  doc.setTextColor(...COLORS.primaryDark);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("Verify Certificate", PAGE.width / 2, qrBoxY + 27.5, { align: "center" });

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("peakmedia.in/verify", PAGE.width / 2, qrBoxY + 30.5, { align: "center" });

  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(5);
  doc.text(`ID : ${cert.id}`, PAGE.width / 2, qrBoxY + 33.5, { align: "center" });

  // 4. Signature - HR
  const hrX = PAGE.width - PAGE.marginX - 28;
  doc.setTextColor(...COLORS.primaryDark);
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("HR Department", hrX, cursorY, { align: "center" });

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.3);
  doc.line(hrX - 20, cursorY + 2, hrX + 20, cursorY + 2);

  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Human Resources", hrX, cursorY + 6, { align: "center" });
  doc.text("Peak Media Pvt. Ltd.", hrX, cursorY + 9.5, { align: "center" });
}

function drawFooter(doc: jsPDF, hash: string) {
  let cursorY = PAGE.height - 21;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(PAGE.marginX, cursorY, PAGE.width - PAGE.marginX, cursorY);

  cursorY += 4.5;
  doc.setTextColor(...COLORS.primaryDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Peak Media Pvt. Ltd.", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 4;
  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text("hello@peakmedia.in   •   www.peakmedia.in   •   +91 95303 78007", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 3.5;
  doc.text("Mumbai   •   Bengaluru   •   Jaipur", PAGE.width / 2, cursorY, { align: "center" });

  cursorY += 3.5;
  doc.setTextColor(...COLORS.textSubtle);
  doc.setFontSize(5.5);
  doc.setFont("courier", "normal");
  doc.text(`Certificate Hash : ${hash}`, PAGE.width / 2, cursorY, { align: "center" });
}

async function generateCertificatePDF(cert: Certificate, qrBase64Png: string): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  drawPageBorders(doc);
  drawVerifiedBadge(doc);

  let currentY = drawHeader(doc, cert);
  currentY = drawTitleSection(doc, currentY);
  currentY = drawRecipientSection(doc, cert, currentY);
  currentY = drawBodyContent(doc, cert, currentY);
  currentY = drawDetailsGrid(doc, cert, currentY);
  drawSkillsSection(doc, cert, currentY);

  drawSignaturesAndSeal(doc, cert, qrBase64Png);
  drawFooter(doc, cert.hash);

  // Fix: Properly convert ArrayBuffer to Buffer without 'as any'
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawId = url.searchParams.get("id") ?? "";

    const cert = getCertificate(rawId);
    if (!cert) {
      return NextResponse.json(
        { ok: false, error: "Certificate not found." },
        { status: 404 }
      );
    }

    const verifyUrl = verifyUrlFor(cert.id);
    const qrDataUrl = await qrToDataUrl(verifyUrl, { margin: 1, width: 200 });

    const pdfBuffer = await generateCertificatePDF(cert, qrDataUrl);

    // Sanitize filename safely
    const safeName = cert.internName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
    const filename = `peak-media-certificate-${safeName}-${cert.id}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    // Added error logging for easier debugging
    console.error("[Certificate Generation Error]:", error);
    
    return NextResponse.json(
      { ok: false, error: "An error occurred while generating the PDF." },
      { status: 500 }
    );
  }
}