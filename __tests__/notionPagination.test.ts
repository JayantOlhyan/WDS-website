import { describe, it, expect } from "vitest";
import { queryNotionDatabaseWithPagination, isNotionConfigured } from "../lib/notion/client";

describe("Notion Pagination & Resilience Engine", () => {
  it("returns an empty array gracefully when Notion is unconfigured in local test mode", async () => {
    const results = await queryNotionDatabaseWithPagination("unconfigured_db_id", { maxRecords: 100 });
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });

  it("exposes isNotionConfigured helper safely checking API key presence", () => {
    const configured = isNotionConfigured();
    expect(typeof configured).toBe("boolean");
  });
});
