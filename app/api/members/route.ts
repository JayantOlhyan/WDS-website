import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { memberService } from "@/lib/services/memberService";
import { generateRequestId } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const auth = requirePermission(req, "members.read");
  if ("response" in auth) return auth.response;

  const members = await memberService.getMembers();
  return NextResponse.json({ success: true, data: members }, { status: 200, headers: { "X-Request-ID": requestId } });
}
