import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/lib/services/projectService";
import { generateRequestId } from "@/lib/errors";

export async function GET() {
  const requestId = generateRequestId();
  const projects = await projectService.getProjects();
  return NextResponse.json({ success: true, data: projects }, { status: 200, headers: { "X-Request-ID": requestId } });
}
