export interface CollegeInfoRecord {
  id: string;
  name: string;
  category: "ACADEMICS" | "ADMINISTRATION" | "FACILITIES" | "SOCIETY_POLICY" | "AFFILIATION" | "GENERAL";
  value: string;
  source?: string;
  lastUpdated: string;
}
