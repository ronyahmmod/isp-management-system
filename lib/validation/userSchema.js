import { email, z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["admin", "employee"]),
});

export const userUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  role: z.enum(["admin", "employee"]).optional(),
  password: z.string().min(6).optional(),
});
