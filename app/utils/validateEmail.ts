import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .optional()
    .refine(// @ts-ignore
      (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email"
    ),
});