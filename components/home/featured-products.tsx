import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../common/product-card";
import { Product } from "@/features/store/storeApi";

export function FeaturedProducts() {
  // const featured = products.filter((p) => p.isNew).slice(0, 4);
  const featured: [] | Product[] = [];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-sm text-muted-foreground mb-2 block">
              New Arrivals
            </span>
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Products
            </h2>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              See All{" "}
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
