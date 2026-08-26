import { describe, it, expect } from "vitest";
import { validateEnvironment } from "../lib/env";

describe("Safe Environment Validator", () => {
  it("validates environment structure without leaking secrets", () => {
    const report = validateEnvironment();
    expect(report).toHaveProperty("timestamp");
    expect(report).toHaveProperty("isValid");
    expect(report).toHaveProperty("environment");
    expect(report.variables).toHaveProperty("NOTION_API_KEY");

    // Must never leak secret strings in the report
    const serialized = JSON.stringify(report);
    expect(serialized).not.toContain("secret_");
    expect(serialized).not.toContain("wds-admin-");
  });

  it("evaluates required keys correctly", () => {
    const report = validateEnvironment();
    expect(report.variables.NOTION_API_KEY.required).toBe(true);
  });
});
