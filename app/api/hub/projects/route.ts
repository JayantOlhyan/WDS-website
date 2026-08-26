import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { projectRepository } from "@/lib/repositories/ProjectRepository";

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, "projects.read");
  if ("response" in auth) return auth.response;

  const projects = await projectRepository.getProjects();
  return NextResponse.json({ success: true, data: projects }, { status: 200 });
}
