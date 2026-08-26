import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { memberRepository } from "@/lib/repositories/MemberRepository";

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "members.read");
  if ("response" in auth) return auth.response;

  const members = await memberRepository.getMembers();
  return NextResponse.json({ success: true, data: members }, { status: 200 });
}
