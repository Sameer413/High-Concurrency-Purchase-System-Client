"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../common/product-card";
import { Product } from "@/features/store/storeApi";

export function BestSellers() {
  // Sort by reviews (most reviewed = best sellers)
  // const bestSellers = [...products]
  //   .sort((a, b) => b.reviews - a.reviews)
  //   .slice(0, 4);

  const bestSellers: [] | Product[] = [];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-sm text-muted-foreground mb-2 block">
              Top rated
            </span>
            <h2 className="text-2xl md:text-3xl font-bold">Best Sellers</h2>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              See All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
