import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuyNowButton } from "../BuyNowButton";
import { useToggleFavoriteMutation } from "@/features/products/favoriteApi";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  availability?: {
    availableStock: number;
    canBuy: boolean;
  };
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onAddToCart?: () => void;
  isFavorite?: boolean;
  onBuyNowSuccess?: () => void;
  addToCartLoading?: boolean;
}

const ProductActions = ({
  product,
  availability,
  selectedSize,
  selectedColor,
  quantity,
  onAddToCart,
  isFavorite = false,
  onBuyNowSuccess,
  addToCartLoading = false,
}: ProductActionsProps) => {
  const isDisabled = !selectedSize || !selectedColor;

  const [favorite, setFavorite] = React.useState(isFavorite);

  const [toggleFavorite, { isLoading: favoriteToggleLoading }] =
    useToggleFavoriteMutation();

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteToggle = () => {
    if (favoriteToggleLoading) return; // Prevent multiple clicks while loading

    const previous = favorite;

    // Optimistically update UI
    setFavorite(!favorite);

    try {
      toggleFavorite({ productId: product.id }).unwrap();
    } catch (error) {
      setFavorite(previous);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Primary Actions */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        {/* Add to Cart */}
        <Button
          size="lg"
          className="h-12 w-full text-sm font-semibold tracking-wide"
          onClick={onAddToCart}
          disabled={isDisabled || addToCartLoading}
        >
          {addToCartLoading ? "ADDING..." : "ADD TO CART"}
        </Button>

        {/* Wishlist */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-md border"
          aria-label="Add to wishlist"
          onClick={handleFavoriteToggle}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all",
              favorite && "fill-current text-red-500",
            )}
          />
        </Button>
      </div>

      {/* Buy Now */}
      <BuyNowButton
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
        disabled={isDisabled || (availability && !availability.canBuy)}
        onSuccess={onBuyNowSuccess}
        className="h-12 w-full text-sm font-semibold tracking-wide bg-black text-white hover:bg-black/90"
      />

      {isDisabled && (
        <p className="text-xs text-red-500 text-center">
          Please select size and color
        </p>
      )}

      {/* Trust Info */}
      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-1">
        <p>🚚 Fast Delivery</p>
        <p>🔒 Secure Checkout</p>
        <p>↩️ Easy Returns</p>
        <p>💳 Multiple Payment Options</p>
      </div>
    </div>
  );
};

export default ProductActions;
