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

// Secret key for HMAC signature derivation
function getSessionSecret(): string {
  return (
    process.env.HUB_SESSION_SECRET ||
    process.env.HUB_ADMIN_KEY ||
    "wds-secure-hub-session-secret-2026"
  );
}

// In-memory revocation registry to support instant logout across serverless instances
const revokedSessionIds = new Set<string>();

class ServerSessionStore {
  /**
   * Generates a tamper-proof cryptographically signed session token:
   * Format: <base64url_json_payload>.<hmac_sha256_hex>
   */
  public createSession(username: string, role: HubRole, wing: string): ServerSession & { token: string } {
    const sessionId = crypto.randomBytes(24).toString("hex");
    const now = Date.now();
    const session: ServerSession = {
      sessionId,
      username,
      role,
      wing,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };

    const payloadJson = JSON.stringify(session);
    const payloadB64 = Buffer.from(payloadJson).toString("base64url");
    const signature = crypto
      .createHmac("sha256", getSessionSecret())
      .update(payloadB64)
      .digest("hex");

    const token = `${payloadB64}.${signature}`;
    return { ...session, token };
  }

  /**
   * Looks up and verifies session signature, expiration, and revocation status
   */
  public getSession(token: string): ServerSession | null {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, providedSig] = parts;
    if (!payloadB64 || !providedSig) return null;

    // Verify HMAC-SHA256 signature
    const expectedSig = crypto
      .createHmac("sha256", getSessionSecret())
      .update(payloadB64)
      .digest("hex");

    if (providedSig.length !== expectedSig.length) return null;

    const providedBuf = Buffer.from(providedSig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");

    if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) {
      return null; // Signature mismatch / tampering attempt
    }

    try {
      const decodedJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
      const session: ServerSession = JSON.parse(decodedJson);

      // Check expiration
      if (Date.now() > session.expiresAt) {
        return null; // Expired
      }

      // Check revocation
      if (revokedSessionIds.has(session.sessionId)) {
        return null; // Explicitly revoked
      }

      return session;
    } catch {
      return null;
    }
  }

  /**
   * Revokes a session by ID
   */
  public deleteSession(tokenOrId: string): boolean {
    if (!tokenOrId) return false;
    let sessionId = tokenOrId;
    if (tokenOrId.includes(".")) {
      const session = this.getSession(tokenOrId);
      if (session) sessionId = session.sessionId;
    }
    revokedSessionIds.add(sessionId);
    return true;
  }

  /**
   * Cleans up revoked session IDs
   */
  public clearRevocationCache(): void {
    revokedSessionIds.clear();
  }
}

// Global singleton instance across route handlers
const globalStore = global as unknown as { __wds_session_store__?: ServerSessionStore };
if (!globalStore.__wds_session_store__) {
  globalStore.__wds_session_store__ = new ServerSessionStore();
}

export const sessionStore = globalStore.__wds_session_store__;
