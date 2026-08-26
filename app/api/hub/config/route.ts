import { NextRequest, NextResponse } from "next/server";
import { requireMinimumRole } from "@/lib/auth";
import { validateNotionSchema } from "@/lib/notion/schemaValidator";

export async function GET(req: NextRequest) {
  const auth = requireMinimumRole(req, "ADMIN");
  if ("response" in auth) return auth.response;

  const report = await validateNotionSchema();
  return NextResponse.json({ success: true, data: report }, { status: 200 });
}
