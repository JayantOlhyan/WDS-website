import { NextRequest, NextResponse } from "next/server";
import { candidatesRepository } from "@/lib/repositories/CandidatesRepository";
import { recruitmentApplicationSchema } from "@/lib/validation";

// Simple in-memory rate limiter (per-IP window)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP & Rate Limiting Check
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait 10 minutes before submitting another application.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Request Body Parsing
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON payload.",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    // 3. Strict Zod Schema Validation & Honeypot Check
    const validationResult = recruitmentApplicationSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message === "Invalid input" ? `Invalid value for ${e.path.join(".")}` : e.message,
      }));

      const primaryErrorMessage =
        errorDetails[0]?.message || "Validation failed on application form.";

      return NextResponse.json(
        {
          success: false,
          error: primaryErrorMessage,
          details: errorDetails,
          code: "VALIDATION_FAILED",
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Honeypot spam filter check
    if (validatedData.website_hp && validatedData.website_hp.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Automated submission rejected.",
          code: "SPAM_DETECTED",
        },
        { status: 400 }
      );
    }

    // 4. Duplicate Check
    const isDuplicate = await candidatesRepository.checkDuplicateByPhone(validatedData.phone);
    if (isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `An application with phone number ${validatedData.phone} has already been submitted for WDS 2026.`,
          code: "DUPLICATE_APPLICATION",
        },
        { status: 409 }
      );
    }

    // 5. Team Mapping
    const WING_MAPPING: Record<string, string> = {
      "Frontend Wing": "Technical Wing",
      "Backend Wing": "Technical Wing",
      "Quality Assurance Wing": "Technical Wing",
      "UI/UX Wing": "Design Wing",
      "PR & Social Media Wing": "Media Wing",
      "Content Management Wing": "Media Wing",
    };
    const mappedTeam = WING_MAPPING[validatedData.preferredTeam] || validatedData.preferredTeam;

    // 6. Notes Compilation
    const notes = [
      validatedData.interests.length > 0 ? `Interests:\n${validatedData.interests.join(", ")}\n` : "",
      validatedData.projectLinks ? `Projects & Work:\n${validatedData.projectLinks}\n` : "",
      validatedData.whyWds ? `Why WDS:\n${validatedData.whyWds}\n` : "",
      validatedData.learningGoal ? `Learning Goal:\n${validatedData.learningGoal}\n` : "",
      validatedData.scenarioResponse ? `Scenario Response:\n${validatedData.scenarioResponse}\n` : "",
    ].filter(Boolean).join("\n");

    // 7. Submit to CandidatesRepository
    const result = await candidatesRepository.create({
      fullName: validatedData.fullName,
      rollNumber: validatedData.enrollmentNo,
      email: validatedData.collegeEmail,
      phone: validatedData.phone,
      branch: validatedData.branch,
      section: validatedData.section,
      year: validatedData.year,
      preferredWing: mappedTeam,
      experienceLevel: validatedData.experienceLevel,
      timeCommitment: validatedData.timeCommitment,
      githubUrl: validatedData.githubUrl,
      linkedinUrl: validatedData.linkedinUrl,
      portfolioUrl: validatedData.portfolioUrl,
      notes: notes,
    });

    if (!result.success) {
      if (result.isOffline || result.error === "DATABASE_OFFLINE") {
        return NextResponse.json(
          {
            success: false,
            error: "The society recruitment database is currently being initialized. Please contact hello@wds.msit or try again shortly.",
            code: "DATABASE_UNCONFIGURED",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save application to the database. Please try again.",
          code: "PERSISTENCE_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted and recorded successfully.",
      recordId: result.id,
      code: "APPLICATION_RECORDED",
    });
  } catch (error: unknown) {
    console.error("[Recruitment API Uncaught Error]:", error);
    // Don't expose raw server errors to the frontend
    return NextResponse.json(
      { success: false, error: "Internal Server Error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

