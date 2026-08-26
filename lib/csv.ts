/**
 * Converts array of records to CSV with RFC 4180 compliance and Formula Injection defense.
 * Cells starting with =, +, -, @ are escaped with a leading apostrophe.
 */
export function sanitizeForCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = typeof val === "object" ? JSON.stringify(val) : String(val);

  // Formula injection prevention
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }

  return `"${str.replace(/"/g, '""')}"`;
}

export function arrayToCsv(data: Record<string, any>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => sanitizeForCsv(row[header])).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
