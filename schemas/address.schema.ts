import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string(),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must be numeric"),
  line1: z.string(),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string().default("India"),
});

export type AddressData = z.infer<typeof addressSchema>;
