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
  quantity?: number;
  disabled?: boolean;
  className?: string;
  onSuccess?: () => void;
  selectedSize?: string;
  selectedColor?: string;
}

export function BuyNowButton({
  product,
  quantity = 1,
  disabled = false,
  className = "",
  onSuccess,
  selectedSize,
  selectedColor,
}: BuyNowButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const [handleBuyNowMutation, { isLoading }] = useBuyNowMutation();

  const handleBuyNow = async () => {
    if (disabled || isLoading) return;

    setError("");

    try {
      // Build the complete ReservationItemDTO
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;

      const result = await handleBuyNowMutation({
        items: [
          {
            productId: product.id,
            quantity,
            unitPrice,
            totalPrice,
            currency: "INR",
            productName: product.name,
            selectedSize,
            selectedColor,
          },
        ],
      }).unwrap();

      if (result.success && result.data?.reservationId) {
        // Notify parent of success to skip refetches
        onSuccess?.();

        // Navigate to checkout with only reservationId
        router.push(`/checkout?reservationId=${result.data.reservationId}`);
      } else {
        setError("Failed to create reservation. Please try again.");
      }
    } catch (err: any) {
      console.error("Buy now error:", err);
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
