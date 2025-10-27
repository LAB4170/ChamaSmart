import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const groupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
});

export const contributionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
});

export const memberSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type GroupInput = z.infer<typeof groupSchema>;
export type ContributionInput = z.infer<typeof contributionSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
