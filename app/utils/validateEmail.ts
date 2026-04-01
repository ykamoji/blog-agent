import { z } from "zod";

export const triggerFormSchema = z.object({
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email"
    ),
  hours: z.string().optional(),
});