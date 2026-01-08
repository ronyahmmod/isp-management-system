import { z } from "zod";

export const userCreateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.email({ message: "Email must be a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["admin", "employee"]),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "employee"]),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional()
    .or(z.literal("")), // Allows empty string or missing
});
