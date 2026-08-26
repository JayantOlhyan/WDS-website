export interface ContentRecord {
  id: string;
  title: string;
  type: "POST" | "CAROUSEL" | "REEL" | "ARTICLE" | "ANNOUNCEMENT";
  platform: "INSTAGRAM" | "LINKEDIN" | "NEWSLETTER" | "WEBSITE_BLOG";
  status: "IDEA" | "DRAFT" | "REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  stage: "IDEA" | "DRAFT" | "REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  author: string;
  reviewer?: string;
  project?: string;
  projectId?: string;
  event?: string;
  eventId?: string;
  publishDate?: string;
  url?: string;
  assetUrl?: string;
  caption?: string;
  notes?: string;
  createdAt?: string;
}
