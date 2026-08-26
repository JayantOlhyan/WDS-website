import crypto from "crypto";
import { HubRole } from "./auth";

export interface ServerSession {
  sessionId: string;
  username: string;
  role: HubRole;
  wing: string;
  createdAt: number;
  expiresAt: number;
}

// 7 days in milliseconds
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Server-side in-memory session registry (opaque token lookup)
class ServerSessionStore {
  private sessions = new Map<string, ServerSession>();

  constructor() {
    // Run background cleanup of expired sessions every hour
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanupExpired(), 60 * 60 * 1000);
    }
  }

  /**
   * Generates a cryptographically secure 256-bit random session token
   */
  public createSession(username: string, role: HubRole, wing: string): ServerSession {
    const sessionId = crypto.randomBytes(32).toString("hex");
    const now = Date.now();
    const session: ServerSession = {
      sessionId,
      username,
      role,
      wing,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Looks up and validates a session by opaque session ID
   */
  public getSession(sessionId: string): ServerSession | null {
    if (!sessionId || typeof sessionId !== "string") return null;

    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check expiration
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Destroys/revokes a session
   */
  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Prunes all expired sessions from memory
   */
  public cleanupExpired(): void {
    const now = Date.now();
    this.sessions.forEach((session, id) => {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    });
  }

  /**
   * Returns active session count for diagnostics
   */
  public getActiveCount(): number {
    return this.sessions.size;
  }
}

// Global singleton instance across route handlers
const globalStore = global as unknown as { __wds_session_store__?: ServerSessionStore };
if (!globalStore.__wds_session_store__) {
  globalStore.__wds_session_store__ = new ServerSessionStore();
}

export const sessionStore = globalStore.__wds_session_store__;
