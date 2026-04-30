import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CollectionsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Summer Collection */}
          <div className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <span className="text-sm font-medium tracking-wider text-muted-foreground mb-4">
                SUMMER 2024
              </span>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                New
                <br />
                Collection
              </h3>
              <Link href="/products">
                <Button className="rounded-full px-8">Go To Shop</Button>
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/products?category=T-Shirts"
              className="aspect-square bg-muted rounded-xl flex items-center justify-center text-lg font-medium hover:bg-muted/80 transition-colors"
            >
              T-Shirts
            </Link>
            <Link
              href="/products?category=Jeans"
              className="aspect-square bg-muted rounded-xl flex items-center justify-center text-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Jeans
            </Link>
            <Link
              href="/products?category=Jackets"
              className="aspect-square bg-muted rounded-xl flex items-center justify-center text-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Jackets
            </Link>
            <Link
              href="/products?category=Suits"
              className="aspect-square bg-muted rounded-xl flex items-center justify-center text-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Coats
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
