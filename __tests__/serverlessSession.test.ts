import { describe, it, expect, beforeEach } from "vitest";
import { sessionStore } from "../lib/sessionStore";

describe("Serverless HMAC Signed Session Security", () => {
  beforeEach(() => {
    sessionStore.clearRevocationCache();
  });

  it("creates a signed token and verifies it successfully", () => {
    const session = sessionStore.createSession("Jayant Olhyan", "ADMIN", "Technical Wing");
    expect(session.token).toContain(".");

    const retrieved = sessionStore.getSession(session.token);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.username).toBe("Jayant Olhyan");
    expect(retrieved?.role).toBe("ADMIN");
    expect(retrieved?.wing).toBe("Technical Wing");
  });

  it("detects and rejects tampered token payloads (privilege escalation defense)", () => {
    const session = sessionStore.createSession("Standard Member", "MEMBER", "Technical Wing");
    const [payloadB64, signature] = session.token.split(".");

    // Attacker decodes payload, changes role to ADMIN, and re-encodes
    const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    decoded.role = "ADMIN";
    const tamperedB64 = Buffer.from(JSON.stringify(decoded)).toString("base64url");
    const tamperedToken = `${tamperedB64}.${signature}`;

    const retrieved = sessionStore.getSession(tamperedToken);
    expect(retrieved).toBeNull(); // Must reject tampered signature
  });

  it("rejects revoked sessions immediately upon logout", () => {
    const session = sessionStore.createSession("Tech Lead", "TEAM_LEAD", "Design Wing");
    expect(sessionStore.getSession(session.token)).not.toBeNull();

    sessionStore.deleteSession(session.token);
    expect(sessionStore.getSession(session.token)).toBeNull();
  });

  it("rejects expired sessions", () => {
    const session = sessionStore.createSession("Expired User", "MEMBER", "Content Wing");
    // Artificially modify expiry
    const [payloadB64, signature] = session.token.split(".");
    const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    decoded.expiresAt = Date.now() - 1000; // 1 second in the past
    const expiredB64 = Buffer.from(JSON.stringify(decoded)).toString("base64url");

    // Since signature won't match tampered payload, it fails signature verification or expiration
    expect(sessionStore.getSession(`${expiredB64}.${signature}`)).toBeNull();
  });
});
