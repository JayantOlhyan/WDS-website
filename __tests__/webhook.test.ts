import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyWebhookSignature } from "../lib/webhook";

describe("Bug Hunt Webhook HMAC SHA-256 Verification", () => {
  const secret = "test-webhook-secret-key-12345";
  const payload = JSON.stringify({
    bugId: "BH-99",
    title: "Navbar overflow on mobile",
    website: "https://msit.in",
    severity: "HIGH",
    reporterHandle: "qa_scout",
  });

  it("verifies valid HMAC SHA-256 signature", () => {
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const result = verifyWebhookSignature(payload, validSignature, secret);
    expect(result).toBe(true);
  });

  it("verifies valid signature with sha256= prefix", () => {
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const result = verifyWebhookSignature(payload, `sha256=${validSignature}`, secret);
    expect(result).toBe(true);
  });

  it("rejects tampered payload", () => {
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const tamperedPayload = payload + " ";
    const result = verifyWebhookSignature(tamperedPayload, validSignature, secret);
    expect(result).toBe(false);
  });

  it("rejects forged or invalid signature", () => {
    const result = verifyWebhookSignature(payload, "invalid-hex-signature-1234567890abcdef", secret);
    expect(result).toBe(false);
  });

  it("rejects missing signature or secret", () => {
    expect(verifyWebhookSignature(payload, null, secret)).toBe(false);
    expect(verifyWebhookSignature(payload, "sig", "")).toBe(false);
  });
});
