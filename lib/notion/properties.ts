/**
 * Safe Notion property extraction and building helpers that handle missing or polymorphic property formats
 */

// -------------------------------------------------------------
// Safe Notion property extractors
// -------------------------------------------------------------

export function extractTitle(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.title && Array.isArray(property.title) && property.title.length > 0) {
    return property.title.map((t: any) => t.plain_text || "").join("") || defaultValue;
  }
  return defaultValue;
}

export function extractRichText(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.rich_text && Array.isArray(property.rich_text) && property.rich_text.length > 0) {
    return property.rich_text.map((t: any) => t.plain_text || "").join("") || defaultValue;
  }
  return defaultValue;
}

export function extractSelect(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.select && property.select.name) {
    return property.select.name;
  }
  return defaultValue;
}

export function extractStatus(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.status && property.status.name) {
    return property.status.name;
  }
  // Fallback to select if defined as select in Notion
  if (property.select && property.select.name) {
    return property.select.name;
  }
  return defaultValue;
}

export function extractMultiSelect(property: any): string[] {
  if (!property) return [];
  if (property.multi_select && Array.isArray(property.multi_select)) {
    return property.multi_select.map((s: any) => s.name).filter(Boolean);
  }
  return [];
}

export function extractNumber(property: any, defaultValue: number = 0): number {
  if (!property) return defaultValue;
  if (typeof property.number === "number") {
    return property.number;
  }
  return defaultValue;
}

export function extractCheckbox(property: any, defaultValue: boolean = false): boolean {
  if (!property) return defaultValue;
  if (typeof property.checkbox === "boolean") {
    return property.checkbox;
  }
  return defaultValue;
}

export function extractDate(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.date && property.date.start) {
    return property.date.start;
  }
  return defaultValue;
}

export function extractEmail(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  return property.email || defaultValue;
}

export function extractPhone(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  return property.phone_number || defaultValue;
}

export function extractUrl(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  return property.url || defaultValue;
}

export function extractRelationIds(property: any): string[] {
  if (!property) return [];
  if (property.relation && Array.isArray(property.relation)) {
    return property.relation.map((r: any) => r.id).filter(Boolean);
  }
  return [];
}

// -------------------------------------------------------------
// Safe Notion property builders for creating & updating pages
// -------------------------------------------------------------

export function buildTitle(content: string) {
  return {
    title: [{ text: { content: (content || "").slice(0, 2000) } }],
  };
}

export function buildRichText(content: string) {
  return {
    rich_text: [{ text: { content: (content || "").slice(0, 2000) } }],
  };
}

export function buildSelect(name: string) {
  return {
    select: { name },
  };
}

export function buildStatus(name: string) {
  return {
    status: { name },
  };
}

export function buildMultiSelect(names: string[]) {
  return {
    multi_select: names.filter(Boolean).map((name) => ({ name })),
  };
}

export function buildNumber(val: number) {
  return {
    number: typeof val === "number" && !isNaN(val) ? val : 0,
  };
}

export function buildCheckbox(checked: boolean) {
  return {
    checkbox: Boolean(checked),
  };
}

export function buildDate(isoDate: string) {
  return {
    date: { start: isoDate },
  };
}

export function buildEmail(email: string) {
  return {
    email: email || null,
  };
}

export function buildPhone(phone: string) {
  return {
    phone_number: phone || null,
  };
}

export function buildUrl(url: string) {
  return {
    url: url || null,
  };
}

export function buildRelation(ids: string[]) {
  return {
    relation: ids.filter(Boolean).map((id) => ({ id })),
  };
}
