import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { recruitmentRepository } from "@/lib/repositories/RecruitmentRepository";

export async function GET(req: NextRequest) {
  const auth = requireMinimumRole(req, "CORE_TEAM");
  if ("response" in auth) return auth.response;

  const result = await recruitmentRepository.getApplications();
  if (!result.success && result.isOffline) {
    return NextResponse.json(
      { success: false, data: [], code: "DATABASE_OFFLINE", message: "Recruitment database is offline or not configured." },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}
