export type NotionErrorCode =
  | "NOTION_UNCONFIGURED"
  | "DATABASE_OFFLINE"
  | "DATABASE_SCHEMA_MISMATCH"
  | "NOTION_RATE_LIMITED"
  | "NOTION_TIMEOUT"
  | "NOTION_CLIENT_ERROR"
  | "NOTION_SERVER_ERROR";

export interface NormalizedNotionError {
  code: NotionErrorCode;
  message: string;
  statusCode: number;
  retryable: boolean;
  originalError?: any;
}

export function normalizeNotionError(err: any): NormalizedNotionError {
  if (!err) {
    return {
      code: "DATABASE_OFFLINE",
      message: "Notion database is offline or unconfigured.",
      statusCode: 503,
      retryable: false,
    };
  }

  const status = err?.status || err?.code;
  const message = err?.message || "Notion API operation failed.";

  if (status === 429) {
    return {
      code: "NOTION_RATE_LIMITED",
      message: "Notion rate limit encountered. Backing off.",
      statusCode: 429,
      retryable: true,
      originalError: err,
    };
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return {
      code: "NOTION_SERVER_ERROR",
      message: "Notion upstream server error.",
      statusCode: 502,
      retryable: true,
      originalError: err,
    };
  }

  if (status === 400 || status === 404) {
    return {
      code: "DATABASE_SCHEMA_MISMATCH",
      message: `Notion database or property schema mismatch: ${message}`,
      statusCode: 400,
      retryable: false,
      originalError: err,
    };
  }

  if (err?.name === "AbortError" || message.toLowerCase().includes("timeout")) {
    return {
      code: "NOTION_TIMEOUT",
      message: "Notion request timed out.",
      statusCode: 504,
      retryable: true,
      originalError: err,
    };
  }

  return {
    code: "NOTION_CLIENT_ERROR",
    message,
    statusCode: typeof status === "number" ? status : 500,
    retryable: false,
    originalError: err,
  };
}
