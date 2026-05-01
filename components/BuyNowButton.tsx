"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useBuyNowMutation } from "@/features/products/productsApi";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface BuyNowButtonProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function BuyNowButton({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  disabled = false,
  className = "",
  onSuccess,
}: BuyNowButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const [handleBuyNowMutation, { data, isLoading, error: mutationError }] =
    useBuyNowMutation();

  const handleBuyNow = async () => {
    if (disabled || isLoading) return;

    setError("");

    try {
      const result = await handleBuyNowMutation({
        productId: product.id,
        quantity,
      }).unwrap();

      if (result.success || result.data?.success) {
        console.log("✅ Success - navigating to checkout");
        // Notify parent of success to skip refetches
        onSuccess?.();

        // Create a cart item structure for checkout
        const checkoutItem = {
          productId: product.id,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          },
          quantity,
          selectedSize,
          selectedColor,
        };

        // Encode the product data and navigate to checkout
        router.push(
          `/checkout?buyNow=true&productId=${product.id}&reservationId=${data?.data.reservationId}`,
        );
      } else {
        // const available = result.data?.availableStock ?? 0;
        const available = result.data?.success ? 0 : 0;
      }
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to reserve stock. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleBuyNow}
        disabled={disabled || isLoading}
        className={className}
        variant="default"
      >
        {isLoading ? "Reserving..." : "Buy Now"}
      </Button>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
}
