"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { getProductImage } from "@/lib/get-product-image";
import { Product } from "@/types/types";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const favorite = isFavorite || false;

  return (
    <div className="group">
      <div className="relative aspect-3/4 bg-secondary rounded-lg overflow-hidden mb-3">
        <Link href={`/products/${product.id}`}>
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          /> */}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-foreground text-background">New</Badge>
          )}
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full"
            onClick={() => onToggleFavorite(product.id)}
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-foreground" : ""}`} />
            <span className="sr-only">Add to favorites</span>
          </Button>
        )}

        {/* Color Options */}
        {product.colors && product.colors.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {product?.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-background/50"
                style={{
                  backgroundColor:
                    color === "Black"
                      ? "#000"
                      : color === "White"
                        ? "#fff"
                        : color === "Navy"
                          ? "#1a365d"
                          : color === "Gray"
                            ? "#6b7280"
                            : color === "Beige"
                              ? "#d4c5b9"
                              : color === "Olive"
                                ? "#556b2f"
                                : color === "Blue"
                                  ? "#3b82f6"
                                  : color === "Red"
                                    ? "#dc2626"
                                    : color === "Khaki"
                                      ? "#c3b091"
                                      : color === "Light Blue"
                                        ? "#93c5fd"
                                        : color === "Charcoal"
                                          ? "#374151"
                                          : "#ccc",
                }}
                title={color}
              />
            ))}
            {product.colors && product.colors.length > 4 && (
              <span className="text-xs text-background bg-foreground/70 rounded-full px-1.5 flex items-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <Link href={`/products/${product.id}`}>
        <h3 className="font-medium text-sm mb-1 group-hover:underline">
          {product.name}
        </h3>
      </Link>
      <p className="text-sm text-muted-foreground">$ {product.price}</p>
    </div>
  );
}
