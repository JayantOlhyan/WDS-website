import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { recruitmentService } from "@/lib/services/recruitmentService";
import { generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requireMinimumRole(req, "CORE_TEAM");
  if ("response" in auth) return auth.response;

  const result = await recruitmentService.getApplications();
  return NextResponse.json({ success: true, data: result.data, isOffline: result.isOffline }, { status: 200, headers: { "X-Request-ID": requestId } });
}
