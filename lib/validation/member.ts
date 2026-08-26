import { z } from "zod";

export const memberRoleSchema = z.enum(["ADMIN", "CORE_TEAM", "TEAM_LEAD", "MEMBER"]);
export const memberStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "ALUMNI"]);
export const memberYearSchema = z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"]);

export const createMemberSchema = z.object({
  name: z.string().min(2, "Name is required").max(80).trim(),
  email: z.string().email("Valid email required").trim(),
  role: memberRoleSchema.default("MEMBER"),
  wing: z.string().min(2).max(80).trim(),
  year: memberYearSchema.default("2nd Year"),
  status: memberStatusSchema.default("ACTIVE"),
  skills: z.array(z.string().max(40)).max(20).optional(),
  responsibilities: z.string().max(500).trim().optional(),
});

export const updateMemberSchema = createMemberSchema.partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
