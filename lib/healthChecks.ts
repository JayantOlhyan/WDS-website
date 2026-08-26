export interface SiteHealthResult {
  name: string;
  url: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | "IN_DEVELOPMENT";
  httpStatus?: number;
  responseTimeMs?: number;
  lastChecked: string;
}

// Strict allowlist of permitted external domains to prevent Server-Side Request Forgery (SSRF)
export const ALLOWED_HEALTH_CHECK_DOMAINS = [
  "msit.in",
  "wds-bug-hunt.netlify.app",
  "github.com",
];

export const MONITORED_SITES = [
  { name: "MSIT Official Portal", url: "https://msit.in", isLive: true },
  { name: "WDS Bug Hunt Platform", url: "https://wds-bug-hunt.netlify.app/bug-hunt", isLive: true },
  { name: "WDS GitHub Organization", url: "https://github.com/JayantOlhyan/WDS-website", isLive: true },
  { name: "WDS Tech Newsletter", url: "/projects#newsletter", isLive: false },
  { name: "Freshers Hub", url: "/projects#freshers-hub", isLive: false },
];

/**
 * Validates whether a target URL is in the strict allowlist and not pointing to private/internal IPs
 */
export function isUrlAllowedForHealthCheck(targetUrl: string): boolean {
  try {
    if (!targetUrl || typeof targetUrl !== "string") return false;

    // Internal relative site paths are safe
    if (targetUrl.startsWith("/")) return true;

    const parsed = new URL(targetUrl);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, IP literals, loopbacks, and private ranges
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("169.254.") || // Cloud metadata IP
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }

    // Must match allowed domain suffix
    return ALLOWED_HEALTH_CHECK_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export async function checkSiteHealth(url: string): Promise<{
  isUp: boolean;
  statusCode?: number;
  durationMs: number;
}> {
  if (!isUrlAllowedForHealthCheck(url)) {
    return {
      isUp: false,
      statusCode: 403,
      durationMs: 0,
    };
  }

  // If internal relative route, return simulated local benchmark
  if (url.startsWith("/")) {
    return {
      isUp: true,
      statusCode: 200,
      durationMs: 8,
    };
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "error", // Prevent open redirects to unauthorized internal destinations
      headers: { "User-Agent": "WDS-HealthCheck/2.0" },
    });
    clearTimeout(timeoutId);
    const duration = Date.now() - start;
    return {
      isUp: res.ok || res.status < 400,
      statusCode: res.status,
      durationMs: duration,
    };
  } catch {
    return {
      isUp: false,
      statusCode: undefined,
      durationMs: Date.now() - start,
    };
  }
}
