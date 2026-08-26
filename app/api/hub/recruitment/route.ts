import { NextRequest, NextResponse } from "next/server";
import { getHubSessionFromRequest, hasRequiredRole } from "@/lib/auth";
import { fetchRecruitmentApplications } from "@/lib/notion/recruitment";

export async function GET(req: NextRequest) {
  const session = getHubSessionFromRequest(req);
  if (!session || !hasRequiredRole(session, "CORE_TEAM")) {
    return NextResponse.json(
      { error: "Forbidden. Core Team or Admin role required to view candidate records." },
      { status: 403 }
    );
  }

  const { applications, source } = await fetchRecruitmentApplications();
  return NextResponse.json({ success: true, applications, source }, { status: 200 });
}
