import QRCode from "qrcode";
import crypto from "crypto";

export function generateSecurityToken(): string {
  return crypto.randomUUID();
}

/**
 * Generates an access URL containing only the opaque security token (Zero PII).
 */
export function getPassVerificationUrl(baseUrl: string, token: string): string {
  const cleanBase = baseUrl.replace(/\/$/, "");
  return `${cleanBase}/verify-pass/${token}`;
}

/**
 * Renders QR code as high-contrast Base64 Data URL (Level M error correction)
 */
export async function generateQrDataUrl(content: string): Promise<string> {
  try {
    return await QRCode.toDataURL(content, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
      color: {
        dark: "#0f172a", // Slate 900
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error generating QR code:", err);
    throw err;
  }
}
