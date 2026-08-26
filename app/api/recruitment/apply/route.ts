import { NextRequest, NextResponse } from "next/server";
import { submitToNotionDatabase } from "@/lib/notion";
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
        message: e.message,
      }));

      const primaryErrorMessage = errorDetails[0]?.message || "Validation failed on application form.";

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

    // 4. Submit to Notion with duplicate check
    const result = await submitToNotionDatabase(validatedData);

    if (!result.success) {
      if (result.status === "DUPLICATE") {
        return NextResponse.json(
          {
            success: false,
            error: result.message,
            code: "DUPLICATE_APPLICATION",
          },
          { status: 409 }
        );
      }

      if (result.status === "DATABASE_UNCONFIGURED") {
        return NextResponse.json(
          {
            success: false,
            error: result.message,
            code: "DATABASE_UNCONFIGURED",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: result.message,
          code: "PERSISTENCE_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      recordId: result.recordId,
      code: "APPLICATION_RECORDED",
    });
  } catch (error: unknown) {
    console.error("[Recruitment API Uncaught Error]:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errMessage, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
