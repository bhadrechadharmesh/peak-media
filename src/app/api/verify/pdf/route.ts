import { NextResponse } from "next/server";
import { getCertificate, type Certificate } from "@/data/certificates";
import { qrToDataUrl, verifyUrlFor } from "@/lib/qr";
import PDFDocument from "pdfkit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Build a single-page PDF document using PDFKit. */
function generateCertificatePDF(cert: Certificate, qrBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Standard A4 portrait size in points: 595.28 x 841.89
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: `Peak Media — Certificate ${cert.id}`,
        Author: "Peak Media Pvt. Ltd.",
        Subject: `Internship Completion Certificate - ${cert.internName}`,
      },
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    const width = 595.28;
    const height = 841.89;

    // Top gold accent bar
    doc
      .rect(0, 0, width, 8)
      .fillColor("#c89b3c")
      .fill();

    // Outer navy border
    doc
      .rect(14, 14, width - 28, height - 28)
      .lineWidth(1.5)
      .strokeColor("#1e3a8a")
      .stroke();

    // Inner subtle border
    doc
      .rect(22, 22, width - 44, height - 44)
      .lineWidth(0.5)
      .strokeColor("#d8d8d8")
      .stroke();

    // Verified badge (top right)
    doc
      .roundedRect(width - 125, 35, 80, 22, 11)
      .fillAndStroke("#ecfdf5", "#bbf7d0");
    
    doc
      .fillColor("#047857")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("VERIFIED", width - 125, 42, { width: 80, align: "center" });

    // Header Logo & Company Name
    const marginX = 45;
    let cursorY = 45;

    // Logo icon box
    doc
      .roundedRect(marginX, cursorY, 40, 40, 8)
      .fillColor("#1e40af")
      .fill();

    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("P", marginX, cursorY + 8, { width: 40, align: "center" });

    // Company title
    doc
      .fillColor("#0f172a")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Peak Media", marginX + 50, cursorY + 2);

    doc
      .fillColor("#64748b")
      .fontSize(8)
      .font("Helvetica")
      .text("PERFORMANCE MARKETING COMPANY", marginX + 50, cursorY + 26);

    // Meta details (Certificate ID & Date) right header
    doc
      .fillColor("#64748b")
      .fontSize(8)
      .font("Helvetica")
      .text("Certificate ID", width - 240, cursorY + 4, { width: 100, align: "right" })
      .text("Issue Date", width - 240, cursorY + 22, { width: 100, align: "right" });

    doc
      .fillColor("#111827")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(cert.id, width - 135, cursorY + 4, { width: 100, align: "left" })
      .text(cert.issueDate, width - 135, cursorY + 22, { width: 100, align: "left" });

    // Divider line
    cursorY = 100;
    doc
      .moveTo(marginX, cursorY)
      .lineTo(width - marginX, cursorY)
      .lineWidth(1.5)
      .strokeColor("#1e3a8a")
      .stroke();

    // Certificate Main Title
    cursorY += 25;
    doc
      .fillColor("#0f172a")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("CERTIFICATE", 0, cursorY, { align: "center" });

    cursorY += 28;
    doc
      .fillColor("#c89b3c")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("OF INTERNSHIP COMPLETION", 0, cursorY, { align: "center" });

    cursorY += 20;
    doc
      .moveTo(width / 2 - 50, cursorY)
      .lineTo(width / 2 + 50, cursorY)
      .lineWidth(2)
      .strokeColor("#c89b3c")
      .stroke();

    // Recipient Section
    cursorY += 25;
    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica")
      .text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", 0, cursorY, { align: "center" });

    cursorY += 16;
    doc
      .fillColor("#0f172a")
      .fontSize(26)
      .font("Helvetica-Bold")
      .text(cert.internName, 0, cursorY, { align: "center" });

    cursorY += 32;
    doc
      .fillColor("#374151")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(cert.role, 0, cursorY, { align: "center" });

    // Paragraph Content
    cursorY += 25;
    const bodyText = `This certificate is awarded to ${cert.internName} in recognition of the successful completion of the ${cert.duration} Internship Program at Peak Media Pvt. Ltd. as a ${cert.role} in the ${cert.department} department from ${cert.startDate} to ${cert.endDate}.\n\nThroughout the internship, the candidate demonstrated professionalism, technical expertise, analytical thinking, dedication, and a strong willingness to learn while contributing to real client projects and internal business initiatives.`;

    doc
      .fillColor("#374151")
      .fontSize(9.5)
      .font("Helvetica")
      .text(bodyText, marginX + 20, cursorY, {
        width: width - (marginX + 20) * 2,
        align: "center",
        lineGap: 4,
      });

    // Details Grid (2 columns, 3 rows)
    cursorY += 105;
    const cardWidth = 230;
    const cardHeight = 34;
    const gapX = 20;
    const gapY = 10;
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

      doc
        .roundedRect(x, y, cardWidth, cardHeight, 4)
        .fillAndStroke("#f8fafc", "#e5e7eb");

      doc
        .rect(x, y, 3, cardHeight)
        .fillColor("#1e40af")
        .fill();

      doc
        .fillColor("#94a3b8")
        .fontSize(7)
        .font("Helvetica-Bold")
        .text(item.label, x + 10, y + 6);

      doc
        .fillColor("#111827")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(item.value, x + 10, y + 18, { width: cardWidth - 15, ellipsis: true });
    });

    // Skills Section
    cursorY += 3 * (cardHeight + gapY) + 10;
    doc
      .fillColor("#64748b")
      .fontSize(8)
      .font("Helvetica-Bold")
      .text("SKILLS DEMONSTRATED", 0, cursorY, { align: "center" });

    cursorY += 15;
    const skillsText = cert.skills.join("   •   ");
    doc
      .fillColor("#1e40af")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(skillsText, 0, cursorY, { align: "center" });

    // Bottom Signatures & QR Code Section
    cursorY = height - 195;

    // Signature 1: Mentor
    doc
      .fillColor("#0f172a")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(cert.mentor, marginX + 10, cursorY, { width: 140, align: "center" });

    doc
      .moveTo(marginX + 10, cursorY + 20)
      .lineTo(marginX + 150, cursorY + 20)
      .lineWidth(1)
      .strokeColor("#1f2937")
      .stroke();

    doc
      .fillColor("#64748b")
      .fontSize(8)
      .font("Helvetica")
      .text("Senior Strategist", marginX + 10, cursorY + 26, { width: 140, align: "center" })
      .text("Peak Media Pvt. Ltd.", marginX + 10, cursorY + 36, { width: 140, align: "center" });

    // Signature 2: HR Department
    doc
      .fillColor("#0f172a")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("HR Department", width - marginX - 150, cursorY, { width: 140, align: "center" });

    doc
      .moveTo(width - marginX - 150, cursorY + 20)
      .lineTo(width - marginX - 10, cursorY + 20)
      .lineWidth(1)
      .strokeColor("#1f2937")
      .stroke();

    doc
      .fillColor("#64748b")
      .fontSize(8)
      .font("Helvetica")
      .text("Human Resources", width - marginX - 150, cursorY + 26, { width: 140, align: "center" })
      .text("Peak Media Pvt. Ltd.", width - marginX - 150, cursorY + 36, { width: 140, align: "center" });

    // Center QR Verification Box
    const qrBoxWidth = 100;
    const qrBoxX = (width - qrBoxWidth) / 2;
    const qrBoxY = cursorY - 10;

    doc
      .roundedRect(qrBoxX, qrBoxY, qrBoxWidth, 110, 6)
      .fillAndStroke("#fafafa", "#e5e7eb");

    doc.image(qrBuffer, qrBoxX + 17.5, qrBoxY + 8, { width: 65, height: 65 });

    doc
      .fillColor("#0f172a")
      .fontSize(7.5)
      .font("Helvetica-Bold")
      .text("Verify Certificate", qrBoxX, qrBoxY + 76, { width: qrBoxWidth, align: "center" });

    doc
      .fillColor("#2563eb")
      .fontSize(6.5)
      .font("Helvetica")
      .text("peakmedia.in/verify", qrBoxX, qrBoxY + 87, { width: qrBoxWidth, align: "center" });

    doc
      .fillColor("#64748b")
      .fontSize(6)
      .font("Helvetica")
      .text(`ID: ${cert.id}`, qrBoxX, qrBoxY + 97, { width: qrBoxWidth, align: "center" });

    // Footer
    cursorY = height - 55;
    doc
      .moveTo(marginX, cursorY)
      .lineTo(width - marginX, cursorY)
      .lineWidth(0.5)
      .strokeColor("#cbd5e1")
      .stroke();

    cursorY += 8;
    doc
      .fillColor("#0f172a")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Peak Media Pvt. Ltd.", 0, cursorY, { align: "center" });

    cursorY += 12;
    doc
      .fillColor("#64748b")
      .fontSize(7.5)
      .font("Helvetica")
      .text("hello@peakmedia.in   •   www.peakmedia.in   •   +91 80 4567 8900", 0, cursorY, { align: "center" });

    cursorY += 10;
    doc
      .fillColor("#94a3b8")
      .fontSize(6.5)
      .font("Helvetica")
      .text(`Certificate Hash : ${cert.hash}`, 0, cursorY, { align: "center" });

    doc.end();
  });
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

  // Generate QR image buffer
  const verifyUrl = verifyUrlFor(cert.id);
  const qrDataUrl = await qrToDataUrl(verifyUrl, { margin: 1, width: 200 });
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(base64Data, "base64");

  const pdfBytes = await generateCertificatePDF(cert, qrBuffer);

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
