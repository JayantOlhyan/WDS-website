import { describe, it, expect } from "vitest";

describe("Optimistic Concurrency Control", () => {
  interface RecordWithTimestamp {
    id: string;
    version: number;
    updatedAt: string;
    data: string;
  }

  function applyMutation(
    current: RecordWithTimestamp,
    clientExpectedUpdatedAt: string,
    newData: string
  ): { success: boolean; conflict?: boolean; updated?: RecordWithTimestamp } {
    if (current.updatedAt !== clientExpectedUpdatedAt) {
      return { success: false, conflict: true };
    }
    return {
      success: true,
      updated: {
        ...current,
        version: current.version + 1,
        updatedAt: new Date().toISOString(),
        data: newData,
      },
    };
  }

  it("applies mutation when client timestamp matches server timestamp", () => {
    const record: RecordWithTimestamp = {
      id: "TSK-01",
      version: 1,
      updatedAt: "2026-08-27T03:00:00.000Z",
      data: "Initial Task State",
    };

    const res = applyMutation(record, "2026-08-27T03:00:00.000Z", "Updated Task State");
    expect(res.success).toBe(true);
    expect(res.updated?.version).toBe(2);
  });

  it("rejects mutation with 409 CONFLICT when server has newer timestamp", () => {
    const record: RecordWithTimestamp = {
      id: "TSK-01",
      version: 2,
      updatedAt: "2026-08-27T03:05:00.000Z",
      data: "Newer Task State from another user",
    };

    const staleClientTimestamp = "2026-08-27T03:00:00.000Z";
    const res = applyMutation(record, staleClientTimestamp, "Stale mutation");
    expect(res.success).toBe(false);
    expect(res.conflict).toBe(true);
  });
});
