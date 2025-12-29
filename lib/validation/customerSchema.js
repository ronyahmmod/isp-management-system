import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  phone: z.string({ message: "Phone is required" }),
  email: z
    .string({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, { message: "Address is required" }),
  package: z.string().min(1, { message: "Package is required" }),
  connectionType: z.enum(["PPPoE", "Hotspot", "Static", "Cable"], {
    required_error: "Connection type is required",
  }),
  username: z.string().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  nextBillingDate: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.date().optional()
  ),
});

export const customerCreateSchema = baseSchema.superRefine((data, ctx) => {
  if (data.connectionType === "PPPoE") {
    if (!data.username) {
      ctx.addIssue({
        code: "custom",
        message: "Username is required for PPPoE",
        path: ["username"],
      });
    }
    if (!data.password) {
      ctx.addIssue({
        code: "custom",
        message: "Password is required for PPPoE",
        path: ["password"],
      });
    }
  }
});
