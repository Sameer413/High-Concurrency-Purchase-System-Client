interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;

  description: string | null;

  price: number;
  originalPrice: number | null;

  image: string | null;
  category: string | null;

  colors: string[] | null;
  sizes: string[] | null;

  rating: number;
  reviews: number;

  isNew: boolean;
  stock: number;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export type CheckoutStep = "information" | "shipping" | "payment";

// Favorite item type
export interface FavoriteItem extends BaseModel {
  product: Product;
  size: string;
  color: string;
}
