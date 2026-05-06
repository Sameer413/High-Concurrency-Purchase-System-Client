import { z } from "zod";

export const checkoutFormSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must be numeric"),

  fullName: z.string().min(1, "name required"),

  country: z.string().min(1),
  stateRegion: z.string().min(1),
  line1: z.string().min(5),
  landmark: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(4),

  // agreeToTerms: z.literal(true, {
  //   message: "You must accept terms",
  // }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
