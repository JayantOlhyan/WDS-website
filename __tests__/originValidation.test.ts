import { describe, it, expect } from "vitest";
import { validateRequestOrigin, requireSession } from "../lib/auth";
import { sessionStore } from "../lib/sessionStore";
import { NextRequest } from "next/server";

describe("CSRF & Origin / Referer Validation", () => {
  it("allows safe GET requests unconditionally", () => {
    const req = new NextRequest("http://localhost:3000/api/hub/tasks", {
      method: "GET",
    });
    expect(validateRequestOrigin(req)).toBe(true);
  });

  it("validates matching origin on state-changing POST requests", () => {
    const req = new NextRequest("http://localhost:3000/api/hub/tasks", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        host: "localhost:3000",
      },
    });
    expect(validateRequestOrigin(req)).toBe(true);
  });

  it("rejects unauthorized third-party origin on state-changing requests", () => {
    const req = new NextRequest("https://wds-msit.vercel.app/api/hub/tasks", {
      method: "POST",
      headers: {
        origin: "https://malicious-attacker-site.com",
        host: "wds-msit.vercel.app",
      },
    });
    expect(validateRequestOrigin(req)).toBe(false);
  });

  it("requireSession blocks cross-origin state-changing requests with 403 Forbidden", () => {
    const session = sessionStore.createSession("AdminUser", "ADMIN", "Technical");
    const req = new NextRequest("https://wds-msit.vercel.app/api/hub/tasks", {
      method: "POST",
      headers: {
        origin: "https://evil-site.com",
        host: "wds-msit.vercel.app",
        cookie: `wds_hub_session=${session.token}`,
      },
    });

    const result = requireSession(req);
    expect("response" in result).toBe(true);
    if ("response" in result) {
      expect(result.response.status).toBe(403);
    }
  });
});
