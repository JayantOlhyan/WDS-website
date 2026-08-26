export interface SiteHealthResult {
  name: string;
  url: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | "IN_DEVELOPMENT";
  httpStatus?: number;
  responseTimeMs?: number;
  lastChecked: string;
}

// Strict whitelist of permitted domains to prevent Server-Side Request Forgery (SSRF)
export const ALLOWED_HEALTH_CHECK_DOMAINS = [
  "msit.in",
  "wds-bug-hunt.netlify.app",
  "github.com",
  "localhost",
];

export const MONITORED_SITES = [
  { name: "MSIT Official Portal", url: "https://msit.in", isLive: true },
  { name: "WDS Bug Hunt Platform", url: "https://wds-bug-hunt.netlify.app/bug-hunt", isLive: true },
  { name: "WDS GitHub Organization", url: "https://github.com/JayantOlhyan/WDS-website", isLive: true },
  { name: "WDS Tech Newsletter", url: "/projects#newsletter", isLive: false },
  { name: "Freshers Hub", url: "/projects#freshers-hub", isLive: false },
];

export function isUrlAllowedForHealthCheck(targetUrl: string): boolean {
  try {
    if (targetUrl.startsWith("/")) return true; // Relative internal path
    const parsed = new URL(targetUrl);
    return ALLOWED_HEALTH_CHECK_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
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

  // If internal relative route, treat as healthy local route
  if (url.startsWith("/")) {
    return {
      isUp: true,
      statusCode: 200,
      durationMs: 12,
    };
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "WDS-HealthCheck/1.0" },
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
