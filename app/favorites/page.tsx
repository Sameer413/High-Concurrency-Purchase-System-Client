"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/common/product-card";
import { useGetFavoritesQuery } from "@/features/products/favoriteApi";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

type SortType =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";
const LIMIT = 12;

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [items, setItems] = useState<any[]>([]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // API calls
  const { data, isLoading, isFetching, isError } = useGetFavoritesQuery({
    page,
    limit: LIMIT,
    sort: sortBy,
  });

  const responseItems = data?.data.items || [];
  const meta = data?.data?.meta;

  useEffect(() => {
    if (!data) return;

    const incoming = data.data.items;

    if (page === 1) {
      setItems(incoming);
    } else {
      setItems((prev) => {
        const existingIds = new Set(prev.map((x) => x.id));

        const fresh = incoming.filter((x) => !existingIds.has(x.id));

        return [...prev, ...fresh];
      });
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetching && meta?.hasNext) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isFetching, meta?.hasNext]);

  const count = useMemo(() => items.length, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            {" / "}
            <span className="text-foreground">Wishlist</span>
          </nav>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  My Wishlist
                </h1>
                <p className="text-muted-foreground">
                  {items.length} item
                  {items.length !== 1 ? "s" : ""} saved
                </p>
              </div>
              <Link href="/products">
                <Button className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading favorites...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-secondary/30 rounded-lg">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Start adding your favorite items to keep track of them
              </p>
              <Link href="/products">
                <Button variant="default">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Controls Bar */}
              <div className="bg-secondary/40 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-border rounded bg-background text-sm text-foreground"
                  >
                    <option value="newest">Sort: Newest</option>

                    <option value="oldest">Sort: Oldest</option>

                    <option value="price_asc">Price: Low to High</option>

                    <option value="price_desc">Price: High to Low</option>

                    <option value="name_asc">Name: A to Z</option>

                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((product) => (
                  <div key={product.id} className="relative group">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2"></div>
                    <ProductCard product={product.product} />
                  </div>
                ))}
              </div>
              <div
                ref={loaderRef}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                {isFetching && meta?.hasNext
                  ? "Loading more..."
                  : !meta?.hasNext
                    ? "No more items"
                    : ""}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
