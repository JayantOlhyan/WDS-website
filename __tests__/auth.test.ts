import { describe, it, expect, beforeEach } from "vitest";
import { sessionStore } from "../lib/sessionStore";
import { validateAccessKey } from "../lib/auth";

describe("Server-Side Authentication & Session Management", () => {
  beforeEach(() => {
    sessionStore.cleanupExpired();
  });

  it("creates a cryptographically secure 64-character hex session ID", () => {
    const session = sessionStore.createSession("Jayant", "ADMIN", "President");
    expect(session.sessionId).toBeDefined();
    expect(session.sessionId).toHaveLength(64);
    expect(session.role).toBe("ADMIN");
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it("retrieves a valid session from memory store", () => {
    const session = sessionStore.createSession("Tester", "MEMBER", "Technical");
    const retrieved = sessionStore.getSession(session.sessionId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.username).toBe("Tester");
    expect(retrieved?.role).toBe("MEMBER");
  });

  it("rejects non-existent or forged session IDs", () => {
    const forged = sessionStore.getSession("forged-fake-session-token-12345");
    expect(forged).toBeNull();
  });

  it("destroys session on logout", () => {
    const session = sessionStore.createSession("LogoutUser", "TEAM_LEAD", "Design");
    expect(sessionStore.getSession(session.sessionId)).not.toBeNull();

    sessionStore.deleteSession(session.sessionId);
    expect(sessionStore.getSession(session.sessionId)).toBeNull();
  });

  it("validates access key against configured roles in dev", () => {
    const admin = validateAccessKey("wds-admin-2026");
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe("ADMIN");

    const invalid = validateAccessKey("completely-wrong-password");
    expect(invalid).toBeNull();
  });
});
