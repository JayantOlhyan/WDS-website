import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { auditRepository } from "@/lib/repositories/AuditRepository";

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "system.audit.read");
  if ("response" in auth) return auth.response;

  const logs = await auditRepository.getRecentLogs(100);
  return NextResponse.json({ success: true, data: logs }, { status: 200 });
}
