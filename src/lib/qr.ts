/**
 * QR code helpers for certificate verification.
 *
 * The QR encodes the public verification URL:
 *   https://peakmedia.in/verify?id=<certificate-id>
 *
 * Scanning it opens the /verify page with that ID pre-checked against the
 * registry — so anyone receiving a printed/PDF certificate can instantly
 * confirm it is genuine.
 */

import QRCode from "qrcode";

/** The base verification URL the QR resolves to. */
export const VERIFY_BASE_URL = "https://peakmedia.in/verify";

/** Build the verification URL for a given certificate id. */
export function verifyUrlFor(certId: string): string {
  return `${VERIFY_BASE_URL}?id=${encodeURIComponent(certId)}`;
}

/**
 * Generate a QR code as an SVG string (dark modules on transparent background).
 * Used by the PDF route (Playwright renders the SVG inline).
 */
export async function qrToSvg(
  text: string,
  opts?: { margin?: number; scale?: number }
): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: opts?.margin ?? 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#05070d", // ink — matches the certificate's dark modules
      light: "#0000", // transparent
    },
  });
}

/**
 * Generate a QR code as a PNG data URL (dark on transparent).
 * Used by the on-screen certificate (FauxQR is replaced with this).
 */
export async function qrToDataUrl(
  text: string,
  opts?: { margin?: number; width?: number }
): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: opts?.margin ?? 1,
    width: opts?.width ?? 240,
    errorCorrectionLevel: "M",
    color: {
      dark: "#05070d",
      light: "#ffffff", // white pads so it scans cleanly on dark backgrounds
    },
  });
}
