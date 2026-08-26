import { NextRequest, NextResponse } from "next/server";
import { submitToNotionDatabase, RecruitmentFormData } from "@/lib/notion";

export async function POST(req: NextRequest) {
  try {
    const body: RecruitmentFormData = await req.json();

    // Basic Server-Side Validation
    if (!body.fullName || body.fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Full Name is required and must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!body.collegeEmail || !body.collegeEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid college / personal email address is required." },
        { status: 400 }
      );
    }

    if (!body.enrollmentNo || body.enrollmentNo.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Enrollment Number / Roll Number is required." },
        { status: 400 }
      );
    }

    if (!body.phone || body.phone.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: "Valid Phone / WhatsApp number is required." },
        { status: 400 }
      );
    }

    // Submit to Notion
    const result = await submitToNotionDatabase(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      recordId: result.recordId,
      isMock: result.isMock,
    });
  } catch (error: unknown) {
    console.error("[Recruitment API Error]:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
