import crypto from "crypto";

/**
 * Validates HMAC SHA-256 signature using timing-safe comparison
 */
export function verifyWebhookSignature(
  rawPayload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawPayload)
    .digest("hex");

  const cleanHeader = signatureHeader.trim().replace(/^sha256=/, "");
  if (!/^[0-9a-fA-F]+$/.test(cleanHeader)) return false;

  const sigBuffer = Buffer.from(cleanHeader, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}
