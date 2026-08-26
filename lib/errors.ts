import { NextResponse } from "next/server";
import crypto from "crypto";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "DATABASE_OFFLINE"
  | "DATABASE_SCHEMA_MISMATCH"
  | "WEBHOOK_INVALID"
  | "WEBHOOK_NOT_CONFIGURED"
  | "PERSISTENCE_FAILED"
  | "INTERNAL_ERROR";

export interface StructuredErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
    details?: Array<{ field: string; message: string }> | Record<string, unknown>;
  };
}

export function generateRequestId(): string {
  return `req_${crypto.randomBytes(8).toString("hex")}`;
}

export function createErrorResponse(
  code: ApiErrorCode,
  message: string,
  status: number = 400,
  details?: Array<{ field: string; message: string }> | Record<string, unknown>,
  requestId: string = generateRequestId()
): NextResponse<StructuredErrorResponse> {
  const response = NextResponse.json(
    {
      success: false as const,
      error: {
        code,
        message,
        requestId,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );

  response.headers.set("X-Request-ID", requestId);
  return response;
}
