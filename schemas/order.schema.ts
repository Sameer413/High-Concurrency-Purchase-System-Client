import { z } from "zod";
import { addressSchema } from "./address.schema";

export const orderSchema = z.object({
  reservationId: z.string().optional(),
  customerEmail: z.string().email(),
  customerPhone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must be numeric"),
  shippingAddress: addressSchema,
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
// {
//   "reservationId": "550e8400-e29b-41d4-a716-446655440000",
//   "customerEmail": "customer@example.com",
//   "customerPhone": "+91-9876543210",
//   "shippingAddress": {
//     "fullName": "John Doe",
//     "phone": "+91-9876543210",
//     "line1": "123 Main Street",
//     "line2": "Apartment 4B",
//     "landmark": "Near Central Park",
//     "city": "Mumbai",
//     "state": "Maharashtra",
//     "postalCode": "400001",
//     "country": "India",
//     "isDefault": true
//   },
//   "sameAsShipping": true,
//   "notes": "Please deliver between 9 AM - 5 PM"
// }
