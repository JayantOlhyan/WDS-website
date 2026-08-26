import { describe, it, expect } from "vitest";
import {
  extractTitle,
  extractRichText,
  extractSelect,
  extractStatus,
  extractMultiSelect,
  extractNumber,
  extractCheckbox,
  extractDate,
  extractEmail,
  extractPhone,
  extractUrl,
  extractRelationIds,
  buildTitle,
  buildRichText,
  buildSelect,
  buildStatus,
  buildMultiSelect,
  buildNumber,
  buildCheckbox,
  buildDate,
  buildEmail,
  buildPhone,
  buildUrl,
  buildRelation,
} from "../lib/notion/properties";

describe("Notion Property Mappers & Extractors Suite", () => {
  it("correctly extracts title and handles fallbacks", () => {
    const titleProp = { title: [{ plain_text: "Deploy Production Website" }] };
    expect(extractTitle(titleProp)).toBe("Deploy Production Website");
    expect(extractTitle(null, "Untitled")).toBe("Untitled");
    expect(extractTitle({ title: [] }, "Fallback")).toBe("Fallback");
  });

  it("correctly extracts rich_text properties", () => {
    const textProp = { rich_text: [{ plain_text: "Line 1 " }, { plain_text: "Line 2" }] };
    expect(extractRichText(textProp)).toBe("Line 1 Line 2");
    expect(extractRichText(null, "Default Text")).toBe("Default Text");
  });

  it("correctly extracts select, status, multi_select, number, and checkbox", () => {
    expect(extractSelect({ select: { name: "IN_PROGRESS" } })).toBe("IN_PROGRESS");
    expect(extractStatus({ status: { name: "DONE" } })).toBe("DONE");
    expect(extractMultiSelect({ multi_select: [{ name: "React" }, { name: "TypeScript" }] })).toEqual(["React", "TypeScript"]);
    expect(extractNumber({ number: 42 })).toBe(42);
    expect(extractNumber(null, 10)).toBe(10);
    expect(extractCheckbox({ checkbox: true })).toBe(true);
    expect(extractCheckbox(null, false)).toBe(false);
  });

  it("correctly extracts date, email, phone, and url", () => {
    expect(extractDate({ date: { start: "2026-08-27" } })).toBe("2026-08-27");
    expect(extractEmail({ email: "tech@msit.in" })).toBe("tech@msit.in");
    expect(extractPhone({ phone_number: "+919876543210" })).toBe("+919876543210");
    expect(extractUrl({ url: "https://msit.in" })).toBe("https://msit.in");
    expect(extractRelationIds({ relation: [{ id: "page-1" }, { id: "page-2" }] })).toEqual(["page-1", "page-2"]);
  });

  it("correctly builds Notion mutation payloads for all property types", () => {
    expect(buildTitle("New Task")).toEqual({
      title: [{ text: { content: "New Task" } }],
    });
    expect(buildRichText("Task description")).toEqual({
      rich_text: [{ text: { content: "Task description" } }],
    });
    expect(buildSelect("HIGH")).toEqual({
      select: { name: "HIGH" },
    });
    expect(buildStatus("IN_PROGRESS")).toEqual({
      status: { name: "IN_PROGRESS" },
    });
    expect(buildMultiSelect(["UI", "Auth"])).toEqual({
      multi_select: [{ name: "UI" }, { name: "Auth" }],
    });
    expect(buildNumber(9.5)).toEqual({ number: 9.5 });
    expect(buildCheckbox(true)).toEqual({ checkbox: true });
    expect(buildDate("2026-08-27")).toEqual({ date: { start: "2026-08-27" } });
    expect(buildEmail("test@msit.in")).toEqual({ email: "test@msit.in" });
    expect(buildPhone("+919876543210")).toEqual({ phone_number: "+919876543210" });
    expect(buildUrl("https://msit.in")).toEqual({ url: "https://msit.in" });
    expect(buildRelation(["rel-1", "rel-2"])).toEqual({
      relation: [{ id: "rel-1" }, { id: "rel-2" }],
    });
  });
});
