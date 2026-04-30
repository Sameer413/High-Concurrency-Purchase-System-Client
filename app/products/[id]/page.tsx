"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetProductAvailabilityQuery,
  useGetProductByIdQuery,
  useAddToCartMutation,
} from "@/features/products/productsApi";
import { getProductImage } from "@/lib/get-product-image";
import ColorSelection from "@/components/product-detail/color-selection";
import SizeSelection from "@/components/product-detail/size-selection";
import ProductActions from "@/components/product-detail/product-actions";
import { useIsFavoriteQuery } from "@/features/products/favoriteApi";
import { skipToken } from "@reduxjs/toolkit/query";
import QuantitySelector from "@/components/product-detail/quantity-selector";
import ProductInfo from "@/components/product-detail/product-info";
import ProductError from "@/components/product-detail/product-error";
import { toast } from "sonner";

import ProductImage from "@/components/product-detail/product-image";

// import { Header } from "@/components/common/header";
// import { Footer } from "@/components/common/footer";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : undefined;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);

  // Temp
  const { data: isFavorite } = useIsFavoriteQuery(id ?? skipToken);

  // Temp

  const { data, isLoading, isError } = useGetProductByIdQuery(
    typeof id === "string" ? id : "",
  );
  const product = data?.data;

  const { data: availabilityData, isLoading: availabilityLoading } =
    useGetProductAvailabilityQuery(typeof id === "string" ? id : "", {
      skip: !id || isPurchased,
    });

  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites");
      }
    }
  }, []);

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor,
      }).unwrap();

      toast.success("Added to cart!", {
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart", {
        description: "Please try again",
      });
    }
  };

  if (isError || !product) {
    return <ProductError />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <ProductImage product={product} />

            {/* Product Info */}
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="w-fit mb-4 -ml-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {/* Product Information */}
              <ProductInfo product={product} />

              {/* Color Selection */}
              <ColorSelection
                colors={product.colors || null}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />

              {/* Size Selection */}
              <SizeSelection
                sizes={product.sizes || null}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />

              {/* Quantity */}
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

              {/* Actions */}
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: getProductImage(product),
                }}
                availability={availabilityData?.data}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                onAddToCart={handleAddToCart}
                isFavorite={isFavorite?.data.isFavorite}
                onBuyNowSuccess={() => setIsPurchased(true)}
                addToCartLoading={addToCartLoading}
              />
            </div>
          </div>

          {/* Related Products */}
        </div>
      </main>
    </div>
  );
}

{
  /* {relatedProducts.length > 0 && (
            <section className="mt-16 md:mt-24">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isFavorite={favorites.includes(p.id)}
                    // onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )} */
}
