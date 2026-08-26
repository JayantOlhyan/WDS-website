import { z } from "zod";

export const ALLOWED_BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Computer Science & Engineering (Shift 2)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical & Automation Engineering (MAE)",
  "Other / Applied Sciences",
] as const;

export const EXPERIENCE_LEVELS = [
  "Complete Beginner",
  "Basic Knowledge",
  "Some Projects",
  "Comfortable",
  "Real-world",
] as const;

export const TIME_COMMITMENTS = [
  "2–4 hours / week",
  "4–8 hours / week",
  "8–12 hours / week",
  "12+ hours / week",
] as const;

export const WINGS = [
  "Technical Wing",
  "Design & UI/UX Wing",
  "Content & Editorial Wing",
  "Events & Operations Wing",
] as const;

export const recruitmentApplicationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(80, "Full Name must not exceed 80 characters")
    .trim(),
  enrollmentNo: z
    .string()
    .regex(/^[0-9]{11}$/, "Enrollment Number must be exactly 11 digits")
    .trim(),
  branch: z.enum(ALLOWED_BRANCHES),
  section: z
    .string()
    .min(1, "Section/Shift is required")
    .max(20, "Section must not exceed 20 characters")
    .trim(),
  collegeEmail: z
    .string()
    .email("Please provide a valid email address")
    .max(120, "Email must not exceed 120 characters")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be a valid 10-digit mobile number")
    .trim(),
  interests: z
    .array(z.string().max(40))
    .min(1, "Please select at least one technical or creative interest")
    .max(10, "You can select up to 10 interests"),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  githubUrl: z
    .string()
    .max(200, "URL too long")
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\//.test(val), {
      message: "GitHub URL must start with http:// or https://",
    }),
  linkedinUrl: z
    .string()
    .max(200, "URL too long")
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\//.test(val), {
      message: "LinkedIn URL must start with http:// or https://",
    }),
  portfolioUrl: z
    .string()
    .max(200, "URL too long")
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\//.test(val), {
      message: "Portfolio URL must start with http:// or https://",
    }),
  projectLinks: z.string().max(500, "Project links must not exceed 500 characters").optional(),
  whyWds: z
    .string()
    .min(10, "Please share why you want to join WDS (at least 10 characters)")
    .max(1000, "Your response must not exceed 1000 characters")
    .trim(),
  learningGoal: z
    .string()
    .min(5, "Please share your learning goal (at least 5 characters)")
    .max(500, "Learning goal must not exceed 500 characters")
    .trim(),
  scenarioResponse: z
    .string()
    .min(10, "Please share your approach to the scenario (at least 10 characters)")
    .max(1000, "Response must not exceed 1000 characters")
    .trim(),
  timeCommitment: z.enum(TIME_COMMITMENTS),
  preferredTeam: z.enum(WINGS),
  website_hp: z.string().max(0, "Bot submission detected").optional(),
});

export type RecruitmentApplicationInput = z.infer<typeof recruitmentApplicationSchema>;
