import { Product } from "@/types/types";
import { Badge } from "../ui/badge";
import { getProductImage } from "@/lib/get-product-image";
import Image from "next/image";

type ProductImageProps = {
  product: Product;
};

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  return (
    <div className="relative aspect-3/4 bg-secondary rounded-2xl overflow-hidden">
      <Image
        src={getProductImage(product)}
        alt={product.name}
        fill
        className="object-cover"
        loading="eager"
      />
      {product.isNew && (
        <Badge className="absolute top-4 left-4 bg-foreground text-background">
          New
        </Badge>
      )}
    </div>
  );
};

export default ProductImage;
