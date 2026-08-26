import { describe, it, expect } from "vitest";
import { sanitizeForCsv, arrayToCsv } from "../lib/csv";

describe("CSV Formula Injection Defense", () => {
  it("escapes leading formula characters with a leading apostrophe", () => {
    expect(sanitizeForCsv("=SUM(A1:A10)")).toBe('"\'=SUM(A1:A10)"');
    expect(sanitizeForCsv("+1234567890")).toBe('"\' +1234567890"'.replace(" ", ""));
    expect(sanitizeForCsv("-cmd|' /C calc'!A0")).toBe('"\' -cmd|\' /C calc\'!A0"'.replace(" ", ""));
    expect(sanitizeForCsv("@SUM(1+1)")).toBe('"\'@SUM(1+1)"');
  });

  it("leaves standard alphanumeric content safely quoted", () => {
    expect(sanitizeForCsv("Technical Wing")).toBe('"Technical Wing"');
    expect(sanitizeForCsv("MSIT Janakpuri")).toBe('"MSIT Janakpuri"');
  });

  it("formats multi-row dataset securely without executable cells", () => {
    const records = [
      { id: "TSK-01", title: "=cmd|' /C calc'!A0", priority: "HIGH" },
      { id: "TSK-02", title: "Regular Task Title", priority: "LOW" },
    ];

    const csv = arrayToCsv(records);
    expect(csv).toContain('"\'=cmd|\' /C calc\'!A0"');
    expect(csv).toContain('"Regular Task Title"');
  });
});
