import { describe, it, expect } from "vitest";

describe("Data Export Formatting & Serialization", () => {
  function arrayToCsv(data: Record<string, any>[]): string {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? "";
          const str = typeof val === "object" ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }

  it("converts structured task records to RFC 4180 compliant CSV format", () => {
    const tasks = [
      { id: "TSK-01", title: "Navbar Refactor, Mobile", priority: "HIGH", status: "PENDING" },
      { id: "TSK-02", title: 'Fix "Bug Hunt" link', priority: "MEDIUM", status: "COMPLETED" },
    ];

    const csv = arrayToCsv(tasks);
    expect(csv).toContain("id,title,priority,status");
    expect(csv).toContain('"TSK-01","Navbar Refactor, Mobile","HIGH","PENDING"');
    expect(csv).toContain('"TSK-02","Fix ""Bug Hunt"" link","MEDIUM","COMPLETED"');
  });

  it("handles empty dataset gracefully", () => {
    expect(arrayToCsv([])).toBe("");
  });
});
