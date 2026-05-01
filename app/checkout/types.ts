export type CheckoutStep = "address" | "payment";

export interface CartItem {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

// CheckoutFormData is now exported from schemas/checkout.schema.ts
