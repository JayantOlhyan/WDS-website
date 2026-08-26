export interface EnvValidationItem {
  name: string;
  status: "CONFIGURED" | "MISSING" | "INVALID" | "WEAK_ENTROPY";
  required: boolean;
  notes?: string;
}

export interface EnvValidationReport {
  timestamp: string;
  isValid: boolean;
  environment: string;
  variables: Record<string, EnvValidationItem>;
}

/**
 * Validates server environment variables without ever logging or exposing secrets
 */
export function validateEnvironment(): EnvValidationReport {
  const isProd = process.env.NODE_ENV === "production";
  const items: Record<string, EnvValidationItem> = {};

  // 1. NOTION_API_KEY
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) {
    items.NOTION_API_KEY = {
      name: "NOTION_API_KEY",
      status: "MISSING",
      required: true,
      notes: "Required for live Notion persistence.",
    };
  } else if (!notionKey.startsWith("secret_") && !notionKey.startsWith("ntn_")) {
    items.NOTION_API_KEY = {
      name: "NOTION_API_KEY",
      status: "INVALID",
      required: true,
      notes: "Expected Notion integration secret starting with secret_ or ntn_.",
    };
  } else {
    items.NOTION_API_KEY = { name: "NOTION_API_KEY", status: "CONFIGURED", required: true };
  }

  // 2. Notion Databases
  const dbChecks = [
    { name: "NOTION_DATABASE_ID", label: "Recruitment DB" },
    { name: "NOTION_TASKS_DATABASE_ID", label: "Tasks DB" },
    { name: "NOTION_BUGS_DATABASE_ID", label: "Bugs DB" },
  ];

  for (const db of dbChecks) {
    const val = process.env[db.name];
    if (!val) {
      items[db.name] = {
        name: db.name,
        status: "MISSING",
        required: true,
        notes: `Required for ${db.label}.`,
      };
    } else if (val.length < 16) {
      items[db.name] = {
        name: db.name,
        status: "INVALID",
        required: true,
        notes: "Database ID format appears invalid (too short).",
      };
    } else {
      items[db.name] = { name: db.name, status: "CONFIGURED", required: true };
    }
  }

  // 3. Hub Access Keys
  const authKeys = ["HUB_ADMIN_KEY", "HUB_CORE_KEY", "HUB_LEAD_KEY", "HUB_MEMBER_KEY"];
  for (const k of authKeys) {
    const val = process.env[k];
    if (!val) {
      items[k] = {
        name: k,
        status: isProd ? "MISSING" : "CONFIGURED",
        required: isProd,
        notes: isProd ? "Missing in production environment." : "Using development fallback.",
      };
    } else {
      items[k] = { name: k, status: "CONFIGURED", required: isProd };
    }
  }

  // 4. HUB_SESSION_SECRET
  const sessionSecret = process.env.HUB_SESSION_SECRET;
  if (!sessionSecret) {
    items.HUB_SESSION_SECRET = {
      name: "HUB_SESSION_SECRET",
      status: isProd ? "MISSING" : "CONFIGURED",
      required: isProd,
      notes: "Used for cryptographic HMAC-SHA256 session token signatures.",
    };
  } else if (sessionSecret.length < 16) {
    items.HUB_SESSION_SECRET = {
      name: "HUB_SESSION_SECRET",
      status: "WEAK_ENTROPY",
      required: isProd,
      notes: "Session secret should be at least 16-32 characters for security.",
    };
  } else {
    items.HUB_SESSION_SECRET = { name: "HUB_SESSION_SECRET", status: "CONFIGURED", required: isProd };
  }

  // 5. BUG_HUNT_WEBHOOK_SECRET
  const webhookSecret = process.env.BUG_HUNT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    items.BUG_HUNT_WEBHOOK_SECRET = {
      name: "BUG_HUNT_WEBHOOK_SECRET",
      status: "MISSING",
      required: false,
      notes: "Required for Bug Hunt HMAC webhook verification.",
    };
  } else {
    items.BUG_HUNT_WEBHOOK_SECRET = { name: "BUG_HUNT_WEBHOOK_SECRET", status: "CONFIGURED", required: false };
  }

  const isValid = !Object.values(items).some((i) => i.required && i.status !== "CONFIGURED");

  return {
    timestamp: new Date().toISOString(),
    isValid,
    environment: process.env.NODE_ENV || "development",
    variables: items,
  };
}
