import crypto from "crypto";

// Processed webhook event IDs to ensure idempotent delivery
const processedEventIds = new Set<string>();

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

/**
 * Checks if a webhook payload with specific ID has already been ingested (Idempotency).
 * Returns true if new (not yet processed), false if duplicate.
 */
export function registerWebhookEventId(eventId: string): boolean {
  if (!eventId) return false;
  if (processedEventIds.has(eventId)) {
    return false; // Duplicate
  }
  processedEventIds.add(eventId);
  // Keep set size bounded to prevent memory growth
  if (processedEventIds.size > 1000) {
    const firstItem = processedEventIds.values().next().value;
    if (firstItem) processedEventIds.delete(firstItem);
  }
  return true;
}

export function clearWebhookEventCache(): void {
  processedEventIds.clear();
}
