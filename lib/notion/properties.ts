/**
 * Safe Notion property extraction and building helpers that handle missing or polymorphic property formats
 */

// -------------------------------------------------------------
// Safe Notion property extractors
// -------------------------------------------------------------

export function findProp(properties: Record<string, any> | undefined | null, candidateNames: string[]): any {
  if (!properties) return undefined;
  for (const name of candidateNames) {
    if (properties[name] !== undefined) return properties[name];
  }
  const normalizedCandidateKeys = candidateNames.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [propName, propVal] of Object.entries(properties)) {
    const normalizedPropName = propName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalizedCandidateKeys.includes(normalizedPropName)) {
      return propVal;
    }
  }
  return undefined;
}

export function extractTitle(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.title && Array.isArray(property.title) && property.title.length > 0) {
    return property.title.map((t: any) => t.plain_text || "").join("") || defaultValue;
  }
  if (property.rich_text && Array.isArray(property.rich_text) && property.rich_text.length > 0) {
    return property.rich_text.map((t: any) => t.plain_text || "").join("") || defaultValue;
  }
  if (typeof property === "string") return property;
  return defaultValue;
}

export function extractRichText(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.rich_text && Array.isArray(property.rich_text) && property.rich_text.length > 0) {
    return property.rich_text.map((t: any) => t.plain_text || "").join("") || defaultValue;
  }
  if (property.title && Array.isArray(property.title) && property.title.length > 0) {
    return property.title.map((t: any) => t.plain_text || "").join("") || defaultValue;
  }
  if (property.email) return property.email;
  if (property.phone_number) return property.phone_number;
  if (property.url) return property.url;
  if (property.select && property.select.name) return property.select.name;
  if (property.status && property.status.name) return property.status.name;
  if (typeof property.number === "number") return String(property.number);
  if (property.multi_select && Array.isArray(property.multi_select)) {
    return property.multi_select.map((s: any) => s.name).filter(Boolean).join(", ");
  }
  if (typeof property === "string") return property;
  return defaultValue;
}

export function extractSelect(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.select && property.select.name) {
    return property.select.name;
  }
  if (property.status && property.status.name) {
    return property.status.name;
  }
  if (property.multi_select && Array.isArray(property.multi_select) && property.multi_select.length > 0) {
    return property.multi_select[0].name || defaultValue;
  }
  const textVal = extractRichText(property);
  return textVal || defaultValue;
}

export function extractStatus(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.status && property.status.name) {
    return property.status.name;
  }
  if (property.select && property.select.name) {
    return property.select.name;
  }
  const textVal = extractRichText(property);
  return textVal || defaultValue;
}

export function extractMultiSelect(property: any): string[] {
  if (!property) return [];
  if (property.multi_select && Array.isArray(property.multi_select)) {
    return property.multi_select.map((s: any) => s.name).filter(Boolean);
  }
  if (property.select && property.select.name) {
    return [property.select.name];
  }
  const textVal = extractRichText(property);
  if (textVal) {
    return textVal.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function extractNumber(property: any, defaultValue: number = 0): number {
  if (!property) return defaultValue;
  if (typeof property.number === "number") {
    return property.number;
  }
  const textVal = extractRichText(property);
  if (textVal && !isNaN(Number(textVal))) {
    return Number(textVal);
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
  const textVal = extractRichText(property);
  return textVal || defaultValue;
}

export function extractEmail(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.email) return property.email;
  const textVal = extractRichText(property);
  return textVal || defaultValue;
}

export function extractPhone(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.phone_number) return property.phone_number;
  const textVal = extractRichText(property);
  return textVal || defaultValue;
}

export function extractUrl(property: any, defaultValue: string = ""): string {
  if (!property) return defaultValue;
  if (property.url) return property.url;
  const textVal = extractRichText(property);
  return textVal || defaultValue;
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
