import { z } from "zod";

export const checkoutFormSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must be numeric"),

  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),

  country: z.string().min(1),
  stateRegion: z.string().min(1),
  address: z.string().min(5),
  city: z.string().min(1),
  postalCode: z.string().min(4),

  agreeToTerms: z.literal(true, {
    message: "You must accept terms",
  }),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;
