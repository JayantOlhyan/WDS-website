import { NextRequest, NextResponse } from "next/server";
import { collegeInfoRepository } from "@/lib/repositories/CollegeInfoRepository";
import { createErrorResponse, generateRequestId } from "@/lib/errors";

export async function GET() {
  const requestId = generateRequestId();
  const result = await collegeInfoRepository.getAll();

  if (!result.success && result.isOffline) {
    return createErrorResponse("DATABASE_OFFLINE", "Notion College Info database is offline or unconfigured.", 503, undefined, requestId);
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200, headers: { "X-Request-ID": requestId } });
}
