export interface SiteHealthResult {
  name: string;
  url: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | "IN_DEVELOPMENT";
  httpStatus?: number;
  responseTimeMs?: number;
  lastChecked: string;
}

export const MONITORED_SITES = [
  { name: "MSIT Official Portal", url: "https://msit.in", isLive: true },
  { name: "WDS Bug Hunt Platform", url: "https://wds-bug-hunt.netlify.app/bug-hunt", isLive: true },
  { name: "WDS GitHub Organization", url: "https://github.com/JayantOlhyan/WDS-website", isLive: true },
  { name: "WDS Tech Newsletter", url: "/projects#newsletter", isLive: false },
  { name: "Freshers Hub", url: "/projects#freshers-hub", isLive: false },
];

export async function checkSiteHealth(url: string): Promise<{
  isUp: boolean;
  statusCode?: number;
  durationMs: number;
}> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
      method: "HEAD",
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
  } catch (error) {
    return {
      isUp: false,
      statusCode: undefined,
      durationMs: Date.now() - start,
    };
  }
}
