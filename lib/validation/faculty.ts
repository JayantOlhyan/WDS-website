import { z } from "zod";

export const facultyRoleSchema = z.enum(["FACULTY_ADVISOR", "MENTOR", "HOD", "COORDINATOR"]);

export const createFacultySchema = z.object({
  name: z.string().min(2, "Name required").max(100).trim(),
  department: z.string().min(2, "Department required").max(80).trim(),
  designation: z.string().min(2, "Designation required").max(100).trim(),
  email: z.string().email("Valid email required").trim(),
  phone: z.string().max(20).trim().optional(),
  office: z.string().max(80).trim().optional(),
  profileUrl: z.string().url().max(300).optional().or(z.literal("")),
  notes: z.string().max(2000).trim().optional(),
  role: facultyRoleSchema.default("FACULTY_ADVISOR"),
});

export const updateFacultySchema = createFacultySchema.partial();

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
