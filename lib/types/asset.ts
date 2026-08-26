export interface AssetRecord {
  id: string;
  name: string;
  type: "PNG" | "SVG" | "PDF" | "FIGMA" | "MD" | "OTHER";
  category: "LOGOS" | "POSTERS" | "BRAND" | "DOCUMENTS" | "TEMPLATES";
  url: string;
  project?: string;
  projectId?: string;
  event?: string;
  eventId?: string;
  owner: string;
  version?: string;
  description?: string;
  createdAt?: string;
}
