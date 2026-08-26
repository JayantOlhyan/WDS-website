import { describe, it, expect } from "vitest";
import { generateRequestId, createErrorResponse } from "../lib/errors";

describe("Request ID Tracing & Structured Error Formatting", () => {
  it("generates random opaque request identifiers with req_ prefix", () => {
    const id1 = generateRequestId();
    const id2 = generateRequestId();

    expect(id1).toMatch(/^req_[0-9a-f]{16}$/);
    expect(id2).toMatch(/^req_[0-9a-f]{16}$/);
    expect(id1).not.toBe(id2);
  });

  it("builds a RFC-compliant structured error response with X-Request-ID header", async () => {
    const res = createErrorResponse(
      "FORBIDDEN",
      "User does not possess sufficient role clearance.",
      403
    );

    expect(res.status).toBe(403);
    const headerReqId = res.headers.get("X-Request-ID");
    expect(headerReqId).toMatch(/^req_[0-9a-f]{16}$/);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("FORBIDDEN");
    expect(body.error.message).toBe("User does not possess sufficient role clearance.");
    expect(body.error.requestId).toBe(headerReqId);
  });
});
