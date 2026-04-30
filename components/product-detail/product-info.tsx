import { Product } from "@/types/types";
import React from "react";

type ProductInfoProps = {
  product: Product;
};

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= Math.round(product.rating)
                  ? "text-foreground"
                  : "text-muted"
              }
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          ({product.reviews} reviews)
        </span>
      </div>

      <p className="text-3xl font-bold mb-6">${product.price}</p>
      <p className="text-sm text-muted-foreground mb-1">
        MRP incl. of all taxes
      </p>

      <p className="text-muted-foreground mb-8 leading-relaxed">
        {product.description}
      </p>
    </>
  );
};

export default ProductInfo;
