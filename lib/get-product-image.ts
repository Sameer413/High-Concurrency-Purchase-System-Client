import { Product } from "@/types/types";

export const getProductImage = (product: Product) => {
  const category = product.category?.toLowerCase() || "";
  const name = product.name.toLowerCase();

  if (category.includes("jacket")) return "/products/jacket-1.jpg";
  if (category.includes("jeans")) return "/products/jeans-1.jpg";
  if (category.includes("polo")) return "/products/polo-1.jpg";
  if (category.includes("shirt")) return "/products/shirt-1.jpg";
  if (category.includes("shorts")) return "/products/shorts-1.jpg";
  if (category.includes("suit")) return "/products/suit-1.jpg";

  if (name.includes("tshirt") || name.includes("t-shirt")) {
    const num = (product.name.length % 9) + 1;
    return `/products/tshirt-${num}.jpg`;
  }

  return "/products/tshirt-1.jpg";
};
