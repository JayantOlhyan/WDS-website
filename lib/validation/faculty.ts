import { z } from "zod";

export const facultyRoleSchema = z.enum(["FACULTY_ADVISOR", "MENTOR", "HOD", "COORDINATOR"]);

export const createFacultySchema = z.object({
  name: z.string().min(2, "Name required").max(100).trim(),
  department: z.enum(["CSE", "IT", "ECE", "Applied Sciences", "Administration"]),
  designation: z.string().min(2, "Designation required").max(100).trim(),
  email: z.string().email("Valid email required").trim(),
  role: facultyRoleSchema.default("FACULTY_ADVISOR"),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
