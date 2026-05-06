"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, Heart } from "lucide-react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
} from "@/features/products/productsApi";
import { useIsFavoriteQuery, useToggleFavoriteMutation } from "@/features/products/favoriteApi";
import { toast } from "sonner";

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      image: string | null;
    };
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}) {
  const { data: favoriteData } = useIsFavoriteQuery(item.product.id);
  const isFavorite = favoriteData?.data?.isFavorite || false;
  const [toggleFavorite] = useToggleFavoriteMutation();

  const handleFavoriteToggle = () => {
    toggleFavorite({ productId: item.product.id })
      .unwrap()
      .catch(console.error);
  };

  return (
    <div
      key={item.id}
      className="flex gap-4 p-4 bg-secondary rounded-xl"
    >
      <Link
        href={`/products/${item.product.id}`}
        className="relative w-24 h-32 bg-muted rounded-lg overflow-hidden shrink-0"
      >
        <Image
          src={item.product.image || "/products/placeholder.jpg"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/products/${item.product.id}`}
              className="font-medium hover:underline"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {item.selectedColor}/{item.selectedSize}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                item.quantity > 1
                  ? onUpdateQuantity(item.id, item.quantity - 1)
                  : onRemove(item.id)
              }
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isFavorite ? "fill-foreground" : ""
                  }`}
              />
              Save
            </Button>
            <p className="font-medium">
              $ {item.product.price * item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartQuantity] = useUpdateCartQuantityMutation();

  const cartItems = cartData?.data?.items || [];
  const { subtotal, shipping, tax, grandTotal } = cartData?.data?.summary || {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    grandTotal: 0,
  };

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId)
      .unwrap()
      .then(() => {
        toast.success("Removed", {
          description: "Item removed from cart",
        });
      })
      .catch(console.error);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateCartQuantity({ itemId, quantity })
      .unwrap()
      .catch(console.error);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            {" / "}
            <span>Products</span>
          </nav>

          <div className="flex items-center gap-8 mb-8">
            <h1 className="text-2xl font-bold">Shopping bag</h1>
            <Link
              href="/favorites"
              className="text-muted-foreground hover:text-foreground"
            >
              favorites
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-secondary rounded-xl p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-semibold mb-6">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Checkout
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Tax included. Shipping calculated at checkout.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
