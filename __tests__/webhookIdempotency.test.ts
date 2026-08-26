import { describe, it, expect, beforeEach } from "vitest";
import { registerWebhookEventId, clearWebhookEventCache } from "../lib/webhook";

describe("Bug Hunt Webhook Idempotency & Deduplication", () => {
  beforeEach(() => {
    clearWebhookEventCache();
  });

  it("accepts a new unique event ID on first ingestion", () => {
    const isNew = registerWebhookEventId("BUG-EVENT-101");
    expect(isNew).toBe(true);
  });

  it("rejects duplicate event ID on subsequent ingestion (idempotent)", () => {
    registerWebhookEventId("BUG-EVENT-102");
    const isDuplicate = registerWebhookEventId("BUG-EVENT-102");
    expect(isDuplicate).toBe(false);
  });

  it("handles multiple distinct event IDs independently", () => {
    expect(registerWebhookEventId("BUG-EVENT-A")).toBe(true);
    expect(registerWebhookEventId("BUG-EVENT-B")).toBe(true);
    expect(registerWebhookEventId("BUG-EVENT-A")).toBe(false);
    expect(registerWebhookEventId("BUG-EVENT-B")).toBe(false);
  });
});
