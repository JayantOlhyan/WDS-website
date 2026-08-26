import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { MONITORED_SITES, checkSiteHealth, SiteHealthResult } from "@/lib/healthChecks";

export async function GET(req: NextRequest) {
  const auth = requireMinimumRole(req, "MEMBER");
  if ("response" in auth) return auth.response;

  const results: SiteHealthResult[] = [];
  const nowIso = new Date().toISOString();

  for (const site of MONITORED_SITES) {
    if (!site.isLive) {
      results.push({
        name: site.name,
        url: site.url,
        status: "IN_DEVELOPMENT",
        lastChecked: nowIso,
      });
      continue;
    }

    const check = await checkSiteHealth(site.url);
    results.push({
      name: site.name,
      url: site.url,
      status: check.isUp ? "ONLINE" : "OFFLINE",
      httpStatus: check.statusCode,
      responseTimeMs: check.durationMs,
      lastChecked: nowIso,
    });
  }

  return NextResponse.json(
    { success: true, timestamp: nowIso, results },
    { status: 200 }
  );
}
