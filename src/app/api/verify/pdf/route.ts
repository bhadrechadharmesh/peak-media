import { NextResponse } from "next/server";
import { getCertificate, type Certificate } from "@/data/certificates";
import { qrToDataUrl, verifyUrlFor } from "@/lib/qr";
import { jsPDF } from "jspdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Build a single-page PDF document using jsPDF. */
async function generateCertificatePDF(cert: Certificate, qrBase64Png: string): Promise<Buffer> {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const width = 210;
  const height = 297;

  // Top gold accent bar
  doc.setFillColor(200, 155, 60); // #c89b3c
  doc.rect(0, 0, width, 3, "F");

  // Outer navy border
  doc.setDrawColor(30, 58, 138); // #1e3a8a
  doc.setLineWidth(0.6);
  doc.rect(5, 5, width - 10, height - 10, "S");

  // Inner subtle border
  doc.setDrawColor(216, 216, 216); // #d8d8d8
  doc.setLineWidth(0.2);
  doc.rect(8, 8, width - 16, height - 16, "S");

  // Verified badge (top right)
  doc.setFillColor(236, 253, 245); // #ecfdf5
  doc.setDrawColor(187, 247, 208); // #bbf7d0
  doc.setLineWidth(0.3);
  doc.roundedRect(width - 45, 12, 30, 8, 4, 4, "FD");

  doc.setTextColor(4, 120, 87); // #047857
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("VERIFIED", width - 30, 17.5, { align: "center" });

  // Header Logo & Company Name
  const marginX = 16;
  let cursorY = 16;

  // Logo icon box
  doc.setFillColor(30, 64, 175); // #1e40af
  doc.roundedRect(marginX, cursorY, 14, 14, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("P", marginX + 7, cursorY + 10, { align: "center" });

  // Company title
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Peak Media", marginX + 18, cursorY + 7);

  doc.setTextColor(100, 116, 139); // #64748b
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("PERFORMANCE MARKETING COMPANY", marginX + 18, cursorY + 12);

  // Meta details (Certificate ID & Date) right header
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text("Certificate ID:", width - 85, cursorY + 4, { align: "right" });
  doc.text("Issue Date:", width - 85, cursorY + 10, { align: "right" });

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(cert.id, width - 48, cursorY + 4, { align: "left" });
  doc.text(cert.issueDate, width - 48, cursorY + 10, { align: "left" });

  // Divider line
  cursorY = 35;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.line(marginX, cursorY, width - marginX, cursorY);

  // Certificate Main Title
  cursorY += 14;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", width / 2, cursorY, { align: "center" });

  cursorY += 8;
  doc.setTextColor(200, 155, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("OF INTERNSHIP COMPLETION", width / 2, cursorY, { align: "center" });

  cursorY += 5;
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.8);
  doc.line(width / 2 - 20, cursorY, width / 2 + 20, cursorY);

  // Recipient Section
  cursorY += 10;
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", width / 2, cursorY, { align: "center" });

  cursorY += 8;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(cert.internName, width / 2, cursorY, { align: "center" });

  cursorY += 8;
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(cert.role, width / 2, cursorY, { align: "center" });

  // Paragraph Content
  cursorY += 9;
  const p1 = `This certificate is awarded to ${cert.internName} in recognition of the successful completion of the ${cert.duration} Internship Program at Peak Media Pvt. Ltd. as a ${cert.role} in the ${cert.department} department from ${cert.startDate} to ${cert.endDate}.`;
  const p2 = `Throughout the internship, the candidate demonstrated professionalism, technical expertise, analytical thinking, dedication, and a strong willingness to learn while contributing to real client projects and internal business initiatives.`;

  doc.setTextColor(55, 65, 81);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const splitP1 = doc.splitTextToSize(p1, width - (marginX + 10) * 2);
  doc.text(splitP1, width / 2, cursorY, { align: "center" });

  cursorY += splitP1.length * 4 + 3;
  const splitP2 = doc.splitTextToSize(p2, width - (marginX + 10) * 2);
  doc.text(splitP2, width / 2, cursorY, { align: "center" });

  cursorY += splitP2.length * 4 + 8;

  // Details Grid (2 columns, 3 rows)
  const cardWidth = 82;
  const cardHeight = 12;
  const gapX = 8;
  const gapY = 4;
  const gridLeft = (width - (cardWidth * 2 + gapX)) / 2;

  const details = [
    { label: "INTERN", value: cert.internName },
    { label: "ROLE", value: cert.role },
    { label: "DEPARTMENT", value: cert.department },
    { label: "GRADE", value: cert.grade },
    { label: "INTERNSHIP DURATION", value: `${cert.startDate} — ${cert.endDate}` },
    { label: "LOCATION", value: cert.location },
  ];

  details.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = gridLeft + col * (cardWidth + gapX);
    const y = cursorY + row * (cardHeight + gapY);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, "FD");

    doc.setFillColor(30, 64, 175);
    doc.rect(x, y, 1.2, cardHeight, "F");

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, x + 4, y + 3.5);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, x + 4, y + 8.5);
  });

  // Skills Section
  cursorY += 3 * (cardHeight + gapY) + 6;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("SKILLS DEMONSTRATED", width / 2, cursorY, { align: "center" });

  cursorY += 5;
  const skillsText = cert.skills.join("   •   ");
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(skillsText, width / 2, cursorY, { align: "center" });

  // Bottom Signatures & QR Code Section
  cursorY = height - 68;

  // Signature 1: Mentor
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(cert.mentor, marginX + 25, cursorY, { align: "center" });

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.3);
  doc.line(marginX + 5, cursorY + 3, marginX + 45, cursorY + 3);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Senior Strategist", marginX + 25, cursorY + 7, { align: "center" });
  doc.text("Peak Media Pvt. Ltd.", marginX + 25, cursorY + 11, { align: "center" });

  // Signature 2: HR Department
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("HR Department", width - marginX - 25, cursorY, { align: "center" });

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.3);
  doc.line(width - marginX - 45, cursorY + 3, width - marginX - 5, cursorY + 3);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Human Resources", width - marginX - 25, cursorY + 7, { align: "center" });
  doc.text("Peak Media Pvt. Ltd.", width - marginX - 25, cursorY + 11, { align: "center" });

  // Center QR Verification Box
  const qrBoxWidth = 36;
  const qrBoxX = (width - qrBoxWidth) / 2;
  const qrBoxY = cursorY - 5;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.2);
  doc.roundedRect(qrBoxX, qrBoxY, qrBoxWidth, 38, 2, 2, "FD");

  doc.addImage(qrBase64Png, "PNG", qrBoxX + 6, qrBoxY + 3, 24, 24);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("Verify Certificate", width / 2, qrBoxY + 29, { align: "center" });

  doc.setTextColor(37, 99, 235);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("peakmedia.in/verify", width / 2, qrBoxY + 32.5, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${cert.id}`, width / 2, qrBoxY + 35.5, { align: "center" });

  // Footer
  cursorY = height - 20;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(marginX, cursorY, width - marginX, cursorY);

  cursorY += 4;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Peak Media Pvt. Ltd.", width / 2, cursorY, { align: "center" });

  cursorY += 4;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("hello@peakmedia.in   •   www.peakmedia.in   •   +91 80 4567 8900", width / 2, cursorY, { align: "center" });

  cursorY += 3.5;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text(`Certificate Hash : ${cert.hash}`, width / 2, cursorY, { align: "center" });

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
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

  // Generate QR image data URL
  const verifyUrl = verifyUrlFor(cert.id);
  const qrDataUrl = await qrToDataUrl(verifyUrl, { margin: 1, width: 200 });

  const pdfBuffer = await generateCertificatePDF(cert, qrDataUrl);

  const safeName = cert.internName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  const filename = `Peak-Media-Certificate-${safeName}-${cert.id}.pdf`;

  return new NextResponse(pdfBuffer as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
