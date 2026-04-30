export type CheckoutStep = "information" | "shipping" | "payment";

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

export interface CheckoutFormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  country: string;
  stateRegion: string;
  address: string;
  city: string;
  postalCode: string;
  agreeToTerms: boolean;
}
