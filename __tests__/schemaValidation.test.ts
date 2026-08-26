import { describe, it, expect } from "vitest";
import { validateNotionSchema } from "../lib/notion/schemaValidator";

describe("Notion Schema Validation & Diagnostics", () => {
  it("generates a structured diagnostic configuration report", async () => {
    const report = await validateNotionSchema();

    expect(report).toHaveProperty("timestamp");
    expect(report.notion).toHaveProperty("connected");
    expect(report.notion).toHaveProperty("tokenConfigured");
    expect(report.notion.databases).toHaveProperty("recruitment");
    expect(report.notion.databases).toHaveProperty("tasks");
    expect(report.notion.databases).toHaveProperty("bugs");
    expect(report.webhook).toHaveProperty("configured");
    expect(report.auth).toHaveProperty("adminConfigured");
  });

  it("does not leak secret values in the diagnostic report", async () => {
    const report = await validateNotionSchema();
    const serialized = JSON.stringify(report);

    expect(serialized).not.toContain("secret_");
    expect(serialized).not.toContain("wds-admin-");
    expect(serialized).not.toContain("wds-core-");
  });
});
