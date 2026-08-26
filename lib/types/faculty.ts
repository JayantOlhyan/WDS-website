export interface FacultyRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone?: string;
  office?: string;
  profileUrl?: string;
  notes?: string;
  role?: "FACULTY_ADVISOR" | "MENTOR" | "HOD" | "COORDINATOR";
  createdAt?: string;
}
