import { NextResponse } from "next/server";
import { MONITORED_SITES, checkSiteHealth, SiteHealthResult } from "@/lib/healthChecks";

export async function GET() {
  const results: SiteHealthResult[] = [];

  for (const site of MONITORED_SITES) {
    if (!site.isLive) {
      results.push({
        name: site.name,
        url: site.url,
        status: "IN_DEVELOPMENT",
        lastChecked: "Sprint Backlog",
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
      lastChecked: "Just now",
    });
  }

  return NextResponse.json({ success: true, timestamp: Date.now(), results }, { status: 200 });
}
